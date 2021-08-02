# Running the sentence Classifier on Docker
###### For this model to run, you need to have docker installed on your computer. 
###### Please follow the instructions here: [Installing Docker Desktop for Windows.](https://docs.docker.com/docker-for-windows/install/)

## Setting up
###### After making sure that the Docker service is running, please open cmd.exe and navigate into the /classifier folder in the cloned [repository](https://www.github.com/aaposyvanen/emodim). The folder contains the pre-trained RNN-model for sentiment classifying. 

## Serving the model
###### Fetch the latest version of the TensorFlow serving image running the following command in cmd: 
```
docker pull tensorflow/serving
```

## Build and run the Dockerfile
###### Run the container with the run command and open the port for the web server
```
docker run -t --rm -p 8501:8501 -v "%cd%/model/rnnmodel:/models/rnnmodel" -e MODEL_NAME=rnnmodel tensorflow/serving
```

## Feed the model sentences
###### To feed the model a sentence (or multiple sentences), use the following command:
```
curl -d "{\"signature_name\": \"serving_default\", \"instances\": [[\"Your sentence here.\"], [\"Possibly another sentence!\"]]}" -X POST
```
###### Please note that these commands are run on a cmd.exe, other CLI's like Powershell may require different syntax.