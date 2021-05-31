import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import pandas as pd


def plot_graphs(history, metric):
    plt.plot(history.history[metric])
    plt.plot(history.history['val_'+metric], '')
    plt.xlabel("Epochs")
    plt.ylabel(metric)
    plt.legend([metric, 'val_'+metric])


dataset = pd.read_excel('..\\data\\bigList_normalized.xlsx')
train_dataset, test_dataset = dataset['Finnish-fi'], dataset['Valence']
for example, label in train_dataset.take(1):
    print('text: ', example.numpy())
    print('label: ', label.numpy())
