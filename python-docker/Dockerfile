# syntax=docker/dockerfile:1
FROM python:3.9.6-slim-buster
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -q -r requirements.txt
RUN apt-get update && \
    apt-get -y --no-install-recommends install software-properties-common && \
    add-apt-repository "deb http://httpredir.debian.org/debian sid main" && \
    apt-get update && \
    apt-get -t sid install -y --no-install-recommends libvoikko1 && apt install voikko-fi
COPY . .
ENV FLASK_APP=web_backend.py
ENV FLASK_ENV=development
ENTRYPOINT ["python3.9"]
CMD ["-m" , "flask", "run", "--host=0.0.0.0"]