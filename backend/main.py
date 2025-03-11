from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from routes import Coins, Users

app = FastAPI(
    title="QuantumPay",
    description="API para la conversión de moneda",
    version="1.0.0",
)

# Lista de dominios permitidos
allowed_origins = [
    "http://localhost:5173",  # Vite en desarrollo
    "http://127.0.0.1:5173",  # Alternativa en local
    "https://mi-app-frontend.com",  # Dominio en producción
]

# Configurar CORS con la lista de URLs permitidas
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Solo estos dominios pueden acceder
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Métodos permitidos
    allow_headers=["Authorization", "Content-Type"],  # Solo estos headers
)

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"mensaje": "¡API QuantumPay funcionando!"}

# Incluir rutas
app.include_router(Coins.router)
app.include_router(Users.router)
