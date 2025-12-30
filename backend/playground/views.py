from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.conf import settings
import boto3
import os
from .models import SongPost
from .serializers import SongPostSerializer
from urllib.parse import urlparse, parse_qs, unquote
import time


def is_expired(s3_url):
    parsed_url = urlparse(s3_url)
    query_params = parse_qs(parsed_url.query)
    expires = int(query_params.get("Expires", [0])[0])

    current_time = time.time()
    return current_time > expires


def getPresignedURL(song_name):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    try:
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        key = "songs/" + song_name
        url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": key},
            ExpiresIn=48 * 3600,
        )
        print("______________________________")
        print(url)
        print("______________________________")
        return url
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


class SongPostToday(APIView):
    def get(self, request, format=None):
        current_date = timezone.now().date()
        queryset = SongPost.objects.filter(post_date=current_date)
        serializer = SongPostSerializer(queryset, many=True)
        if queryset.count() != 1:
            return Response({"message": "Expected one song, found none"}, status=400)
        serializer = SongPostSerializer(queryset.first())
        song_post = get_object_or_404(SongPost, pk=serializer.data.get("id"))
        sampled_audio = serializer.data.get("sampled_audio")
        sampler_audio = serializer.data.get("sampler_audio")
        if not sampled_audio.startswith("http"):
            song_post.sampled_audio = getPresignedURL(sampled_audio)

        if not sampler_audio.startswith("http"):
            song_post.sampler_audio = getPresignedURL(sampler_audio)

        song_post.save()
        serializer = SongPostSerializer(song_post)

        return Response(serializer.data)


class SongPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer
    lookup_field = "pk"
