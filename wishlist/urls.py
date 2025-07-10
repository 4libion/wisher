from django.urls import path

from wishlist.views import (
    WishlistDetailView,
    WishlistItemDetailView,
    WishlistItemListCreateView,
    WishlistListCreateView,
    WishlistSharedView,
    WishlistVisibilityUpdateView,
)


urlpatterns = [
    path('', WishlistListCreateView.as_view()),
    path('<int:pk>/', WishlistDetailView.as_view()),
    path('<int:pk>/visibility', WishlistVisibilityUpdateView.as_view()),
    path('items/', WishlistItemListCreateView.as_view()),
    path('items/<int:pk>', WishlistItemDetailView.as_view()),
    path('shared/<uuid:slug>/', WishlistSharedView.as_view()),
]
