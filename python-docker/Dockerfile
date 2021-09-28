# syntax=docker/dockerfile:1
FROM python:3.9.7-slim-bullseye
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -q -r requirements.txt
RUN apt-get -y update && apt-get -y install libvoikko1 && apt-get -y install voikko-fi
COPY . .
ENV FLASK_APP=web_backend.py
ENV FLASK_ENV=development
ENTRYPOINT ["python3.9"]
CMD ["-m" , "flask", "run", "--host=0.0.0.0"]