from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.Users import UsuarioCreate, UsuarioOut
from crud.Users import create_usuario, get_usuario
from core.auth import create_access_token
from passlib.context import CryptContext
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    if get_usuario(db, usuario.username):
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    return create_usuario(db, usuario)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = get_usuario(db, form_data.username)
    if not usuario or not pwd_context.verify(form_data.password, usuario.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": usuario.username}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer", "username": usuario.username}
