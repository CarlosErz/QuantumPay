from sqlalchemy import Column,Integer, String
from core.database import Base

class Usuarios(Base): 
    __tablename__ = "Usuarios"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    rol = Column(String, default="usuario")