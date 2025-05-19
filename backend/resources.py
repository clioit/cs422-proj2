from datetime import datetime
from db_models import *
from flask import request, redirect, abort, url_for
from flask_restful import Resource
from flask_simplelogin import get_username, login_required

DATETIME_FMT = "%Y-%m-%dT%H:%M"


def get_current_user() -> User:
    """Get the current user from the database."""
    return User.objects(username=get_username()).first()


def get_event_dict(event: Event) -> dict:
    """Return an event as a dictionary."""
    return {
        "id": str(event.id),
        "title": event.title,
        "description": event.description,
        "start": event.start.strftime(DATETIME_FMT),
        "end": event.end.strftime(DATETIME_FMT),
        "tasks": [str(task.id) for task in event.tasks]
    }


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

    def _get_assured_event(self, org_id: str, event_id: str) -> Event:
        """Get an event from the database, assuring that it's associated
        with an organization the current user manages."""
        org = Organization.objects(id=org_id, managers__in=[get_current_user()]).first()
        if org is None:
            abort(404, "Organization not found.")

        event = Event.objects(id=event_id).first()
        if event is not None and event in org.events and event.org == org:
            return event
        else:
            abort(404, "Event not found.")

    def get(self, org_id: str, event_id: str):
        """Get an event by its ID."""
        event = self._get_assured_event(org_id, event_id)
        return get_event_dict(event)

    def patch(self, org_id: str, event_id: str):
        """Edit an event by its ID."""
        event = self._get_assured_event(org_id, event_id)
        req_obj = request.get_json()
        sent_fields = set(req_obj.keys())
        if "title" in sent_fields:
            event.title = req_obj["title"]
        if "description" in sent_fields:
            event.description = req_obj["description"]
        if "start" in sent_fields:
            event.start = datetime.strptime(req_obj["start"], DATETIME_FMT)
        if "end" in sent_fields:
            event.end = datetime.strptime(req_obj["end"], DATETIME_FMT)
        event.save()
        return get_event_dict(event)

    def delete(self, org_id: str, event_id: str):
        """Delete an event by its ID."""
        event = self._get_assured_event(org_id, event_id)
        event.delete()
        return {"success": True}


class EventList(Resource):
    method_decorators = [login_required]

    def _get_assured_org(self, org_id: str) -> Organization:
        """Get an organization from the database, assuring that it's managed
        by the current user."""
        org = Organization.objects(id=org_id, managers__in=[get_current_user()]).first()
        if org is None:
            abort(404, "Organization not found.")
        return org

    def get(self, org_id: str):
        """Get a list of events for an organization."""
        org = self._get_assured_org(org_id)
        return [get_event_dict(event) for event in org.events]

    def post(self, org_id: str):
        """Create a new event."""
        org = self._get_assured_org(org_id)
        req_obj = request.get_json()
        if {"title", "start", "end"}.issubset(req_obj.keys()):
            new_event = Event(
                title=req_obj["title"],
                org=org,
                start=datetime.strptime(req_obj["start"], DATETIME_FMT),
                end=datetime.strptime(req_obj["end"], DATETIME_FMT)
            )
            if "description" in req_obj:
                new_event.description = req_obj["description"]
            new_event.save()
            return get_event_dict(new_event), 201
        else:
            abort(400, "Missing one or more required fields: title, start, end.")
