from pydantic import BaseModel

class MonedaBase(BaseModel):
    nombre: str
    simbolo: str
    valor_usd: float

class MonedaCreate(MonedaBase):
    pass

class MonedaOut(MonedaBase):
    id: int

    class Config:
        from_attributes = True  
