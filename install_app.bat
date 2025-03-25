@echo off
title QuantumPay - Instalando dependencias...
setlocal enabledelayedexpansion

set LOGFILE=install_log.txt
echo ==== Instalación iniciada en %DATE% %TIME% ==== > %LOGFILE%

:: === 1. Verificar Docker y levantar base de datos ===
echo Verificando Docker...
docker -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no está instalado. Instálalo antes de continuar.
    echo [%DATE% %TIME%] ERROR: Docker no encontrado. >> %LOGFILE%
    pause
    exit /b
)

echo Levantando base de datos desde docker-compose...
cd database
docker compose up -d >> ..\%LOGFILE% 2>&1
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el contenedor de la base de datos.
    echo [%DATE% %TIME%] ERROR: Docker compose falló. >> ..\%LOGFILE%
    cd ..
    pause
    exit /b
)
cd ..
echo [OK] Base de datos lista. >> %LOGFILE%

:: === 2. Verificar Python y entorno virtual ===
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado. Instálalo antes de continuar.
    echo [%DATE% %TIME%] ERROR: Python no encontrado. >> %LOGFILE%
    pause
    exit /b
)

if exist .venv\Scripts\activate.bat (
    echo [OK] Entorno virtual ya existe. >> %LOGFILE%
) else (
    echo Creando entorno virtual...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] No se pudo crear el entorno virtual.
        echo [%DATE% %TIME%] ERROR: Fallo al crear .venv >> %LOGFILE%
        pause
        exit /b
    )
)

call .venv\Scripts\activate
if errorlevel 1 (
    echo [ERROR] No se pudo activar el entorno virtual.
    echo [%DATE% %TIME%] ERROR: Fallo al activar .venv >> %LOGFILE%
    pause
    exit /b
)

:: === 3. Instalar dependencias del backend ===
if exist backend\requirements.txt (
    echo Instalando dependencias del backend (FastAPI)...
    pip install -r backend\requirements.txt >> %LOGFILE% 2>&1
    if errorlevel 1 (
        echo [ERROR] Fallo al instalar los paquetes del backend.
        echo [%DATE% %TIME%] ERROR: pip falló >> %LOGFILE%
        pause
        exit /b
    )
    echo [OK] Dependencias de backend instaladas. >> %LOGFILE%
) else (
    echo [ADVERTENCIA] No se encontró requirements.txt en backend.
    echo [%DATE% %TIME%] ADVERTENCIA: requirements.txt no encontrado. >> %LOGFILE%
)

:: === 4. Verificar Node.js y dependencias del frontend ===
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado. Instálalo antes de continuar.
    echo [%DATE% %TIME%] ERROR: Node.js no encontrado. >> %LOGFILE%
    pause
    exit /b
)

if exist frontend\node_modules (
    echo [OK] Dependencias del frontend ya están instaladas. >> %LOGFILE%
) else (
    echo Instalando dependencias del frontend (React/Vite)...
    cd frontend
    npm install >> ..\%LOGFILE% 2>&1
    if errorlevel 1 (
        echo [ERROR] Fallo al instalar dependencias de React/Vite.
        echo [%DATE% %TIME%] ERROR: npm install falló >> ..\%LOGFILE%
        cd ..
        pause
        exit /b
    )
    cd ..
    echo [OK] Dependencias de frontend instaladas. >> %LOGFILE%
)

echo Instalación completada con éxito ✅
echo ==== Instalación exitosa en %DATE% %TIME% ==== >> %LOGFILE%
pause
exit /b
