# Dockerfile for Club Calendar web server
#
# This file dictates the build process for the Club Calendar web server
# container. It pulls a prebuilt Python 3.13 image and copies the program
# files into it, then runs the program.
#
# Author: Ryan Kovatch (rkovatch@uoregon.edu)
# Last modified: 05/15/2025

FROM python:3.13-alpine
LABEL maintainer="rkovatch@uoregon.edu"

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY backend backend
COPY frontend frontend

ENTRYPOINT ["python", "-m"]
CMD ["flask", "--app", "backend/backend_api", "--debug", "run", "--host=0.0.0.0"]
