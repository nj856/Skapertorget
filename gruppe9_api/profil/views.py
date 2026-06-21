from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profil
from .serializers import ProfilSerializer

class OpprettProfilView(APIView):
    def post(self, request):
        serializer = ProfilSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HentProfilView(APIView):
    def get(self, request):
        profil = Profil.objects.first()  
        if not profil:
            return Response({'feil': 'Ingen profil funnet'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfilSerializer(profil)
        return Response(serializer.data)
