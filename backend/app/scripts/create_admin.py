"""Create or update an admin account.

There is no public signup route on purpose - admin accounts for a small
family restaurant are provisioned by whoever manages the server, not through
the website itself.

Usage:
    python -m app.scripts.create_admin owner@leeskorean.com
"""
import os

from app.database import SessionLocal
from app.models import AdminUser
from app.security import hash_password


def main():
    email = os.environ.get("SEED_ADMIN_EMAIL")

    password = os.environ["SEED_ADMIN_PASSWORD"] 


    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.email == email).first()
        if admin:
            admin.hashed_password = hash_password(password)
            db.commit()
            print(f"Updated password for existing admin: {email}")
        else:
            admin = AdminUser(email=email, hashed_password=hash_password(password))
            db.add(admin)
            db.commit()
            print(f"Created admin: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
