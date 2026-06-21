from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import FeedbackSerializer

@api_view(['POST'])
def create_feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Feedback mottatt!", "data": serializer.data}, status=201)
    return Response(serializer.errors, status=400)
