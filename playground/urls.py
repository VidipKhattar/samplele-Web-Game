from django.urls import path
from . import views


urlpatterns = [
    path("songposts/", views.SongPostListCreate.as_view(), name="songpost-view-create"),
    path(
        "songposts/<int:pk>/",
        views.SongPostRetrieveUpdateDestroy.as_view(),
        name="songpost-view-destroy",
    ),
]
