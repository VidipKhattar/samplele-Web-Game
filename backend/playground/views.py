from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import SongPost, AudioFile
from .serializers import SongPostSerializer, AudioFileSerializer
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from pytube import YouTube

from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AudioFile
from .serializers import AudioFileSerializer
from pytube import YouTube


class YoutubeAPIView(APIView):
    def post(self, request):
        if request.method == "POST":
            youtube_url = request.data.get("youtubeUrl")
            try:
                # object creation using YouTube
                yt = YouTube(youtube_url)

                # Get all streams and filter for mp3 files with low quality
                mp3_streams = (
                    yt.streams.filter(only_audio=True, file_extension="mp4")
                    .order_by("abr")
                    .desc()
                )

                # Get the lowest quality mp3 stream
                d_audio = mp3_streams.last()

                # Download the audio and save it to the backend
                audio_data = d_audio.download()

                # Create a new AudioFile instance and save the downloaded audio
                audio_file = AudioFile.objects.create()
                audio_file.audio_file.save(f"{yt.title}.mp3", ContentFile(audio_data))

                # Serialize the audio file instance
                serializer = AudioFileSerializer(audio_file)

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        audio_files = AudioFile.objects.all()
        serializer = AudioFileSerializer(audio_files, many=True)
        return Response(serializer.data)


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
