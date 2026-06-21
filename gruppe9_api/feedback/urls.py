from django.urls import path
from .views import create_feedback

urlpatterns = [
    path('tilbakemelding/', create_feedback),
]
