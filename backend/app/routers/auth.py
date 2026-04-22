from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail já cadastrado",
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        senha_hash=hash_password(user_data.senha),
        tipo=user_data.tipo,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos",
        )

    token = create_access_token({"sub": str(user.id), "tipo": user.tipo})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }
