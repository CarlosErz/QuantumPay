from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db  
from models.moneda import Moneda  
from schemas.moneda import MonedaOut, MonedaCreate  
from crud.moneda import obtener_monedas, obtener_moneda, agregar_moneda, eliminar_moneda  

router = APIRouter()

@router.get("/monedas/", response_model=list[MonedaOut])
def listar_monedas(db: Session = Depends(get_db)):
    return obtener_monedas(db)

@router.get("/monedas/{moneda_id}", response_model=MonedaOut)
def obtener_moneda_id(moneda_id: int, db: Session = Depends(get_db)):
    moneda = obtener_moneda(db, moneda_id)
    if moneda is None:
        raise HTTPException(status_code=404, detail="Moneda no encontrada")
    return moneda

@router.post("/monedas/", response_model=MonedaOut)
def crear_moneda(moneda: MonedaCreate, db: Session = Depends(get_db)):
    return agregar_moneda(db, moneda)

@router.delete("/monedas/{moneda_id}", response_model=MonedaOut)
def borrar_moneda(moneda_id: int, db: Session = Depends(get_db)):
    moneda = eliminar_moneda(db, moneda_id)
    if moneda is None:
        raise HTTPException(status_code=404, detail="Moneda no encontrada")
    return moneda
