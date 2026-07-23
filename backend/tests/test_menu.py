def create_category(client, auth_headers, name="Appetizers", display_order=1):
    response = client.post(
        "/admin/categories",
        json={"name": name, "display_order": display_order},
        headers=auth_headers,
    )
    assert response.status_code == 201
    return response.json()


def create_item(client, auth_headers, category_id, **overrides):
    payload = {
        "category_id": category_id,
        "name_en": "Kimbap",
        "name_kr": "김밥",
        "description": "Seaweed rice rolls",
        "price": 8.99,
        "spice_level": 0,
        "is_available": True,
    }
    payload.update(overrides)
    response = client.post("/admin/menu-items", json=payload, headers=auth_headers)
    assert response.status_code == 201
    return response.json()


def test_public_menu_empty_by_default(client):
    response = client.get("/menu")
    assert response.status_code == 200
    assert response.json() == []


def test_public_menu_shows_available_items(client, auth_headers):
    category = create_category(client, auth_headers)
    create_item(client, auth_headers, category["id"])

    response = client.get("/menu")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["name"] == "Appetizers"
    assert len(body[0]["items"]) == 1
    assert body[0]["items"][0]["name_en"] == "Kimbap"


def test_unavailable_items_hidden_from_public_menu(client, auth_headers):
    category = create_category(client, auth_headers)
    item = create_item(client, auth_headers, category["id"], is_available=False)

    public_response = client.get("/menu")
    assert public_response.json() == []

    admin_response = client.get("/admin/categories", headers=auth_headers)
    admin_items = admin_response.json()[0]["items"]
    assert len(admin_items) == 1
    assert admin_items[0]["id"] == item["id"]


def test_category_with_only_unavailable_items_omitted_from_public_menu(client, auth_headers):
    category = create_category(client, auth_headers)
    create_item(client, auth_headers, category["id"], is_available=False)

    response = client.get("/menu")
    assert response.json() == []


def test_update_menu_item_price(client, auth_headers):
    category = create_category(client, auth_headers)
    item = create_item(client, auth_headers, category["id"])

    response = client.patch(
        f"/admin/menu-items/{item['id']}",
        json={"price": 9.99},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["price"] == 9.99


def test_create_item_with_invalid_category_returns_404(client, auth_headers):
    response = client.post(
        "/admin/menu-items",
        json={
            "category_id": 9999,
            "name_en": "Kimbap",
            "price": 8.99,
        },
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_delete_menu_item(client, auth_headers):
    category = create_category(client, auth_headers)
    item = create_item(client, auth_headers, category["id"])

    delete_response = client.delete(f"/admin/menu-items/{item['id']}", headers=auth_headers)
    assert delete_response.status_code == 204

    admin_response = client.get("/admin/categories", headers=auth_headers)
    assert admin_response.json()[0]["items"] == []


def test_delete_category_cascades_to_items(client, auth_headers):
    category = create_category(client, auth_headers)
    create_item(client, auth_headers, category["id"])

    delete_response = client.delete(f"/admin/categories/{category['id']}", headers=auth_headers)
    assert delete_response.status_code == 204

    admin_response = client.get("/admin/categories", headers=auth_headers)
    assert admin_response.json() == []


def test_negative_price_rejected(client, auth_headers):
    category = create_category(client, auth_headers)
    response = client.post(
        "/admin/menu-items",
        json={"category_id": category["id"], "name_en": "Kimbap", "price": -5},
        headers=auth_headers,
    )
    assert response.status_code == 422
