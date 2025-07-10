from rest_framework import serializers
from wishlist.models import Wishlist, WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = [
            'id',
            'wishlist',
            'name',
            'url',
            'image',
            'notes',
            'is_purchased',
            'created_at',
            'updated_at',
            'deleted_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'deleted_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'items',
            'user',
            'title',
            'description',
            'is_public',
            'slug',
            'url',
            'created_at',
            'updated_at',
            'deleted_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'deleted_at']

    def get_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(f'/wishlist/shared/{obj.slug}/') if request else None


class WishlistVisibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['is_public']