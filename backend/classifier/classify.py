#%%
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras import losses
from tensorflow.keras import preprocessing
from tensorflow.keras.layers.experimental.preprocessing import TextVectorization

#%%

import matplotlib.pyplot as plt


def plot_graphs(history, metric):
    plt.plot(history.history[metric])
    plt.plot(history.history['val_'+metric], '')
    plt.xlabel("Epochs")
    plt.ylabel(metric)
    plt.legend([metric, 'val_'+metric])

#%%


dataset_dir = '..\\data'
train_dir = f"{dataset_dir}\\train"
test_dir = f"{dataset_dir}\\test"
# train_dir = f"{dataset_dir}\\tr"
batch_size = 32
seed = 42

#%%

train_dataset = preprocessing.text_dataset_from_directory(
    train_dir,
    batch_size=batch_size,
    validation_split=0.2,
    subset='training',
    seed=seed)

test_dataset = preprocessing.text_dataset_from_directory(
    test_dir, batch_size=batch_size)

BUFFER_SIZE = 10000
BATCH_SIZE = 64

#%%

for text_batch, label_batch in train_dataset.take(1):
    for i in range(10):
        print("Sentence: ", text_batch.numpy()[i])
        print("Label:", label_batch.numpy()[i])
example = train_dataset.take(1)

#%%

for i, label in enumerate(train_dataset.class_names):
    print("Label", i, "corresponds to", label)

#%%

validation_dataset = preprocessing.text_dataset_from_directory(
    train_dir,
    batch_size=batch_size,
    validation_split=0.2,
    subset='validation',
    seed=seed)

#%%

test_dataset = preprocessing.text_dataset_from_directory(
    test_dir, batch_size=batch_size)

#%%

VOCAB_SIZE = 1000
encoder = tf.keras.layers.experimental.preprocessing.TextVectorization(
    max_tokens=VOCAB_SIZE)
encoder.adapt(train_dataset.map(lambda text, label: text))
for text_batch, label_batch in train_dataset.take(1):
    for i in range(2):
        print("Sentence: ", text_batch.numpy()[i])
        print("Label:", label_batch.numpy()[i])

#%%

vocab = np.array(encoder.get_vocabulary())
print(vocab[:20])

#%%

for text_batch, label_batch in train_dataset.take(1):
    encoded_example = encoder(text_batch)[:3].numpy()
    print(encoded_example)
    for n in range(3):
        print("Original: ", text_batch[n].numpy())
        print("Round-trip: ", " ".join(vocab[encoded_example[n]]))
        print()

#%%

model = tf.keras.Sequential([
    encoder,
    tf.keras.layers.Embedding(
        input_dim=len(encoder.get_vocabulary()),
        output_dim=64,
        # Use masking to handle the variable sequence lengths
        mask_zero=True),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])
print([layer.supports_masking for layer in model.layers])

#%%

sample_text = "Ihana mutta hylkäyksen pelkoa aiheuttava rakkaus ja autuus tuhoaa minut täällä."
predictions = model.predict(np.array([sample_text]))
print(predictions[0])

#%%

padding = "the " * 2000
predictions = model.predict(np.array([sample_text, padding]))
print(predictions[0])

#%%

model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])

#%%

history = model.fit(train_dataset, epochs=10,
                    validation_data=test_dataset,
                    validation_steps=30)

#%%

test_loss, test_acc = model.evaluate(test_dataset)

print('Test Loss:', test_loss)
print('Test Accuracy:', test_acc)

#%%

plt.figure(figsize=(16, 8))
plt.subplot(1, 2, 1)
plot_graphs(history, 'accuracy')
plt.ylim(None, 1)
plt.subplot(1, 2, 2)
plot_graphs(history, 'loss')
plt.ylim(0, None)

#%%

predictions = model.predict(np.array([sample_text]))
print(predictions)

#%%

model = tf.keras.Sequential([
    encoder,
    tf.keras.layers.Embedding(len(encoder.get_vocabulary()), 64, mask_zero=True),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64,  return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(1)
])

#%%

model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])

#%%

history = model.fit(train_dataset, epochs=10,
                    validation_data=test_dataset,
                    validation_steps=30)

#%%

test_loss, test_acc = model.evaluate(test_dataset)

print('Test Loss:', test_loss)
print('Test Accuracy:', test_acc)

#%%

# predict on a sample text without padding.
predictions = model.predict(np.array([sample_text]))
print(predictions)

#%%

plt.figure(figsize=(16, 6))
plt.subplot(1, 2, 1)
plot_graphs(history, 'accuracy')
plt.subplot(1, 2, 2)
plot_graphs(history, 'loss')
