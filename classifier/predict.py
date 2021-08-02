import os
import tensorflow as tf
import numpy as np
import random

"""
REDUNDANT PREDCITING SCRIPT IF DOCKER CONTAINER IS USED TO PREDICT
"""

# os.environ['CUDA_VISIBLE_DEVICES'] = '-1'     # uncomment to use CPU, comment out to use GPU
config = tf.compat.v1.ConfigProto()             # comment out to use CPU, uncomment to use GPU
config.gpu_options.allow_growth = True          # comment out to use CPU, uncomment to use GPU
session = tf.compat.v1.Session(config=config)   # comment out to use CPU, uncomment to use GPU

modelpath = f"..\\data\\others\\rnn_15-07-2021_12-31-46"    # testdata to visualize predictions
model = tf.keras.models.load_model(modelpath)
model.summary()
testpath = f"..\\data\\txts\\test_paragraphs_01-06-2021_15-31-18.txt"


def test(path):
    inputs = []
    n = 20
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        random.shuffle(lines)
        for line in lines:
            inputs.append(line.strip('\n'))
    inputs = np.array(inputs[:n])
    return inputs


def makePrediction(inps):
    ret = []
    predicted_scores = model.predict(np.array(inps))
    predicted_labels = tf.argmax(predicted_scores, axis=1)
    for i, (inp, label) in enumerate(zip(inps, predicted_labels)):
        values = {}
        lab = label.numpy()
        # values['Text'] = inp  # the full text predictions are performed for
        values["Label"] = str(lab)
        tmp = []
        for x in predicted_scores[i]:
            tmp.append(str(round(x, 4)))
        values['Confidences'] = tmp
        ret.append(values)
    return ret


makePrediction(test(testpath))
