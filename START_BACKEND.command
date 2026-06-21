#!/bin/bash
cd "$(dirname "$0")"

echo "=============================="
echo "  SkaperTorget Backend Starter"
echo "=============================="
echo ""

# Django (port 8100)
echo "Installerer pakker og starter Django..."
pip3 install django djangorestframework django-cors-headers --quiet
cd gruppe9_api
python3 manage.py migrate --run-syncdb 2>/dev/null
python3 manage.py runserver 8100 &
cd ..
echo "✓ Django kjører på http://localhost:8100"
echo ""

# Help-API må startes manuelt
echo "Help-API må startes manuelt:"
echo "  cd gruppe9_api/help_api/SkaperTorget_HelpAPI"
echo "  python3 manage.py runserver 8000"
echo ""

echo "=============================="
echo "  Servere kjører!"
echo "  Gå til: http://localhost:8100"
echo "=============================="
echo "Trykk Ctrl+C for å stoppe"
wait
