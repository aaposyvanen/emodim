# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN apt-get update -y
RUN apt-get install -y python3-libvoikko
RUN mkdir $HOME/.voikko
COPY . .
ENV FLASK_APP=test.py
ENV FLASK_ENV=development
ENTRYPOINT ["python3.8"]
CMD ["-m" , "flask", "run", "--host=0.0.0.0"]