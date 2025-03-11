from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from core.database import Base

class Moneda(Base):
    __tablename__ = "coins"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    simbolo = Column(String, unique=True, nullable=False)
    valor_usd = Column(Float, nullable=False)
    ultima_actualizacion = Column(DateTime, default=datetime.utcnow)
