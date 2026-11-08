
from rest_framework.permissions import BasePermission


class IsAccountsExecutive(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ACCOUNTS"
        )


class IsParent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "PARENT"
        )


class IsAccountsOrParent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["ACCOUNTS", "PARENT"]
        )
