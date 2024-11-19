from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from pytube import YouTube
import boto3
from pydub import AudioSegment
import os
from .models import SongPost
from .serializers import SongPostSerializer
from urllib.parse import urlparse, parse_qs, unquote
import time


from urllib.parse import urlparse, parse_qs, unquote
import time


def is_expired(s3_url):
    parsed_url = urlparse(s3_url)
    query_params = parse_qs(parsed_url.query)
    expires = int(query_params.get("Expires", [0])[0])

    current_time = time.time()
    return current_time > expires


def has_specific_access_key(s3_url, access_key="AKIA2UC27F2PI3KJ3E52"):
    parsed_url = urlparse(s3_url)
    query_params = parse_qs(parsed_url.query)
    current_access_key = query_params.get("AWSAccessKeyId", [""])[0]
    return current_access_key == access_key


def getPresignedURLIfExpired(audio_url):
    if "s3.amazonaws.com" in audio_url:
        parsed_url = urlparse(audio_url)

        # Decode the URL and remove leading '/'
        key = unquote(parsed_url.path.lstrip("/"))

        # Keep only the last segment of the path after removing all 'songs/' prefixes
        key_parts = key.split("/")
        key_filtered = [part for part in key_parts if part != "songs"]

        # Join the filtered parts back into a single path
        key = "/".join(key_filtered)

        print(key)

        # Check expiration or access key
        if is_expired(audio_url) or has_specific_access_key(audio_url):
            print("IS EXPIRED_________")
            return getPresignedURL(key)
        else:
            print("NOTTTTTTT EXPIRED_________")

    return audio_url


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


def getPresignedURLFromExpiredLink(expired_url):
    # Parse the URL to get the key
    parsed_url = urlparse(expired_url)
    path = parsed_url.path
    key = unquote(path.lstrip("/").split("/", 1)[-1])  # Gets "songs/..." portion

    # Call getPresignedURL with extracted key
    return getPresignedURL(key)


def fetch_and_process_audio_from_youtube(youtube_url, sample_start_time):
    yt = YouTube(youtube_url)
    video_title = yt.title
    filename = f"{video_title}.mp3"
    folder_name = "songs"
    audio_path = (
        yt.streams.filter(only_audio=True)
        .first()
        .download(output_path=folder_name, filename=filename)
    )
    audio = AudioSegment.from_file(audio_path)
    start_time = sample_start_time * 1000
    end_time = (sample_start_time + 30) * 1000
    modified_audio = audio[start_time:end_time]
    modified_audio_path = os.path.join(folder_name, filename)
    modified_audio.export(modified_audio_path, format="mp3")

    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    object_key = f"{folder_name}/{filename}"

    with open(modified_audio_path, "rb") as file:
        s3.upload_fileobj(file, bucket_name, object_key)
    # os.remove(modified_audio_path)
    return filename


class YoutubeAPIView(APIView):
    def post(self, request):
        youtube_url = request.data.get("ytVideoVar")
        sample_start_time = request.data.get("timeValueVar")
        try:
            audio_data = fetch_and_process_audio_from_youtube(
                youtube_url, sample_start_time
            )
            return JsonResponse(
                {"title": audio_data},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        song_name = request.GET.get("title")
        presigned_url = getPresignedURL(song_name)
        return JsonResponse({"presigned_url": presigned_url})


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
        else:
            song_post.sampled_audio = getPresignedURLIfExpired(sampled_audio)

        if not sampler_audio.startswith("http"):
            song_post.sampler_audio = getPresignedURL(sampler_audio)
        else:
            song_post.sampler_audio = getPresignedURLIfExpired(sampler_audio)
        song_post.save()
        serializer = SongPostSerializer(song_post)

        return Response(serializer.data)


class SongPostRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SongPost.objects.all()
    serializer_class = SongPostSerializer
    lookup_field = "pk"
