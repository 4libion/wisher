from django.urls import path

from .views import (
    MeView,
    UserDetailView,
)


urlpatterns = [
    path('<int:id>/', UserDetailView.as_view()),
    path("me/", MeView.as_view()),
]
