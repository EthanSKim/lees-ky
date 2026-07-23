def test_get_restaurant_info_default(client):
    response = client.get("/restaurant-info")
    assert response.status_code == 200
    body = response.json()
    assert body["phone"] is None
    assert body["hours"] == {}
    assert body["closure_active"] is False


def test_update_restaurant_info(client, auth_headers):
    response = client.patch(
        "/admin/restaurant-info",
        json={
            "phone": "(502) 456-9714",
            "address": "1941 Bishop Ln, Ste 107, Louisville, KY 40218",
            "hours": {
                "mon": [{"open": "11:00", "close": "14:00"}, {"open": "17:00", "close": "22:00"}],
                "sun": [],
            },
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["phone"] == "(502) 456-9714"
    assert body["hours"]["sun"] == []
    assert len(body["hours"]["mon"]) == 2

    # Confirm it's actually persisted, not just echoed back
    public_response = client.get("/restaurant-info")
    assert public_response.json()["phone"] == "(502) 456-9714"


def test_closure_banner_toggle(client, auth_headers):
    response = client.patch(
        "/admin/restaurant-info",
        json={"closure_active": True, "closure_message": "Closed for a family wedding July 20"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["closure_active"] is True


def test_restaurant_info_update_requires_auth(client):
    response = client.patch("/admin/restaurant-info", json={"phone": "555-1234"})
    assert response.status_code == 401
