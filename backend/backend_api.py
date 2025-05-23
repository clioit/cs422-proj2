"""
Web server for CS 422 Project 2: Club Calendar

This file implements a RESTful API for committing and retrieving
data from a MongoDB instance. It also renders and serves the
HTML templates in frontend/templates.

Authors: Ryan Kovatch
Last modified: 05/15/2025
"""

from db_seeder import seed_db
from flask import Flask, render_template
from flask_restful import Api
from flask_simplelogin import SimpleLogin
from mongoengine import connect
from os import environ as env
from resources import *


def authenticate(user: dict[str, str]) -> bool:
    try:
        found_user = User.objects.get(username=user["username"])
    except DoesNotExist:
        return False
    return found_user.password_hash == hash(user["password"])


app = Flask(__name__,
            template_folder='/frontend/templates',
            static_folder='/frontend/static')
if "SECRET_KEY" in env:
    app.config["SECRET_KEY"] = env["SECRET_KEY"]
else:
    raise ValueError("You must set a SECRET_KEY environment variable before building this app.")

SimpleLogin(app, login_checker=authenticate)
api = Api(app)
connect(host=f"mongodb://{env['MONGODB_HOSTNAME']}:27017/club_db")

if User.objects.count() == 0:
    seed_db()

api.add_resource(UserResource, '/users/me')
api.add_resource(UserList, '/users')


@app.route("/")
def index():
    return redirect("/users/me")

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

@app.route("/event_editor")
def edit_event():
    return render_template('event_editor.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
