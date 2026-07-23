from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, populated from environment variables / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/lees_korean"

    # Auth
    secret_key: str = "change-me-in-.env"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # CORS - the frontend origin(s) allowed to call this API
    cors_origins: list[str] = ["http://localhost:3000"]

    # File uploads
    upload_dir: str = "/app/uploads"


settings = Settings()
