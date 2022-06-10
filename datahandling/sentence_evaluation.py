import os
import tensorflow as tf
import numpy as np
from nltk import tokenize

print(tf.__version__)


# os.environ['CUDA_VISIBLE_DEVICES'] = '-1'     # uncomment to use CPU, comment out to use GPU
config = tf.compat.v1.ConfigProto()             # comment out to use CPU, uncomment to use GPU
config.gpu_options.allow_growth = True          # comment out to use CPU, uncomment to use GPU
session = tf.compat.v1.Session(config=config)   # comment out to use CPU, uncomment to use GPU

modelpath = f"../data/others/rnn_10-06-2022_10-09-51"
# modelpath = f"../data/others/rnnmodel"
model = tf.keras.models.load_model(modelpath)
model.summary()


def evaluation(inps):
    inps = split_into_sentences(inps)
    ret = []
    debug = []
    predicted_scores = model.predict(np.array(inps))
    predicted_labels = tf.argmax(predicted_scores, axis=1)
    for i, (inp, label) in enumerate(zip(inps, predicted_labels)):
        values = {}
        values["Text: "] = inp
        lab = label.numpy()
        # values['Text'] = inp  # the full text predictions are performed for
        values["Label"] = str(lab)
        tmp = []
        for x in predicted_scores[i]:
            tmp.append(f"{x:.4f}")
        values['Confidences'] = tmp
        ret.append(tmp)
        debug.append(values)
        # print(debug)
    return ret


def split_into_sentences(inputs):
    if isinstance(inputs, list):
        return inputs
    sentences = tokenize.sent_tokenize(inputs, language='finnish')
    return sentences