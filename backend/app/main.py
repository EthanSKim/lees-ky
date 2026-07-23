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
