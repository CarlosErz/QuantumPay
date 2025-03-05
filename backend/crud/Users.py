from sqlalchemy.orm import Session
from models.Users import Usuarios
from schemas.Users import UsuarioCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_usuario(db: Session, username: str):
    return db.query(Usuarios).filter(Usuarios.username == username).first()

def create_usuario(db: Session, usuario: UsuarioCreate, rol="usuario"):
    hashed_password = pwd_context.hash(usuario.password)
    nuevo_usuario = Usuarios(username=usuario.username, hashed_password=hashed_password, rol=rol)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario
