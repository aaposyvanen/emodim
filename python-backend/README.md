# Running the word classifier in Docker
For this container to run, you need to have docker installed on your computer. 

Please follow the instructions here: [Installing Docker Desktop for Windows.](https://docs.docker.com/docker-for-windows/install/)

## Build and run the Dockerfile

Build the Dockerfile with the build command
```
docker build -t python-backend .
```

Run the container with the run command
```
docker run -dp 5000:5000 --rm --network emodim --name python-backend -v "%cd%/skipgram_dbs":"/app/skipgram_dbs" python-backend
```
Now, a web-server in the port 5000 is reserved for the flask app in localhost:5000.