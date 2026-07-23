def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_returns_200(client):
    """Some hosts (e.g. Render) health-check / by default rather than
    /health, and cancel the deploy on anything other than a 2xx/3xx there."""
    response = client.get("/")
    assert response.status_code == 200


def test_root_head_returns_200(client):
    # Render's default check is specifically a HEAD request, not GET.
    response = client.head("/")
    assert response.status_code == 200
