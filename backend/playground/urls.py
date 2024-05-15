from django.urls import path
from django.contrib import admin
from . import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", views.LoginInfoAPIView.as_view(), name="login-info"),
    path("songposts/", views.SongPostListCreate.as_view(), name="songpost-view-create"),
    path("songposttoday/", views.SongPostToday.as_view(), name="songpost-today"),
    path(
        "songposts/<int:pk>/",
        views.SongPostRetrieveUpdateDestroy.as_view(),
        name="songpost-view-destroy",
    ),
    path("youtube/", views.YoutubeAPIView.as_view(), name="convert_to_mp3"),
]
