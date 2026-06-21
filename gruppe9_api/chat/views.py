from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Melding, Chat
from .serializers import MeldingSerializer

class HentMeldingerView(APIView):
    def get(self, request):
        chat_id = request.GET.get("chat_id")
        if not chat_id:
            return Response(
                {"feil": "chat_id mangler"},
                status=status.HTTP_400_BAD_REQUEST
            )
        meldinger = Melding.objects.filter(chat_id=chat_id).order_by("opprettet_tid")
        serializer = MeldingSerializer(meldinger, many=True)
        return Response(serializer.data)

class SendMeldingView(APIView):
    def post(self, request):
        tekst = request.data.get("message")
        chat_id = request.data.get("chat_id")
        if not tekst or not chat_id:
            return Response(
                {"feil": "Mangler data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        Chat.objects.get_or_create(id=chat_id, defaults={'kunde_id': 1, 'selger_id': 2})
        melding = Melding.objects.create(
            chat_id=chat_id,
            avsender_id=1,  
            tekst=tekst
        )
        serializer = MeldingSerializer(melding)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SlettMeldingView(APIView):
    def delete(self, request, melding_id):
        avsender_id = request.data.get("avsender_id", 1)
        try:
            melding = Melding.objects.get(id=melding_id, avsender_id=avsender_id)
            melding.delete()
            return Response({"slettet": True}, status=status.HTTP_200_OK)
        except Melding.DoesNotExist:
            return Response({"feil": "Melding ikke funnet"}, status=status.HTTP_404_NOT_FOUND)

class SelgerSvarView(APIView):
    def post(self, request):
        tekst = request.data.get("message")
        chat_id = request.data.get("chat_id")
        if not tekst or not chat_id:
            return Response(
                {"feil": "Mangler data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        Chat.objects.get_or_create(id=chat_id, defaults={'kunde_id': 1, 'selger_id': 2})
        melding = Melding.objects.create(
            chat_id=chat_id,
            avsender_id=2,
            tekst=tekst
        )
        serializer = MeldingSerializer(melding)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
