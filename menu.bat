@echo off
title QuantumPay - Menú Principal
color 0A

:menu
cls
echo ===============================
echo        QUANTUMPAY - MENU
echo ===============================
echo [1] Instalar dependencias
echo [2] Iniciar sistema
echo [3] Reiniciar base de datos
echo [4] Ver logs
echo [5] Salir
echo ===============================
set /p option=Elige una opción [1-5]:

if "%option%"=="1" goto instalar
if "%option%"=="2" goto iniciar
if "%option%"=="3" goto resetdb
if "%option%"=="4" goto logs
if "%option%"=="5" exit

echo Opcion inválida. Intenta de nuevo.
pause
goto menu

:instalar
call install_app.bat
pause
goto menu

:iniciar
call start_app.bat
pause
goto menu

:resetdb
cls
echo Reiniciando base de datos...
cd database
docker compose down
docker compose up -d
cd ..
echo Base de datos reiniciada con éxito ✅
pause
goto menu

:logs
cls
echo ======= LOG DE INSTALACION =======
if exist install_log.txt (
    type install_log.txt
) else (
    echo No hay log de instalación disponible.
)
echo.

echo ======= LOG DE INICIO ============
if exist start_log.txt (
    type start_log.txt
) else (
    echo No hay log de inicio disponible.
)
pause
goto menu
