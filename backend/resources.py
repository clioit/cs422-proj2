from datetime import datetime

from backend.util import *
from db_models import *
from flask import request, redirect, abort, url_for, make_response
from flask_restful import Resource
from flask_simplelogin import login_required, is_logged_in, get_username
from ics import Calendar

DATETIME_FMT = "%Y-%m-%dT%H:%M"


def get_current_user() -> User:
    """Get the current user from the database."""
    return User.objects(username=get_username()).first()


def get_assured_event(org_id: str, event_id: str) -> Event:
    """Get an event from the database, assuring that it's associated
    with an organization the current user manages."""

    org = get_assured_org(org_id)
    this_user = get_current_user()
    is_manager = is_logged_in() and this_user in org.managers and org in this_user.orgs

    if is_manager:
        event = Event.objects(id=event_id).first()
    else:
        event = Event.objects(id=event_id, published=True).first()

    if event is not None and event in org.events and event.org == org:
        return event
    else:
        abort(404, "Event not found.")


def get_assured_org(org_id: str) -> Organization:
    """Get an organization from the database."""
    org = Organization.objects(id=org_id).first()
    if org is None:
        abort(404, "Organization not found.")
    return org


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

    def get(self, org_id: str, event_id: str):
        """Get an event by its ID."""
        event = get_assured_event(org_id, event_id)
        return get_event_dict(event)

    def patch(self, org_id: str, event_id: str):
        """Edit an event by its ID."""
        event = get_assured_event(org_id, event_id)
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
        event = get_assured_event(org_id, event_id)
        event.delete()
        return {"success": True}


class EventCalendarResource(Resource):

    def get(self, org_id: str, event_id: str):
        """Gets a single event and its tasks as an iCalendar file."""
        event = get_assured_event(org_id, event_id)

        cal = Calendar(events=[event_to_ical(event)])
        if is_logged_in():  # if the user is a manager (implied when logged in because the event is assured)
            for task in event.tasks:
                cal.todos.add(task_to_ical(task))

        resp = make_response(cal.serialize())
        resp.headers['Content-Type'] = 'text/calendar'
        return resp


class EventList(Resource):
    method_decorators = {"post": [login_required]}

    def get(self, org_id: str):
        """Get a list of events for an organization."""
        org = get_assured_org(org_id)
        this_user = get_current_user()
        is_manager = this_user in org.managers and org in this_user.orgs
        if is_manager:
            event_list = org.events
        else:
            event_list = Event.objects(org=org, published=True)
        return [get_event_dict(event, is_manager) for event in event_list]

    def post(self, org_id: str):
        """Create a new event."""
        org = get_assured_org(org_id)
        req_obj = request.get_json()
        if {"title", "start", "end", "point_of_contact"}.issubset(req_obj.keys()):
            # TODO: assert that the point of contact is a manager of the org
            new_event = Event(
                title=req_obj["title"],
                org=org,
                point_of_contact=req_obj["point_of_contact"],
                start=datetime.strptime(req_obj["start"], DATETIME_FMT),
                end=datetime.strptime(req_obj["end"], DATETIME_FMT)
            )
            if "published" in req_obj:
                new_event.description = req_obj["published"]
            if "description" in req_obj:
                new_event.description = req_obj["description"]
            if "info" in req_obj:
                new_event.info = EventInfo(**req_obj["info"])
            new_event.save()
            org.events.append(new_event)
            org.save()
            return get_event_dict(new_event), 201
        else:
            abort(400, "Missing one or more required fields: title, start, end, point_of_contact.")


class EventListCalendarResource(Resource):

    def get(self, org_id: str):
        """Gets all of an org's events and tasks as an iCalendar file."""
        org = get_assured_org(org_id)
        this_user = get_current_user()
        is_manager = this_user in org.managers and org in this_user.orgs

        cal = Calendar()
        if is_manager:
            cal.events.update([event_to_ical(event) for event in org.events])
            for event in org.events:
                for task in event.tasks:
                    cal.todos.add(task_to_ical(task))
        else:
            cal.events.update([event_to_ical(event) for event in Event.objects(org=org, published=True)])

        resp = make_response(cal.serialize())
        resp.headers['Content-Type'] = 'text/calendar'
        return resp


class OrganizationList(Resource):
    method_decorators = [login_required]

    def get(self):
        """Retrieve organizations the current user has access to."""
        orgs = get_current_user().orgs
        return [get_org_dict(org, is_manager=True) for org in orgs]
    
    def post(self):
        """Create a new organization."""
        req_obj = request.get_json()
        if "name" in req_obj:
            this_user = get_current_user()
            new_org = Organization(
                name=req_obj["name"],
                managers=[this_user]
            )
            if "description" in req_obj:
                new_org.description = req_obj["description"]
            new_org.save()
            this_user.orgs.append(new_org)
            this_user.save()
            return get_org_dict(new_org, is_manager=True), 201
        else:
            abort(400, "Missing required field: name")


class OrganizationResource(Resource):
    method_decorators = {"patch": [login_required], "delete": [login_required]}

    def get(self, org_id: str):
        """Gets an org from the database given an ID."""
        org = get_assured_org(org_id)
        this_user = get_current_user()
        is_manager = is_logged_in() and this_user in org.managers and org in this_user.orgs
        return get_org_dict(org, is_manager), 200

    def patch(self, org_id: str):
        """Edit an organization given an ID."""
        org = get_assured_org(org_id)
        this_user = get_current_user()
        if this_user in org.managers and org in this_user.orgs:
            req_obj = request.get_json()
            sent_fields = set(req_obj.keys())
            if "name" in sent_fields:
                org.name = req_obj["name"]
            if "description" in sent_fields:
                org.description = req_obj["description"]
            org.save()
            return get_org_dict(org, is_manager=True), 200
        else:
            abort(403, "The current user is not authorized to edit this organization.")
    
    def delete(self, org_id:str):
        """Delete an organization."""
        org = get_assured_org(org_id)
        this_user = get_current_user()
        if this_user in org.managers and org in this_user.orgs:
            org.delete()
            return {"success": True}
        else:
            abort(403, "The current user is not authorized to delete this organization.")


class OrganizationInviteResource(Resource):
    method_decorators = {login_required}

    def _get_org_by_join_token(self, join_token: str) -> Organization:
        """Get an organization from the database."""
        org = Organization.objects(join_token=join_token).first()
        if org is None:
            abort(404, "The invite was not found.")
        return org

    def get(self, join_token: str):
        """Joins an organization using its join token."""
        org = self._get_org_by_join_token(join_token)
        this_user = get_current_user()
        if this_user not in org.managers or org not in this_user.orgs:
            org.managers.append(this_user)
            org.save()
            this_user.orgs.append(org)
            this_user.save()
            return {"success": True}
        else:
            abort(400, "The current user already manages this organization.")


class TaskList(Resource):
    method_decorators = [login_required]

    def get(self, org_id, event_id):
        """Retrieves all tasks under an event."""
        event = get_assured_event(org_id, event_id)
        if event is None:
            abort(404, "No event found")
        return [get_task_dict(task) for task in event.tasks]
    
    def post(self, org_id, event_id):
        """Creates a new task."""
        event = get_assured_event(org_id, event_id)
        req_obj = request.get_json()

        if {"title", "due_date"}.issubset(req_obj):
            new_task = Task(
                title=req_obj["title"],
                due_date=datetime.strptime(req_obj["due_date"], DATETIME_FMT)
            )
            if "description" in req_obj:
                new_task.description = req_obj["description"]
            if "assignee" in req_obj:
                new_task.assignee = req_obj["assignee"]
            new_task.save()
            event.tasks.append(new_task)
            event.save()
            return get_task_dict(new_task), 201
        else:
            abort(400, "Missing required fields: title, due_date")


class TaskResource(Resource):
    method_decorators = {"patch": [login_required], "delete": [login_required]}

    def _get_assured_task(self, task_id: str) -> Task:
        """Gets a task from the database, throwing 404 if it does not exist.
        TODO: take the event ID and make sure the task exists under it."""
        task = Task.objects(id=task_id).first()
        if task is None:
            abort(404, "Task not found.")
        return task

    def get(self, org_id: str, event_id: str, task_id: str):
        """Gets a single task."""
        task = self._get_assured_task(task_id)
        return get_task_dict(task), 200

    def patch(self, org_id: str, event_id: str, task_id: str):
        """Edits a task given its ID."""
        org = get_assured_org(org_id)
        task = self._get_assured_task(task_id)
        this_user = get_current_user()
        if this_user in org.managers and org in this_user.orgs:
            req_obj = request.get_json()
            sent_fields = set(req_obj.keys())
            if "title" in sent_fields:
                task.title = req_obj["title"]
            if "description" in sent_fields:
                task.description = req_obj["description"]
            if "assignee" in sent_fields:
                task.assignee = req_obj["assignee"]
            if "completed" in sent_fields:
                task.completed = req_obj["completed"]
            if "due_date" in sent_fields:
                task.due_date = datetime.strptime(req_obj["due_date"], DATETIME_FMT)
            task.save()
            return get_task_dict(task), 200
        else:
            abort(403, "The current user is not authorized to edit this organization.")

    def delete(self, org_id: str, event_id: str, task_id: str):
        """Deletes a task."""
        org = get_assured_org(org_id)
        task = self._get_assured_task(task_id)
        this_user = get_current_user()
        if this_user in org.managers and org in this_user.orgs:
            task.delete()
            return {"success": True}
        else:
            abort(403, "The current user is not authorized to delete this task.")



