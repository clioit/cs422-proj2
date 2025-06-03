"""
MongoDB object schemas for CS 422 Project 2: Club Calendar.

This file defines classes for accessing objects in our MongoDB
instance. MongoEngine provides methods for creating, validating,
saving, and retrieving objects of each of these types.

Author: Ryan Kovatch
Last modified: 05/19/2025
"""
import uuid
from mongoengine import *


class Task(Document):
    """A task involved in planning/hosting an event."""
    meta = {'collection': 'tasks'}
    title = StringField(required=True)
    description = StringField()
    due_date = DateTimeField(required=True)
    completed = BooleanField(required=True, default=False)
    assignee = ReferenceField("User")


class EventInfo(EmbeddedDocument):
    """A document representing various event information fields. These
    are all StringFields intended for notetaking."""
    rsvp = StringField()  # info about number of attendees, VIPs, etc.
    venue = StringField()  # info about venue and setup
    contact = StringField()  # info about important (external) contacts
    budget = StringField()  # info about budget and funding
    other = StringField()  # miscellaneous info


class Event(Document):
    """An event for an organization."""
    meta = {'collection': 'events'}
    title = StringField(required=True)
    description = StringField()
    org = ReferenceField("Organization", required=True)
    start = DateTimeField(required=True)
    end = DateTimeField(required=True)
    published = BooleanField(required=True, default=False)
    point_of_contact = ReferenceField("User", required=True)
    tasks = ListField(ReferenceField(Task, reverse_delete_rule=PULL))
    info = EmbeddedDocumentField(EventInfo)


class Organization(Document):
    """An organization which holds events."""
    meta = {'collection': 'orgs'}
    name = StringField(required=True)
    description = StringField()
    join_token = UUIDField(binary=False, default=uuid.uuid4)
    managers = ListField(ReferenceField("User"), required=True)
    events = ListField(ReferenceField(Event, reverse_delete_rule=PULL))
    color_scheme = ListField(StringField(), required=True, default=["#FFFFFF", "#CCCCCC", "#444444"])


class User(Document):
    """A user that can create organizations and events."""
    meta = {'collection': 'users'}
    username = StringField(required=True)
    password_hash = IntField(required=True)
    orgs = ListField(ReferenceField(Organization, reverse_delete_rule=PULL), default=[])


User.register_delete_rule(Organization, 'managers', PULL)
User.register_delete_rule(Event, 'point_of_contact', NULLIFY)
User.register_delete_rule(Task, 'assignee', NULLIFY)
Organization.register_delete_rule(Event, 'org', CASCADE)
