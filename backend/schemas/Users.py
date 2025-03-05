from pydantic import BaseModel

class UsuarioBase(BaseModel):
    username: str

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioOut(UsuarioBase):
    id: int
    rol: str

    class Config:
        from_attributes = True 
