from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import SongPost
from .models import Member
from .serializers import SongPostSerializer
from .serializers import MemberSerializer
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


class SongPostListCreate(APIView):
    def get(elf, request, format=None):
        queryset = SongPost.objects.all()
        serializer_class = SongPostSerializer(queryset, many=True)
        return Response(serializer_class.data)

    def post(self, request, format=None):
        serializer_class = SongPostSerializer(data=request.data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data, status=status.HTTP_201_CREATED)
        return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        SongPost.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SongPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer
    lookup_field = "pk"


class MemberView(APIView):
    """
    List all Transformers, or create a new Transformer
    """

    def get(self, request, format=None):
        transformers = Member.objects.all()
        serializer = MemberSerializer(transformers, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
