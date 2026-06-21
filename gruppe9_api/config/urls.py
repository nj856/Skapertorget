from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse
import os

def serve_html(request, filename):
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return FileResponse(open(os.path.join(base, '..', filename), 'rb'), content_type='text/html')

def serve_image(request, filename):
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return FileResponse(open(os.path.join(base, '..', 'bilder', filename), 'rb'), content_type='image/jpeg')

urlpatterns = [
    path('api/', include('clothing.urls')),
    path('api/', include('feedback.urls')),
    path('api/profil/', include('profil.urls')),
    path('', include('chat.urls')),
    path('', lambda r: serve_html(r, 'Gruppe9_Skapertorget.html')),
    path('omoss/', lambda r: serve_html(r, 'OmOss_Skapertorget.html')),
    path('bilder/<str:filename>', serve_image),
]
