from django.shortcuts import render

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny

from wishlist.models import Wishlist, WishlistItem
from wishlist.permissions import IsOwnerOrReadOnly
from wishlist.serializers import WishlistItemSerializer, WishlistSerializer, WishlistVisibilitySerializer


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user,
            deleted_at__isnull=True,
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    

class WishlistItemListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wishlist_id = self.kwargs.get('pk')
        return WishlistItem.objects.filter(
            wishlist__id=wishlist_id,
            wishlist__user=self.request.user,
            wishlist__deleted_at__isnull=True,
            deleted_at__isnull=True,
        )
    
    def perform_create(self, serializer):
        wishlist = serializer.validated_data.get('wishlist')
        if wishlist.user != self.request.user:
            raise PermissionDenied("You do not have permission to add items to this wishlist.")
        serializer.save()


class WishlistItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]


class WishlistSharedView(generics.RetrieveAPIView):
    queryset = Wishlist.objects.filter(is_public=True)
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class WishlistVisibilityUpdateView(generics.UpdateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistVisibilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
