# Emodim

This repository contains the backend components for Emodim project.

Frontend components can be found in [this repo](https://github.com/JokkeT/emodim-front).

## Setting up the Docker environment

The backend components require two large database files to be downloaded, which can be found from [here] (http://dl.turkunlp.org/finnish-embeddings/) and [here] (https://metashare.csc.fi/repository/browse/the-suomi24-corpus-2001-2017-vrt-version-11/10d23b2a522911eaae85005056be118e1399c95f81c24248a0b11a6953398218/).

The whole project can be run by running the command

```
docker-compose up -d
```

or by running the following commands
```
Emodim> docker pull tensorflow/serving
Emodim> docker build -t python-docker ./python-docker
Emodim> docker build -t chat-server ./chatServer
Emodim> docker build -t front ./emodim-front
Emodim/classifier> docker run -dp 8501:8501 --rm --network emodim --name sentence-analyzer -v "%cd%/model/rnnmodel:/models/rnnmodel" -e MODEL_NAME=rnnmodel tensorflow/serving # cmd
Emodim/python-docker> docker run -dp 5000:5000 --rm --network emodim --name word-analyzer -v "%cd%/skipgram_dbs":"/app/skipgram_dbs" python-docker # cmd
Emodim/chatServer> docker run -dp 3010:3010 --rm --network emodim --name chat-server chat-server
Emodim/emodim-front> docker run -dp 3000:3000 --rm --network emodim --name front front
```

## Setting up the development environment

If the scripts in 'datahandling' or the RNN-model training script in 'classifier' are to be run, a development environment can be set up in the following way:

### Using an Anaconda environment
Anaconda can be installed by following [this guide](https://docs.anaconda.com/anaconda/install/windows/). After Anaconda is installed, an environment can be set up in the following way:
```
conda create -n myenv python=3.8
```
Then activate the environment:
```
conda activate myenv
```
After creating the environment, open cmd.exe and navigate in the folder containing requirements.txt file. The required python packages can be installed with the following command: 
```
pip install -r requirements.txt
```
If the scripts dealing with word-based annotation, the finnish_s24_skgram.bin parsebank file(s) must be downloaded. These files are quite large (6Gb), therefore not in the github repository. The files can be downloaded from
http://dl.turkunlp.org/finnish-embeddings/.

Another large file used in this project is the Suomi24-corpus, which contains all threads posted in the Suomi24 forum in 2001-2017. The corpus can be downloaded from [here](https://metashare.csc.fi/repository/browse/the-suomi24-corpus-2001-2017-vrt-version-11/10d23b2a522911eaae85005056be118e1399c95f81c24248a0b11a6953398218/).

When pip is ready, the scripts can be run from commandline with:
```
python scriptname.py
```
The scripts were developed using PyCharm editor and run in the PyCharm development environment. An Anaconda install is not necessarily needed, in which case pip and python have to be installed and then the pip install command run. 
#### Re-training the model
If the RNN model needs for some reason to be retrained, installing Tensorflow can be done by running
```
pip install -r requirements.txt
```
in the /classifier folder. These requirement files are separated if Tensorflow is not needed, since it is a big install. The jupyter notebook can be run with this command:
```
jupyter-lab
```
which will open a browser with a jupyter server running.
## Structure

The 'datahandling' folder contains scripts and apps to manipulate the s24-data. Most of the scripts are used to extract or modify the .vrt, .xlsx, .csv or .tsv files and should only be used if new data needs to be acquired from the corpus (or other text files in 'data' folder). The 'build' and 'dist' folders contain files for the sentence classifying app, which can be run by executing the 'trainingdata.exe' file.

## Running the word-based classifier

Executing the 'run.bat' script in /datahandling runs a python server in localhost:5000. **This server needs to be running during system operation**, because the chatServer component uses it for real-time word analysis. **Unlike all other services required for system operation, this server is not included in any Docker containers and always needs to be started separately!**

The server also provides a simple browser UI for demo purposes at the same address.

# NOTE!
If running the scripts is needed, one should edit the paths to the files to be parsed that are hard-coded inside the .py files.
