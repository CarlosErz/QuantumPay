from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://quantum_admin:quantum_secret@localhost:5432/quantumpay_db")

# Configuración de SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependencia para obtener sesión de base de datos en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
