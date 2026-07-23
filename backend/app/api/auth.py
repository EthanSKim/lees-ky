from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AdminUser
from app.schemas import AdminLogin, AdminUserResponse, Token
from app.security import create_access_token, decode_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

# tokenUrl is used by the /docs UI to know where to send login requests; it doesn't
# affect our actual login route below, which accepts a JSON body rather than form data.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


@router.post("/login", response_model=Token)
def login(credentials: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.email).first()

    # Compare against a dummy hash even when no user is found, so the response
    # time doesn't leak whether the email exists.
    if admin is None:
        verify_password(credentials.password, pwd_hash_for_timing_safety())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(subject=admin.email)
    return Token(access_token=token)


def pwd_hash_for_timing_safety() -> str:
    # A fixed, valid bcrypt hash with no matching plaintext password.
    return "$2b$12$C6UzMDM.H6dfI/f/IKcEeO0ZxU8/rWlJHmC7X4M9uy0F5oL8V8b3W"


def get_current_admin(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AdminUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token is None:
        raise unauthorized

    email = decode_access_token(token)
    if email is None:
        raise unauthorized

    admin = db.query(AdminUser).filter(AdminUser.email == email).first()
    if admin is None:
        raise unauthorized

    return admin


@router.get("/me", response_model=AdminUserResponse)
def get_me(admin: AdminUser = Depends(get_current_admin)):
    """Lets the frontend validate a stored token on load and show who's logged in."""
    return admin
