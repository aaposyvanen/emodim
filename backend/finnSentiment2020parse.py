import emodim as em
from tqdm import tqdm
import json


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


output = []
with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r+', encoding='utf-8') as f:
    lines = f.readlines()
    for line in tqdm(lines):
        l = line.split('\t')
        text = l[-1].strip('\n')
        results = em.evaluate_text(text)
        values = {'original_text': text, 'sentimentA': int(l[0]), 'sentimentB': int(l[1]), 'sentimentC': int(l[2]),
                  'majoritySentiment': int(l[3]), 'derivedSentiment': normalize(float(l[4]), 1, 5),
                  'calculatedValence': results[-3], 'calculatedArousal': results[-2],
                  'calculatedDominance': results[-1]}
        output.append(values)
with open(f"data\\finnSentiment2020values.json", 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
