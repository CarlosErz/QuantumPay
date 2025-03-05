from fastapi import FastAPI
from core.database import Base, engine
from routes import monedas 

app = FastAPI(title="QuantumPay", version="1.0.0")

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"mensaje": "¡API QuantumPay funcionando!"}

# Incluir rutas
app.include_router(monedas.router)
