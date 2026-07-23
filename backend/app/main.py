from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import (
    admin_menu,
    admin_restaurant_info,
    admin_uploads,
    auth,
    health,
    menu,
    restaurant_info,
)
from app.config import settings

app = FastAPI(title="Lee's Korean Restaurant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(restaurant_info.router)
app.include_router(admin_menu.router)
app.include_router(admin_restaurant_info.router)
app.include_router(admin_uploads.router)


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    """Bare landing route so platform health checks hitting / (rather than
    the app's own /health) get a 200 instead of a 404. Some hosts (e.g.
    Render) default to checking / with a HEAD request and cancel a deploy
    on anything other than a 2xx/3xx response there - both GET and HEAD
    are handled explicitly since FastAPI doesn't add HEAD support
    automatically for a GET-only route."""
    return {"service": "Lee's Korean Restaurant API", "status": "ok"}
