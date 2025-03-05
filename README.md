# QuantumPay 🏦💰
### API para Gestión y Conversión de Monedas

QuantumPay es un sistema basado en **FastAPI y PostgreSQL** que permite la gestión de monedas y la actualización automática de tasas de cambio desde una API externa. Además, implementa autenticación con **JWT** para proteger las rutas administrativas.

---

## 🚀 Características Principales
✅ **Gestión de Monedas:** Agregar, listar y eliminar monedas en la base de datos.  
✅ **Tasas de Cambio Automáticas:** Actualización desde API externa en tiempo real.  
✅ **Autenticación JWT:** Registro e inicio de sesión de usuarios.  
✅ **Autorización:** Solo administradores pueden agregar o eliminar monedas.  
✅ **Documentación Swagger UI:** Disponible en `/docs`.  

---

## 📁 **Estructura del Proyecto**
```
📂 QuantumPay
 ├── 📂 backend
 │   ├── 📂 core         # Configuración (DB, logs, .env)
 │   │   ├── database.py # Conexión a PostgreSQL
 │   │   ├── config.py   # Variables de entorno
 │   ├── 📂 models       # Modelos de base de datos (SQLAlchemy)
 │   ├── 📂 schemas      # Esquemas de validación (Pydantic)
 │   ├── 📂 crud         # Operaciones CRUD en la base de datos
 │   ├── 📂 routes       # Endpoints de FastAPI
 │   ├── main.py         # Punto de entrada FastAPI
 │   ├── requirements.txt # Dependencias del backend
 ├── 📂 database
 │   ├── docker-compose.yml # Configuración Docker de PostgreSQL
 ├── 📂 frontend (pendiente)
 ├── .env                # Variables de entorno
 ├── README.md            # Documentación del proyecto
```

---

## ⚡ **1. Instalación y Configuración**
### **🔹 Requisitos previos**
- 🐍 **Python 3.10+**
- 🐳 **Docker y Docker Compose**
- 🐍 **Virtualenv (`venv`)**

### **🔹 Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/QuantumPay.git
cd QuantumPay
```

### **🔹 Configurar el entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### **🔹 Instalar dependencias**
```bash
pip install -r backend/requirements.txt
```

---

## 🛠 **2. Configurar la Base de Datos en Docker**
📌 **Edita `.env` en `backend/core/.env` y revisa que la URL sea correcta:**
```
DATABASE_URL=postgresql://quantum_admin:quantum_secret@localhost:5432/quantumpay_db
SECRET_KEY=Tusecretkey
EXCHANGE_API_URL=https://v6.exchangerate-api.com/v6/tu_api/latest/MXN

```

📌 **Levanta PostgreSQL con Docker:**
```bash
docker-compose -f database/docker-compose.yml up -d
```
📌 **Acceder a PostgreSQL desde Docker:**
```bash
docker exec -it quantumpay_postgres psql -U quantum_admin -d quantumpay_db
```

---

## 🚀 **3. Ejecutar FastAPI**
📌 **Corre FastAPI con recarga automática:**
```bash
uvicorn backend.main:app --reload
```
📌 **Verifica la API en Swagger UI:**
🔗 [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)

---

## 📌 **4. Endpoints de la API**
### **📌 Gestión de Monedas**
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| **GET** | `/` | Verifica si la API está funcionando |
| **GET** | `/monedas/` | Obtiene la lista de todas las monedas |
| **GET** | `/monedas/{moneda_id}` | Obtiene los detalles de una moneda |
| **POST** | `/monedas/` 🔐 (Admin Required) | Crea una nueva moneda |
| **DELETE** | `/monedas/{moneda_id}` 🔐 (Admin Required) | Elimina una moneda |

📌 **Ejemplo de `POST /monedas/` en JSON:**
```json
{
  "nombre": "Euro",
  "simbolo": "EUR",
  "valor_usd": 0.92
}
```

### **📌 Actualización de Tasas de Cambio**
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| **PUT** | `/actualizar-tasas/` 🔐 (Admin Required) | Obtiene tasas de cambio en tiempo real y actualiza la base de datos |

### **📌 Autenticación y Registro de Usuarios**
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| **POST** | `/registro/` | Registra un nuevo usuario |
| **POST** | `/login/` | Inicia sesión y obtiene un `access_token` |

📌 **Ejemplo de `POST /login/` en JSON:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

---

## 🔥 **5. Despliegue**
Para desplegar en producción:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Para desplegar con Docker Compose:
```bash
docker-compose -f database/docker-compose.yml up --build -d
```

---

## 📜 **6. Licencia**
Este proyecto está bajo la **Licencia MIT**.

---

🚀 **¡Listo para cambiar el mundo con QuantumPay!** 🌎💰  
📌 **¿Dudas o sugerencias? Contáctame en GitHub.**  
