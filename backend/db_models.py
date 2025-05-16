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


class Event(Document):
    """An event for an organization."""
    meta = {'collection': 'events'}
    title = StringField(required=True)
    description = StringField()
    start = DateTimeField()
    end = DateTimeField()


class Organization(Document):
    """An organization which holds events."""
    meta = {'collection': 'orgs'}
    name = StringField(required=True)
    description = StringField()
    join_token = UUIDField(binary=False, default=uuid.uuid4)
    events = ListField(ReferenceField(Event, reverse_delete_rule=PULL))


class User(Document):
    """A user that can create organizations and events."""
    meta = {'collection': 'users'}
    username = StringField(required=True)
    password_hash = IntField(required=True)
    orgs = ListField(ReferenceField(Organization, reverse_delete_rule=PULL))
