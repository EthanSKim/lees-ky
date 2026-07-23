def test_login_success(client, admin_token):
    assert admin_token  # fixture already asserted a 200 + token; sanity check it's non-empty


def test_login_wrong_password(client, admin_token):
    response = client.post(
        "/auth/login",
        json={"email": "owner@leeskorean.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_unknown_email(client):
    response = client.post(
        "/auth/login",
        json={"email": "nobody@leeskorean.com", "password": "whatever123"},
    )
    assert response.status_code == 401


def test_admin_route_requires_token(client):
    response = client.post("/admin/categories", json={"name": "Appetizers", "display_order": 1})
    assert response.status_code == 401


def test_admin_route_rejects_bad_token(client):
    response = client.post(
        "/admin/categories",
        json={"name": "Appetizers", "display_order": 1},
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


def test_admin_route_accepts_valid_token(client, auth_headers):
    response = client.post(
        "/admin/categories",
        json={"name": "Appetizers", "display_order": 1},
        headers=auth_headers,
    )
    assert response.status_code == 201


def test_me_returns_current_admin(client, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "owner@leeskorean.com"


def test_me_requires_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401
