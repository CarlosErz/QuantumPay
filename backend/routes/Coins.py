from fastapi import APIRouter, Depends, HTTPException
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from core.database import get_db  
from models.Coins import Moneda  
from core.config import MONEDAS_A_PAISES
from schemas.Coins import MonedaOut, MonedaCreate  
from crud.Coins import obtener_monedas, obtener_moneda, agregar_moneda, eliminar_moneda  
from core.auth import get_current_user, verificar_admin
from dotenv import load_dotenv
import os

load_dotenv()
EXCHANGE_API_URL = os.getenv("EXCHANGE_API_URL")


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
def crear_moneda(moneda: MonedaCreate, db: Session = Depends(get_db), user=Depends(verificar_admin)):
    return agregar_moneda(db, moneda)

@router.delete("/monedas/{moneda_id}", response_model=MonedaOut)
def borrar_moneda(moneda_id: int, db: Session = Depends(get_db), user=Depends(verificar_admin)):
    moneda = eliminar_moneda(db, moneda_id)
    if moneda is None:
        raise HTTPException(status_code=404, detail="Moneda no encontrada")
    return moneda


@router.put("/actualizar-tasas/")
def actualizar_tasas(db: Session = Depends(get_db), user=Depends(verificar_admin)):
    """
    Permite a un administrador actualizar las tasas de conversión desde una API externa.
    Si no existen monedas en la base de datos, las agrega automáticamente desde la API.
    """
    response = requests.get(EXCHANGE_API_URL)

    print("API FUNCIONANDO...")

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error al obtener las tasas de cambio")

    data = response.json()
    tasas = data.get("conversion_rates", {})  # Extraer tasas de conversión
    ultima_actualizacion = data.get("time_last_update_utc", "Desconocida")

    if not tasas:
        raise HTTPException(status_code=500, detail="No se encontraron tasas en la API externa")

    monedas_actualizadas = 0
    monedas_creadas = 0

    for simbolo, tasa in tasas.items():
        nombre_pais = MONEDAS_A_PAISES.get(simbolo, simbolo)  # Obtener el nombre del país o usar el código si no está

        # Verificar si la moneda ya existe en la base de datos por nombre o símbolo
        moneda_existente = db.query(Moneda).filter(
            (Moneda.simbolo == simbolo) | (Moneda.nombre == nombre_pais)
        ).first()

        if moneda_existente:
            # Si la moneda ya existe, actualizar su tasa de conversión y fecha
            moneda_existente.valor_usd = tasa
            moneda_existente.ultima_actualizacion = datetime.utcnow()
            moneda_existente.nombre = nombre_pais  # Asegurar que el nombre sea correcto
            monedas_actualizadas += 1
        else:
            try:
                # Si la moneda no existe, agregarla automáticamente
                nueva_moneda = Moneda(
                    nombre=nombre_pais,
                    simbolo=simbolo,
                    valor_usd=tasa,
                    ultima_actualizacion=datetime.utcnow()
                )
                db.add(nueva_moneda)
                db.commit()  # Confirmar inserción inmediatamente para evitar duplicados
                monedas_creadas += 1
            except Exception as e:
                db.rollback()  # Revertir si hay un error para evitar que falle toda la transacción
                print(f"Error al insertar moneda {nombre_pais}: {e}")

    db.commit()

    return {
        "mensaje": "Tasas de cambio actualizadas exitosamente",
        "monedas_actualizadas": monedas_actualizadas,
        "monedas_creadas": monedas_creadas,
        "ultima_actualizacion": ultima_actualizacion
    }
