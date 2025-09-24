from typing import Any

from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Allow access to authenticated users with the admin role or staff flag."""

    def has_permission(self, request, view):  # type: ignore[override]
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False
        role = getattr(user, "role", None)
        return bool(role == "admin" or getattr(user, "is_staff", False))


class IsOwnerOrAdmin(BasePermission):
    """Allow access to admins/staff or when the requesting user owns the object."""

    admin_permission = IsAdminRole()
    _ownership_attributes = ("user", "created_by", "owner", "admin")

    def has_permission(self, request, view):  # type: ignore[override]
        user = getattr(request, "user", None)
        return bool(user and getattr(user, "is_authenticated", False))

    def has_object_permission(self, request, view, obj):  # type: ignore[override]
        if self.admin_permission.has_permission(request, view):
            return True

        user = getattr(request, "user", None)
        if not user:
            return False

        def resolve_attribute(value: Any) -> Any:
            if callable(value):
                try:
                    return value()
                except TypeError:
                    return value
            return value

        for attr in self._ownership_attributes:
            value = resolve_attribute(getattr(obj, attr, None))
            if value == user:
                return True

        subscription = resolve_attribute(getattr(obj, "subscription", None))
        if subscription and resolve_attribute(getattr(subscription, "user", None)) == user:
            return True

        return False
