from django.urls import path
from .views import HentMeldingerView, SendMeldingView, SlettMeldingView, SelgerSvarView

urlpatterns = [
    path("", HentMeldingerView.as_view(), name="home"),
    path("messages", HentMeldingerView.as_view(), name="messages"),
    path("messages/send", SendMeldingView.as_view(), name="send_message"),
    path("messages/delete/<int:melding_id>", SlettMeldingView.as_view(), name="delete_message"),
    path("messages/selger-svar", SelgerSvarView.as_view(), name="selger_svar"),
]
