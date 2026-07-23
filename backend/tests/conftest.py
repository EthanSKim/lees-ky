import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import AdminUser
from app.security import hash_password

TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture()
def db_session():
    """A fresh in-memory SQLite DB per test, so tests never share state."""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture()
def admin_token(client, db_session):
    """Seeds an admin user and returns a valid bearer token for it."""
    admin = AdminUser(email="owner@leeskorean.com", hashed_password=hash_password("testpass123"))
    db_session.add(admin)
    db_session.commit()

    response = client.post(
        "/auth/login",
        json={"email": "owner@leeskorean.com", "password": "testpass123"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture()
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
