"""
MongoDB object schemas for CS 422 Project 2: Club Calendar.

This file defines classes for accessing objects in our MongoDB
instance. MongoEngine provides methods for creating, validating,
saving, and retrieving objects of each of these types.

Author: Ryan Kovatch
Last modified: 05/15/2025
"""
import uuid
from mongoengine import *


class Deadline(Document):
    """A common deadline for users to use as a template for their tasks.
    The deadline is computed by lead_time_days, which is the number of
    days before the event that this task should be finished. An example
    might be "Request surplus," which should be completed 2 weeks (14
    days) ahead of the event."""
    meta = {'collection': 'deadlines'}
    title = StringField(required=True)
    lead_time_days = IntField(required=True)


class Task(Document):
    """A task involved in planning/hosting an event."""
    meta = {'collection': 'tasks'}
    title = StringField(required=True)
    description = StringField()
    due_date = DateTimeField(required=True)
    assignee = ReferenceField("User")


class Event(Document):
    """An event for an organization."""
    meta = {'collection': 'events'}
    title = StringField(required=True)
    description = StringField()
    start = DateTimeField()
    end = DateTimeField()
    tasks = ListField(ReferenceField(Task, reverse_delete_rule=PULL))


class Organization(Document):
    """An organization which holds events."""
    meta = {'collection': 'orgs'}
    name = StringField(required=True)
    id = StringField(required=True)
    description = StringField()
    join_token = UUIDField(binary=False, default=uuid.uuid4)
    managers = ListField(ReferenceField("User"))
    events = ListField(ReferenceField(Event, reverse_delete_rule=PULL))


class User(Document):
    """A user that can create organizations and events."""
    meta = {'collection': 'users'}
    username = StringField(required=True, unique=True)
    password_hash = IntField(required=True)
    orgs = ListField(ReferenceField(Organization, reverse_delete_rule=PULL))


User.register_delete_rule(Organization, 'managers', PULL)
User.register_delete_rule(Task, 'assignee', NULLIFY)
