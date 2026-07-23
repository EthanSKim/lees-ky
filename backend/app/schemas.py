from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# ---------- Menu categories ----------


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    display_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    display_order: int | None = None


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    display_order: int


# ---------- Menu items ----------


class MenuItemBase(BaseModel):
    name_en: str = Field(min_length=1, max_length=150)
    name_kr: str | None = Field(default=None, max_length=150)
    description: str | None = None
    price: float = Field(gt=0)
    spice_level: int | None = Field(default=None, ge=0, le=6)
    image_url: str | None = None
    is_available: bool = True
    is_featured: bool = False
    display_order: int = 0

    @field_validator("price")
    @classmethod
    def round_price(cls, v: float) -> float:
        return round(v, 2)


class MenuItemCreate(MenuItemBase):
    category_id: int


class MenuItemUpdate(BaseModel):
    category_id: int | None = None
    name_en: str | None = Field(default=None, min_length=1, max_length=150)
    name_kr: str | None = Field(default=None, max_length=150)
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    spice_level: int | None = Field(default=None, ge=0, le=6)
    image_url: str | None = None
    is_available: bool | None = None
    is_featured: bool | None = None
    display_order: int | None = None


class MenuItemResponse(MenuItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int


class CategoryWithItemsResponse(CategoryResponse):
    items: list[MenuItemResponse] = []


# ---------- Restaurant info ----------


class DayHours(BaseModel):
    open: str
    close: str


class RestaurantInfoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    phone: str | None = None
    address: str | None = None
    hours: dict[str, list[DayHours]] = {}
    closure_message: str | None = None
    closure_active: bool = False
    updated_at: datetime


class RestaurantInfoUpdate(BaseModel):
    phone: str | None = None
    address: str | None = None
    hours: dict[str, list[DayHours]] | None = None
    closure_message: str | None = None
    closure_active: bool | None = None


# ---------- Auth ----------


class AdminLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
