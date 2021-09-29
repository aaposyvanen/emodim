# Running the word classifier in Docker
###### For this container to run, you need to have docker installed on your computer. 
###### Please follow the instructions here: [Installing Docker Desktop for Windows.](https://docs.docker.com/docker-for-windows/install/)

## Setting up
###### After making sure that the Docker service is running, please open cmd.exe from this folder (or navigate here).


## Build and run the Dockerfile

###### Build the Dockerfile with the build command
```
docker build -t python-docker .
```

###### Run the container with the run command
```
docker run -dp 5000:5000 --rm --network emodim --name word-analyzer -v "%cd%/skipgram_dbs":"/app/skipgram_dbs" python-docker
```
###### Now, a web-server in the port 5000 should be reserved for the flask app in localhost:5000.
#
###### Please note that these commands are run on a cmd.exe, other CLI's like Powershell may require different syntax.