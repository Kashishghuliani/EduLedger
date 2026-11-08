from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .serializers import ParentSerializer
from .permissions import IsAccountsExecutive
from .models import User




class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "role": request.user.role,
            "phone": request.user.phone,
            "preferred_language": request.user.preferred_language,
        })

class ParentListCreateView(generics.ListCreateAPIView):
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated, IsAccountsExecutive]

    def get_queryset(self):
        return User.objects.filter(role="PARENT").order_by("-id")


