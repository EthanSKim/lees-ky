from datetime import UTC, datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(UTC)


class MenuCategory(Base):
    """A menu section, e.g. 'Appetizers', 'BBQ', 'Soups & Stews'."""

    __tablename__ = "menu_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    items: Mapped[list["MenuItem"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan",
        order_by="MenuItem.display_order",
    )


class MenuItem(Base):
    """A single dish within a category."""

    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("menu_categories.id", ondelete="CASCADE"), nullable=False
    )
    name_en: Mapped[str] = mapped_column(String(150), nullable=False)
    name_kr: Mapped[str | None] = mapped_column(String(150), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    # 0 = not spicy / not applicable, 1-6 matches the restaurant's own spice scale.
    spice_level: Mapped[int | None] = mapped_column(Integer, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Hand-picked by the admin to appear in the homepage preview. The public
    # Menu page itself is text-only (no photos), so only featured items ever
    # need a real image_url.
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    category: Mapped["MenuCategory"] = relationship(back_populates="items")


class RestaurantInfo(Base):
    """Single-row table holding hours, contact info, and closure announcements.

    Modeled as one row (id is always 1) rather than a key/value table, since the
    admin UI edits all of this together as one form.
    """

    __tablename__ = "restaurant_info"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    # {"mon": [{"open": "11:00", "close": "14:00"}, {"open": "17:00", "close": "22:00"}], "sun": []}
    # An empty list means closed that day.
    hours: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    closure_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    closure_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )


class AdminUser(Base):
    """A restricted admin account that can manage the menu and restaurant info."""

    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
