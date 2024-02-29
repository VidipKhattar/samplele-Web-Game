"""
URL configuration for sampler project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from playground.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    # URL patterns for SamplerSong views
    path(
        "sampler-songs/",
        SamplerSongListAPIView.as_view(),
        name="sampler-song-list",
    ),
    path(
        "sampler-songs/<int:pk>/",
        SamplerSongDetailAPIView.as_view(),
        name="sampler-song-detail",
    ),
    # URL patterns for SampledSong views
    path(
        "sampled-songs/",
        SampledSongListAPIView.as_view(),
        name="sampled-song-list",
    ),
    path(
        "sampled-songs/<int:pk>/",
        SampledSongDetailAPIView.as_view(),
        name="sampled-song-detail",
    ),
]
