# Running the sentence Classifier on Docker
For this model to run, you need to have docker installed on your computer. 
 Please follow the instructions here: [Installing Docker Desktop for Windows.](https://docs.docker.com/docker-for-windows/install/)

## Setting up
 After making sure that the Docker service is running, please open cmd.exe and navigate into the /sentence-analysis folder in the cloned [repository](https://www.github.com/aaposyvanen/emodim). The folder contains the pre-trained RNN-model for sentiment classifying. 

## Serving the model with Docker
Fetch the latest version of the TensorFlow serving image running the following command in cmd: 
```
docker pull tensorflow/serving
```

## Run the model in a container
Run the container with the run command and open the port for the web server
```
docker run -t --rm -dp 8501:8501 -v "%cd%/model/rnnmodel:/models/rnnmodel" -e MODEL_NAME=rnnmodel --network emodim --name sentence-analysis tensorflow/serving
```

## Feed the model sentences
To feed the model a sentence (or multiple sentences), use the following command:
```
curl -d "{\"signature_name\": \"serving_default\", \"instances\": [[\"Your sentence here.\"], [\"Possibly another sentence!\"]]}" -X POST http://localhost:8501/v1/models/rnnmodel:predict
```
Please note that these commands are run on a cmd.exe, other CLI's like Powershell or bash may require different syntax.
