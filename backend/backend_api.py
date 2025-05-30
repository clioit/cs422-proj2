"""
Web server for CS 422 Project 2: Club Calendar

This file implements a RESTful API for committing and retrieving
data from a MongoDB instance. It also renders and serves the
HTML templates in frontend/templates.

Authors: Ryan Kovatch, Luis Guzman-Cornejo
Last modified: 05/23/2025
"""

from db_models import *
from db_seeder import seed_db
from flask import Flask, redirect, abort
from flask_restful import Resource, Api
from flask_simplelogin import SimpleLogin, get_username, login_required
from mongoengine import connect
from os import environ as env


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


class UserResource(Resource):
    method_decorators = [login_required]

    def get(self):
        """Get the current user."""
        return {'username': get_username()}

    def patch(self):
        """Edit the current user."""
        abort(501, "Not Implemented")


class UserList(Resource):
    def post(self):
        """Create a new user."""
        abort(501, "Not Implemented")


api.add_resource(UserResource, '/users/me')
api.add_resource(UserList, '/users')
api.add_resource(OrganizationList, '/orgs')
api.add_resource(OrganizationResource, '/orgs/<string:org_id>')
api.add_resource(EventList, '/orgs/<string:org_id>/events')
api.add_resource(EventResource, '/orgs/<string:org_id>/events/<string:event_id>')
api.add_resource(TaskList, '/orgs/<string:org_id>/events/<string:event_id>/tasks')
api.add_resource(TaskResource, '/orgs/<string:org_id>/events/<string:event_id>/tasks/<string:task_id>')

@app.route("/")
def index():
    return redirect("/users/me")

@app.route("/login")
def edit_event():
    return render_template('login.html')

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

@app.route("/event_editor")
def edit_event():
    return render_template('event_editor.html')

@app.route("/org_settings")
def edit_event():
    return render_template('org_settings.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
