@echo off
title SkaperTorget Backend Starter
cd /d "%~dp0"

echo ==============================
echo   SkaperTorget Backend Starter
echo ==============================
echo.

echo Installerer pakker og starter Django...
pip install django djangorestframework django-cors-headers --quiet
cd gruppe9_api
python manage.py migrate --run-syncdb 2>nul
start "Django" cmd /k "python manage.py runserver 8100"
cd ..
echo ✓ Django starter på http://localhost:8100
echo.

echo Help-API må startes manuelt:
echo cd gruppe9_api\help_api\SkaperTorget_HelpAPI
echo python manage.py runserver 8000
echo.

echo ==============================
echo   Servere kjører!
echo   Gå til: http://localhost:8100
echo ==============================
echo.
pause
