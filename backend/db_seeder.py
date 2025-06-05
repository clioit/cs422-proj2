"""
Database seeder for CS 422 Project 2: Club Calendar.

This file runs on startup of the web server and populates the database
with various example objects (users, orgs, events, etc.).

Author: Ryan Kovatch
Last modified: 06/04/2025
"""
import random
from datetime import datetime, timedelta
from db_models import *


def seed_db():
    """
    Loads example orgs and users into the database.
    NOTE: Assumes MongoEngine is already connected to an instance.
    """

    test_events = [
        Event(
            title="Community Food Drive",
            description="Our annual food drive brings in over 10,000 cans of food each year and supports FOOD for "
                        "Lane County.",
            start=datetime.now() + timedelta(days=60), end=datetime.now() + timedelta(days=65),
            info=EventInfo(rsvp="700 people", venue="Alton Baker Park", contact="reservations@eugene-or.gov",
                           budget="$5,500"),
            tasks=[
                Task(title="Reserve event space", description="Reserve space at Alton Baker Park",
                     due_date=datetime.now() + timedelta(days=7)),
                Task(title="Contact FFLC about large donations",
                     description="Notify FFLC that we will be making a large donation at the end",
                     due_date=datetime.now() + timedelta(days=10)),
                Task(title="Acquire large containers",
                     description="We need barrels, crates, etc. to accept large amounts of food",
                     due_date=datetime.now() + timedelta(days=30)),
                Task(title="Acquire canopies, weights, tables",
                     description="We need infrastructure for the event",
                     due_date=datetime.now() + timedelta(days=45)),
                Task(title="Set up event space",
                     description="Put up the canopies, weights, tables, large containers, etc.",
                     due_date=datetime.now() + timedelta(days=59)),
            ]
        ),
        Event(
            title="Food Literacy Workshop",
            description="Eva is hosting a workshop on food literacy to help low-income individuals make "
                        "informed decisions about their health and nutrition.",
            start=datetime.now() + timedelta(days=30), end=datetime.now() + timedelta(days=30, hours=2),
            info=EventInfo(rsvp="25 people", venue="Community Kitchen", budget="$450"),
            tasks=[
                Task(title="Finish curriculum", description="Finish the workshop curriculum",
                     due_date=datetime.now() + timedelta(days=7)),
                Task(title="Distribute posters, fliers",
                     description="Put up posters and send fliers to our partners",
                     due_date=datetime.now() + timedelta(days=10)),
                Task(title="Send out email reminders",
                     description="Send email reminders to RSVPs on MailChimp",
                     due_date=datetime.now() + timedelta(days=25)),
                Task(title="Get ingredients for cooking portion",
                     description="We'll need ingredients so people can cook their meal during the workshop",
                     due_date=datetime.now() + timedelta(days=28))
            ]
        ),
        Event(
            title="Food Equity Talk",
            description="Alice is giving a talk to university and city administrators about food equity efforts.",
            start=datetime.now() + timedelta(days=15), end=datetime.now() + timedelta(days=15, hours=1),
            info=EventInfo(rsvp="15 people", venue="City Hall", contact="reservations@eugene-or.gov", budget="$100"),
            tasks=[
                Task(title="Finish slides", description="Finish the slide presentation and speaker notes",
                     due_date=datetime.now() + timedelta(days=7)),
                Task(title="Send out email reminders",
                     description="Send email reminders to attendees on MailChimp",
                     due_date=datetime.now() + timedelta(days=12))
            ]
        )
    ]
    for event in test_events:
        for task in event.tasks:
            task.save()
        event.save(validate=False)  # because we haven't set org or point of contact yet

    test_org = Organization(name="Eugene Community Kitchen",
                            description="The community kitchen of Eugene. Join us for free meals and lessons in"
                                        "cooking, food literacy, and food equity. Open to all!",
                            events=test_events)
    test_org.save(validate=False)  # because we haven't populated managers yet

    for username in ("alice", "bob", "eva"):
        new_user = User(username=username, password_hash=hash("hunter2"), orgs=[test_org])
        new_user.save()
        test_org.managers.append(new_user)
        test_org.save()

    for event in test_events:
        event.org = test_org
        event.point_of_contact = random.choice(test_org.managers)
        event.save()
        for task in event.tasks:
            task.assignee = random.choice(test_org.managers)
            task.save()
