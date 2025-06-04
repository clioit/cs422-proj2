# CS 422 Spring 2025 Project 2: Event Task Aid (ETA)
### Authors: Claire Cody, Luis Guzman-Cornejo, Ryan Kovatch, Evelyn Orozco, Clio Tsao
### Last modified: 06/04/2025

The Event Task Aid (ETA) is a web app intended to help organizations with putting together events and tracking tasks
related to these events.

## Purpose
A primary takeway from our conversations with student org leaders (and from our own experiences in student orgs)
was that there wasn't any cohesive platform for tracking tasks associated with various org functions, so things often
fell through the cracks. We figured this issue was probably not just isolated to student orgs, as many groups in the
real world have to plan events and deal with other organizations while doing so, resulting in many tasks.

## Repository Organization
The ETA repository is organized into three main directories:
- `frontend`: HTML, JavaScript, and CSS files supporting the frontend web app
  - `CHEAT SHEET`: Sample documents containing examples for how to write some CSS, JS, and HTML functions.
  - `static`: JavaScript and CSS files served automatically. Includes .js and .css files for the ETA’s pages.
    - `dashboard.css`, `event_editor.css`, `styles.css`, `org_settings.css`: CSS files for formatting the dashboard,
      event editor, login, and organization setting pages.
    - `colors.js`: contains logic for customizing org theme colors.
    - `dashboard.js`: primary logic for implementing dashboard page function.
    - `event_editor.js`: event editor functionality, including getting form inputs and saving.
    - `event_load.js`: functions for loading lists.
    - `org_settings.js`: functions for org editor page.
    - `transfer.js`: loads existing events to editor from dashboard.
    - `user_load.js`: loads the users of an organization.
  - `templates`: Jinja2 HTML templates to be rendered before they’re served. Includes pages for the dashboard, event
    editor, login, and org settings page.
- `backend`: Python code implementing the backend web server.
  - `db_models.py`: a file implementing classes for each major object type.
  - `db_seeder.py`: code for loading example documents into the database.
  - `backend_api.py`: the main Flask web server code.
  - `resources.py`: contains endpoint definitions for the REST API.
  - `util.py`: contains additional utility functions supporting the other files.

## Installation and Usage
The only host-system dependency this application has is Docker. All other dependencies (Python 3.13, external libraries,
and MongoDB) are installed automatically in isolated containers during the build process. To install the Docker Engine
and Docker Compose, click the link for your platform on [Get Docker](https://docs.docker.com/get-started/get-docker/).

Once you've installed Docker, open Docker Desktop. This will start the Docker daemon in the background so you can build
and deploy Docker containers. Now, assuming you have already downloaded/extracted the source code:

- `cd` into the repository's root directory (the `src` folder if you have downloaded the code from Canvas).
- Run `docker compose up -d`. This will bring up the application in the background.

After the build process finishes, the ETA web interface will be accessible at http://localhost:5001. The MongoDB
instance is accessible for debugging purposes at `mongodb://localhost:5002`. To access the database, you can use `docker
exec` on the database container to open a shell, then use `mongosh` (documentation
[here](https://www.mongodb.com/docs/mongodb-shell/)). For a GUI-based alternative, we recommend
[MongoDB Compass](https://www.mongodb.com/products/tools/compass).