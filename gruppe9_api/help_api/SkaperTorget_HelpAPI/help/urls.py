from django.urls import path
from . import views

urlpatterns = [
    path('help/tickets/', views.HelpTicketListCreateView.as_view(), name='ticket-list'),
    path('help/tickets/<int:pk>/', views.HelpTicketDetailView.as_view(), name='ticket-detail'),
]