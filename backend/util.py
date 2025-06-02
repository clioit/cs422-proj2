from ics import Event as CalEvent, Organizer, Todo
import qrcode, qrcode.constants

import qrcode.image.svg
from backend.db_models import Event, Organization, Task, User
from backend.resources import DATETIME_FMT


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


def get_org_dict(org: Organization, is_manager: bool = False) -> dict:
    org_dict = {
        "name": str(org.name),
        "id": str(org.id),
        "description": org.description or "",
        "color_scheme": org.color_scheme,
    }
    if is_manager:
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


def get_user_dict(userlist) -> dict:
    user_dict = {}

    for user in userlist:
        user_dict.update({str(user.id): user.username})
    return user_dict


def get_org_qr(org_id: str):
    org = Organization.objects(id=org_id).first()

    org_id = org.id
    org_token = org.join_token

    qr = qrcode.QRCode(image_factory=qrcode.image.svg.SvgPathFillImage)
    qr.add_data(f'http://localhost:5001/org/{org_id}/{org_token}')
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    return img.to_string(encoding='unicode')


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



