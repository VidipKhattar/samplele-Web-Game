from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import viewsets
from .models import SongPost
from .serializers import SongPostSerializer


class SongPostListCreate(generics.ListCreateAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer

    def delete():
        SongPost.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SongPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer
    lookup_field = "pk"
