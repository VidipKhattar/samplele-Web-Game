from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SamplerSong, SampledSong
from .serializers import SamplerSongSerializer, SampledSongSerializer


class SamplerSongListAPIView(APIView):
    def get(self, request):
        songs = SamplerSong.objects.all()
        serializer = SamplerSongSerializer(songs, many=True)
        return Response(serializer.data)


class SamplerSongDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            song = SamplerSong.objects.get(pk=pk)
        except SamplerSong.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SamplerSongSerializer(song)
        return Response(serializer.data)


class SampledSongListAPIView(APIView):
    def get(self, request):
        songs = SampledSong.objects.all()
        serializer = SampledSongSerializer(songs, many=True)
        return Response(serializer.data)


class SampledSongDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            song = SampledSong.objects.get(pk=pk)
        except SampledSong.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SampledSongSerializer(song)
        return Response(serializer.data)
