from db_models import *
from flask import redirect, abort
from flask_restful import Resource
from flask_simplelogin import get_username, login_required


def get_current_user():
    return User.objects(username=get_username()).first()


class UserResource(Resource):
    method_decorators = [login_required]

    def get(self):
        """Get the current user."""
        current_user = get_current_user()
        return {
            "id": str(current_user.id),
            "username": current_user.username,
            "orgs": [str(org.id) for org in current_user.orgs]
        }

    def patch(self):
        """Edit the current user."""
        abort(501, "Not Implemented")


class UserList(Resource):
    def post(self):
        """Create a new user."""
        abort(501, "Not Implemented")