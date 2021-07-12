import tensorflow as tf
import numpy as np
import pickle
import tensorflow_text as tf_text


"""from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
config = ConfigProto()
config.gpu_options.allow_growth = True
session = InteractiveSession(config=config)"""

inputs = []
n = 20
vocabpath = f"..\\data\\txts\\vocab.pickle"
modelpath = f"model\\rnn_05-07-2021_10-52-17.h5"
with open(f"D:\\Work\\Data\\s24_2001_sentences_shuffled_slice.txt", 'r', encoding='utf-8') as f:
    for line in f.readlines():
        inputs.append(line.strip('\n'))
inputs = np.array(inputs[:n])


def predict(mp, inps):
    with open(vocabpath, "rb") as r:
        vocab = pickle.load(r)
    MAX_SEQUENCE_LENGTH = 250
    tokenizer = tf_text.UnicodeScriptTokenizer()
    preprocess_layer = tf.keras.layers.experimental.preprocessing.TextVectorization(
        max_tokens=35002,
        standardize=tf_text.case_fold_utf8,
        split=tokenizer.tokenize,
        output_mode='int',
        output_sequence_length=MAX_SEQUENCE_LENGTH)
    preprocess_layer.set_vocabulary(vocab)
    model = tf.keras.models.load_model(mp)
    export_model = tf.keras.Sequential(
        [preprocess_layer, model,
         tf.keras.layers.Activation('softmax')])
    export_model.compile(
        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
        optimizer='adam',
        metrics=['accuracy'])
    predicted_scores = export_model.predict(np.array(inps))
    predicted_labels = tf.argmax(predicted_scores, axis=1)
    print(predicted_scores, predicted_labels)
    for i, (inp, label) in enumerate(zip(inputs, predicted_labels)):
        print(f"Sentence: {inp}")
        print(f"Predicted label: {label.numpy()}")
        print(f"Predicted probs: {', '.join(f'{q:.5f}' for q in predicted_scores[i])}\n")


predict(modelpath, inputs)
