from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import SongPost
from .serializers import SongPostSerializer
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.http import JsonResponse


class LoginInfoAPIView(APIView):
    def post(self, request):
        if request.method == "POST":
            username = request.data.get("username")
            password = request.data.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None and user.is_superuser:
                login(request, user)
                return JsonResponse({"success": True})
            else:
                return JsonResponse(
                    {"success": False, "error": "Invalid credentials"}, status=401
                )
        return JsonResponse({"error": "Method not allowed1"}, status=405)


class SongPostListCreate(generics.ListCreateAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer

    def delete(self, request, *args, **kwargs):
        SongPost.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SongPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer
    lookup_field = "pk"
