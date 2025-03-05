from sqlalchemy import Column, Integer, String, Float
from core.database import Base

class Moneda(Base):
    __tablename__ = "monedas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    simbolo = Column(String, unique=True, nullable=False)
    valor_usd = Column(Float, nullable=False)
