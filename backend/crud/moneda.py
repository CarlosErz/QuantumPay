from sqlalchemy.orm import Session
from models.moneda import Moneda
from schemas.moneda import MonedaCreate

def obtener_monedas(db: Session):
    return db.query(Moneda).all()

def obtener_moneda(db: Session, moneda_id: int):
    return db.query(Moneda).filter(Moneda.id == moneda_id).first()

def agregar_moneda(db: Session, moneda: MonedaCreate):
    nueva_moneda = Moneda(**moneda.dict())
    db.add(nueva_moneda)
    db.commit()
    db.refresh(nueva_moneda)
    return nueva_moneda

def eliminar_moneda(db: Session, moneda_id: int):
    moneda = db.query(Moneda).filter(Moneda.id == moneda_id).first()
    if moneda:
        db.delete(moneda)
        db.commit()
    return moneda
