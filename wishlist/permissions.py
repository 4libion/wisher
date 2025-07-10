from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user or request.method in permissions.SAFE_METHODS
        if hasattr(obj, 'wishlist'):
            return obj.wishlist.user == request.user or request.method in permissions.SAFE_METHODS
        return False
