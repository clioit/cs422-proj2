"""
Database seeder for CS 422 Project 2: Club Calendar.

This file runs on startup of the web server and populates the database
with various example objects (users, orgs, events, etc.).

Author: Ryan Kovatch
Last modified: 05/19/2025
"""
import random
from datetime import datetime, timedelta
from db_models import *


def seed_db():
    """
    Loads example orgs and users into the database.
    NOTE: Assumes MongoEngine is already connected to an instance.
    """
    test_tasks = [Task(title="Book event space", description="Talk to Event Services about booking a space",
                       due_date=datetime.now() + timedelta(days=7)),
                  Task(title="Execute contracts", description="Talk to ASUO legal about contract requirements",
                       due_date=datetime.now() + timedelta(days=30))]
    for task in test_tasks:
        task.save()

    test_event = Event(title="Chess Tournament", description="Our first annual chess tournament!",
                       start=datetime.now() + timedelta(days=60), end=datetime.now() + timedelta(days=60, hours=4),
                       info=EventInfo(rsvp="50 people", venue="EMU", contact="Bob Ross", budget="$1,337"),
                       tasks=test_tasks)
    test_event.save(validate=False)  # because we haven't populated org yet

    test_org = Organization(name="Chess Club", description="We're the Chess Club!", events=[test_event])
    test_org.save(validate=False)  # because we haven't populated managers yet

    for username in ("alice", "bob", "eva"):
        new_user = User(username=username, password_hash=hash("hunter2"), orgs=[test_org])
        new_user.save()
        test_org.managers.append(new_user)
        test_org.save()

    test_event.org = test_org
    test_event.point_of_contact = random.choice(test_org.managers)
    test_event.save()
    for task in test_tasks:
        task.assignee = random.choice(test_org.managers)
        task.save()
