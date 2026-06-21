from django.urls import path
from .views import OpprettProfilView, HentProfilView

urlpatterns = [
    path('opprett/', OpprettProfilView.as_view(), name='opprett-profil'),
    path('meg/', HentProfilView.as_view(), name='hent-profil'),
]