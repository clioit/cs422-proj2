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
        "published": event.published,
        "point_of_contact": str(event.point_of_contact.id) if event.point_of_contact else None,
        "tasks": [str(task.id) for task in event.tasks],
        "info": {field: getattr(event.info, field) for field in ("rsvp", "venue", "contact", "budget", "other")}
    }


def get_org_dict(org: Organization) ->dict:
    return {
        "name": str(org.name),
        "id": str(org.id),
        "description": org.description or ""
    }


class UserResource(Resource):
    method_decorators = [login_required]

    def get(self):
        """Get the current user."""
        current_user = get_current_user()
        return {
            "id": str(current_user.id),
            "username": current_user.username,
            "orgs": [str(org.name) for org in current_user.orgs]
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
        for key in ("title", "description", "published"):  # copy some fields directly
            if key in sent_fields:
                setattr(event, key, req_obj[key])
        for key in ("start", "end"):  # time fields need to be parsed
            if key in sent_fields:
                setattr(event, key, datetime.strptime(req_obj[key], DATETIME_FMT))
        if "point_of_contact" in sent_fields:  # user field needs to be looked up
            event.point_of_contact = User.objects(id=req_obj["point_of_contact"]).first()
        if "info" in sent_fields:  # info object is copied separately
            event.info = EventInfo()
            for key in ("rsvp", "venue", "contact", "budget", "other"):
                if key in req_obj["info"]:
                    setattr(event.info, key, req_obj["info"][key])
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


class OrganizationList(Resource):
    method_decorators = [login_required]

    def get(self):
        """Retrieves all organizations in the database
        TODO: Needs to filter such that it accesses organizations
        the user has access to."""
        orgs = Organization.objects()
        if orgs is None:
            abort(404, "Organizations not found.")
        return [get_org_dict(org) for org in orgs]
    
    def post(self):
        """Create a new organization
        TODO: Add the current user as a manager(?)"""
        req_obj = request.get_json()
        #current_user = get_current_user()

        if {"name"}.issubset(req_obj):
            new_org = Organization(
                name=req_obj["name"]
            )
            if "description" in req_obj:
                new_org.description = req_obj["description"]
            new_org.save()
            return get_org_dict(new_org), 201
        else:
            abort(400, "Missing required field: name")


class OrganizationResource(Resource):
    method_decorators = [login_required]

    def _get_assured_org(self, org_id: str) -> Organization:
        """Get an organization from the database. 
        TODO: Ensure the current_user has permissions to edit"""
        org = Organization.objects(id=org_id).first() 
        if org is None:
            abort(404, "Organization not found.")
        return org

    def get(self, org_id: str):
        """Gets an org from the database given an id"""
        org = self._get_assured_org(org_id)
        return get_org_dict(org), 200

    def patch(self, org_id: str):
        """Edit an organization given an ID
        TODO: Needs 'manager' role verification"""
        org = self._get_assured_org(org_id)
        req_obj = request.get_json()
        sent_fields = set(req_obj.keys())
        if "name" in sent_fields:
            org.name = req_obj["name"]
        if "description" in sent_fields:
            org.description = req_obj["description"]
        org.save()

        return get_org_dict(org), 201
    
    def delete(self, org_id:str):
        """Deletes an organization
        TODO: Needs 'manager' role verification"""
        org = self._get_assured_org(org_id)
        org.delete()
        return {"success": True}
