from db_models import *
from flask import request, redirect, abort, url_for
from flask_restful import Resource
from flask_simplelogin import get_username, login_required


def get_current_user() -> User:
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
        """Change the current user's username or password."""
        req_obj = request.get_json()
        setting_username = "username" in req_obj.keys()
        setting_password = {"old_password", "new_password"}.issubset(req_obj.keys())
        if setting_username or setting_password:
            current_user = get_current_user()
            if setting_username:
                current_user.username = req_obj["username"]
            if setting_password:
                if hash(req_obj["old_password"]) == current_user.password_hash:
                    current_user.password_hash = hash(req_obj["new_password"])
                else:
                    abort(401, "Old password is incorrect.")
            current_user.save()
            return redirect(url_for('simplelogin.logout'), code=303)  # must log out after change
        else:
            abort(400, "Missing one or more required fields: username, old_password, new_password.")

    def delete(self):
        """Delete the current user."""
        get_current_user().delete()
        return redirect(url_for('simplelogin.logout'), code=303)  # must log out after delete


class UserList(Resource):
    def post(self):
        """Create a new user."""
        req_obj = request.get_json()
        if {"username", "password"}.issubset(req_obj.keys()):
            new_user = User(username=req_obj["username"], password_hash=hash(req_obj["password"]))
            new_user.save()
            return {"success": True}
        else:
            abort(400, "Missing one or more required fields: username, password.")


class EventResource(Resource):
    method_decorators = [login_required]

    def get(self, org_id: str, event_id: str):
        """Get an event by its ID."""
        abort(501, "Not implemented.")

    def patch(self, org_id: str, event_id: str):
        """Edit an event by its ID."""
        abort(501, "Not Implemented")

    def delete(self, org_id: str, event_id: str):
        """Delete an event by its ID."""
        abort(501, "Not Implemented")


class EventList(Resource):
    method_decorators = [login_required]

    def get(self, org_id: str, event_id: str):
        """Get a list of events for an organization."""
        abort(501, "Not Implemented")

    def post(self, org_id: str, event_id: str):
        """Create a new event."""
        abort(501, "Not Implemented")
