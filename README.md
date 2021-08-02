# Emodim

This repository contains the backend components for Emodim project.

Frontend components can be found in [this repo](https://github.com/JokkeT/emodim-front).

## Setting up the development environment

If the scripts in 'datahandling' or the RNN-model training script in 'classifier' are to be run, a development environment can be set up in the following way:

### Using a Anaconda environment
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
When pip is ready, the scripts can be run either from commandline with:
```
python scriptname.py
```
The scripts were developed using PyCharm editor and run in the PyCharm development environment. An Anaconda install is not necessarily needed, in which case pip and python have to be installed and then the pip install command run. 
#### Re-training the model
If the RNN model needs for some reason to be retrained, installing Tensorflow can be done by running
```
pip install -r requirements.txt
```
in the classifier/trainmodel folder. These requirement files are separated if Tensorflow is not needed, since it is a big install. The jupyter notebook can be run with this command:
```
jupyter-lab
```
which will open a browser with a jupyter server running.
## Structure

The 'datahandling' folder contains scripts and apps to manipulate the s24-data. Most of the scripts to extract or modify the .vrt, .xlsx, .csv or .tsv files and should only be used if new data needs to be acquired from the corpus (or other text files in 'data' folder). The 'build' and 'dist' folders contain files for the sentence classifying app, which can be run by executing the 'trainingdata.exe' file. By running 'run.bat', the flask server for the word-based classifier demo is ran in localhost:5000.

# NOTE!
If running the scripts is needed, one should edit the paths to the files to be parsed that are hard-coded inside the .py files.