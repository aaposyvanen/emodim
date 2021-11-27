from numpy.core.fromnumeric import argmax
import sentence_evaluation as rating
import csv
from tqdm import tqdm
with open(f"D:\Work\Data\s24_2017_sentences_shuffled_slice_ratings.tsv", 'a', newline='') as tsvfile:
    writer = csv.writer(tsvfile, delimiter='\t')
    with open(f"D:\Work\Data\s24_2017_sentences_shuffled_slice.txt", 'r', encoding='utf-8') as file:
        label = ''
        for line in tqdm(file.readlines()[18254:]):
            l = line[:-2]
            eval = rating.evaluation(l)[0]
            if argmax(eval) == 0:
                label = 'negative'
            elif argmax(eval) == 1:
                label = 'neutral'
            else:
                label = 'positive'
            writer.writerow([l, eval, f"'{label}' with confidence {float(eval[argmax(eval)])*100:.2f}%"])
    file.close()
tsvfile.close()