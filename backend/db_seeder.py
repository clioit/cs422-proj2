"""
Database seeder for CS 422 Project 2: Club Calendar.

This file runs on startup of the web server and populates the database
with various example objects (users, orgs, events, etc.).

Author: Ryan Kovatch
Last modified: 05/15/2025
"""

from datetime import datetime
from db_models import *


def seed_db():
    """
    Loads example orgs and users into the database.
    NOTE: Assumes MongoEngine is already connected to an instance.
    """
    test_event = Event(title='Chess Tournament', description='Our first annual chess tournament!',
                       start=datetime.now(), end=datetime.now().replace(hour=(datetime.now().hour + 4) % 24))
    test_event.save()
    test_org = Organization(name="Chess Club", description="We're the Chess Club!", events=[test_event])
    test_org.save()

    for username in ("alice", "bob", "eva"):
        User(username=username, password_hash=hash("hunter2"), orgs=[test_org]).save()
