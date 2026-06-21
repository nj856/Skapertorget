from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import HelpTicket

class HelpTicketAPITestCase(TestCase):
    
    def setUp(self):
        """Sett opp testmiljø uten autentisering"""
        self.client = APIClient()
    
    def test_create_ticket_valid_data(self):
        """Test: Opprett ticket med gyldig data"""
        data = {
            'title': 'Test Problem',
            'message': 'Dette er en testmelding som er lang nok',
            'email': 'test@example.com'
        }
        response = self.client.post('/api/help/tickets/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(HelpTicket.objects.count(), 1)
    
    def test_create_ticket_invalid_title(self):
        """Test: Ugyldig tittel (for kort)"""
        data = {
            'title': 'He',
            'message': 'Dette er en testmelding som er lang nok',
            'email': 'test@example.com'
        }
        response = self.client.post('/api/help/tickets/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_ticket_invalid_message(self):
        """Test: Ugyldig melding (for kort)"""
        data = {
            'title': 'Gyldig tittel',
            'message': 'Kort',
            'email': 'test@example.com'
        }
        response = self.client.post('/api/help/tickets/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_tickets_list(self):
        """Test: Hente liste over tickets"""
        HelpTicket.objects.create(
            title='Test 1',
            message='Melding 1 som er lang nok',
            email='test@example.com'
        )
        response = self.client.get('/api/help/tickets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_single_ticket(self):
        """Test: Hente spesifikk ticket"""
        ticket = HelpTicket.objects.create(
            title='Test 1',
            message='Melding 1 som er lang nok',
            email='test@example.com'
        )
        response = self.client.get(f'/api/help/tickets/{ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test 1')
    
    def test_update_ticket(self):
        """Test: Oppdatere ticket"""
        ticket = HelpTicket.objects.create(
            title='Original tittel',
            message='Original melding som er lang nok',
            email='test@example.com'
        )
        response = self.client.patch(
            f'/api/help/tickets/{ticket.id}/',
            {'title': 'Oppdatert tittel'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ticket.refresh_from_db()
        self.assertEqual(ticket.title, 'Oppdatert tittel')
    
    def test_delete_ticket(self):
        """Test: Slette ticket"""
        ticket = HelpTicket.objects.create(
            title='Slett meg',
            message='Melding som er lang nok',
            email='test@example.com'
        )
        response = self.client.delete(f'/api/help/tickets/{ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(HelpTicket.objects.count(), 0)
    
    def test_get_nonexistent_ticket(self):
        """Test: Hente ticket som ikke finnes"""
        response = self.client.get('/api/help/tickets/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)