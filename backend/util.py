from flask import abort
from flask_simplelogin import get_username, is_logged_in
from ics import Event as CalEvent, Organizer, Todo

from backend.db_models import User, Event, Organization, Task
from backend.resources import DATETIME_FMT


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


def get_event_dict(event: Event, is_manager: bool = False) -> dict:
    """Return an event as a dictionary."""
    event_dict = {
        "id": str(event.id),
        "title": event.title,
        "description": event.description,
        "start": event.start.strftime(DATETIME_FMT),
        "end": event.end.strftime(DATETIME_FMT),
    }
    if is_manager:
        event_dict.update({
            "published": event.published,
            "point_of_contact": str(event.point_of_contact.id) if event.point_of_contact else None,
            "tasks": [str(task.id) for task in event.tasks]
        })
        if event.info is not None:
            event_dict["info"] = {field: getattr(event.info, field) for field in ("rsvp", "venue", "contact", "budget",
                                                                                  "other")}
    return event_dict


def get_assured_org(org_id: str) -> Organization:
    """Get an organization from the database."""
    org = Organization.objects(id=org_id).first()
    if org is None:
        abort(404, "Organization not found.")
    return org


def get_org_dict(org: Organization) -> dict:
    org_dict = {
        "name": str(org.name),
        "id": str(org.id),
        "description": org.description or "",
        "color_scheme": org.color_scheme,
    }
    this_user = get_current_user()
    if is_logged_in() and this_user in org.managers and org in this_user.orgs:
        org_dict["join_token"] = str(org.join_token)
        event_list = org.events
    else:
        event_list = Event.objects(org=org, published=True)
    org_dict["events"] = [str(event.id) for event in event_list]

    return org_dict


def get_task_dict(task: Task) -> dict:
    """
    Return task information as a dictionary
    """
    return {
        "title": str(task.title),
        "id": str(task.id),
        "description": task.description,
        "assignee": str(task.assignee.id) if task.assignee else None,
        "due_date": str(task.due_date),
        "completed": task.completed
    }


def event_to_ical(event: Event) -> CalEvent:
    return CalEvent(
        name=event.title,
        description=event.description,
        begin=event.start,
        end=event.end,
        organizer=Organizer(email="", common_name=event.org.name)
    )


def task_to_ical(task: Task) -> Todo:
    return Todo(
        name=task.title,
        description=task.description,
        due=task.due_date,
        begin=task.due_date
    )
