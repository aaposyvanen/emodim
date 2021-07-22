# Emodim

This repository contains the backend components for Emodim project.

Frontend components can be found in [this repo](https://github.com/JokkeT/emodim-front).

## Structure

The 'datahandling' folder contains scripts and apps to manipulate the s24-data. Most of the scripts to extract or 
modify the .vrt, .xlsx, .csv or .tsv files and should only be used if new data needs to be acquired from the corpus
(or other text files in 'data' folder). The 'build' and 'dist' folders contain files for the sentence classifying app, 
which can be run by executing the 'trainingdata.exe' file. By running 'run.bat', the flask server for the word-based 
classifier demo is ran in localhost:5000.

# NOTE!
If running the scripts is needed, one should edit the paths to the files to be parsed that are hard-coded inside the .py files.