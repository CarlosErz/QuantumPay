@echo off
title QuantumPay - Iniciando sistema...
setlocal enabledelayedexpansion

:: === CONFIGURACIÓN INICIAL ===
set LOGFILE=start_log.txt
echo ==== QuantumPay iniciado en %DATE% %TIME% ==== >> %LOGFILE%

:: === VERIFICAR DEPENDENCIAS ===
echo Verificando dependencias...

:: Docker
docker -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no está instalado. Instálalo y vuelve a intentar.
    echo [%DATE% %TIME%] ERROR: Docker no encontrado. >> %LOGFILE%
    pause
    exit /b
)

:: Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado. Instálalo y vuelve a intentar.
    echo [%DATE% %TIME%] ERROR: Python no encontrado. >> %LOGFILE%
    pause
    exit /b
)

:: Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado. Instálalo y vuelve a intentar.
    echo [%DATE% %TIME%] ERROR: Node.js no encontrado. >> %LOGFILE%
    pause
    exit /b
)

:: === VERIFICAR ENTORNO VIRTUAL ===
if not exist .venv\Scripts\activate.bat (
    echo [ERROR] No se encontró el entorno virtual. Ejecuta install_app.bat primero.
    echo [%DATE% %TIME%] ERROR: .venv no encontrado. >> %LOGFILE%
    pause
    exit /b
)

call .venv\Scripts\activate
if errorlevel 1 (
    echo [ERROR] No se pudo activar el entorno virtual.
    echo [%DATE% %TIME%] ERROR: Fallo activando .venv >> %LOGFILE%
    pause
    exit /b
)

echo [OK] Dependencias verificadas. >> %LOGFILE%

:: === VERIFICAR PUERTOS OCUPADOS ===
echo Verificando puertos...
for %%P in (8000 5173) do (
    netstat -ano | findstr :%%P >nul
    if not errorlevel 1 (
        echo [ERROR] El puerto %%P está en uso. Cierra la app que lo esté usando.
        echo [%DATE% %TIME%] ERROR: Puerto %%P en uso. >> %LOGFILE%
        pause
        exit /b
    )
)
echo [OK] Puertos libres. >> %LOGFILE%

:: === LEVANTAR BASE DE DATOS ===
echo Verificando base de datos...
cd database
docker ps | findstr "quantumpay_db" >nul
if errorlevel 1 (
    echo Contenedor no está corriendo. Iniciando con Docker Compose...
    docker compose up -d >> ..\%LOGFILE% 2>&1
) else (
    echo Contenedor ya está activo.
)
cd ..

timeout /t 5 >nul

:: === LEVANTAR BACKEND ===
echo Iniciando backend...
start cmd /k "cd backend  && uvicorn main:app --reload"
echo [OK] Backend iniciado. >> %LOGFILE%

timeout /t 3 >nul

:: === LEVANTAR FRONTEND ===
echo Iniciando frontend...
start cmd /k "cd frontend && npm run dev"
echo [OK] Frontend iniciado. >> %LOGFILE%

:: === ABRIR DOCUMENTACIÓN EN EL NAVEGADOR ===
timeout /t 2 >nul
start http://127.0.0.1:8000/docs

echo QuantumPay iniciado con éxito 🚀
echo [OK] QuantumPay funcionando %DATE% %TIME% >> %LOGFILE%
pause
exit /b
