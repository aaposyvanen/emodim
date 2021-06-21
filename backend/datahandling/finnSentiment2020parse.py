import emodim as em
from tqdm import tqdm
import json


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


output = []
"""
with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r+', encoding='utf-8') as f:
    lines = f.readlines()
    for line in tqdm(lines):
        l = line.split('\t')
        text = l[-1].strip('\n')
        results, wordcount, vsum, asum, dsum, tmp = em.evaluate_text(text)
        values = {'original_text': text, 'sentimentA': int(l[0]), 'sentimentB': int(l[1]), 'sentimentC': int(l[2]),
                  'majoritySentiment': int(l[3]), 'derivedSentiment': normalize(float(l[4]), 1, 5),
                  'calculatedValence': results[-3], 'calculatedArousal': results[-2],
                  'calculatedDominance': results[-1]}
        output.append(values)
with open(f"..\\data\\finnSentiment2020values2.json", 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
"""

with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r+', encoding='utf-8') as f:
    lines = f.readlines()
    with open(f"..\\data\\finnSentiment2020values.txt", 'w', encoding='utf-8', buffering=1) as out:
        with open(f"..\\data\\finnSentiment2020json.json", 'w', encoding='utf-8', buffering=1) as outjson:
            out.write(f"1 = sentimentA\n2 = sentimentB\n3 = sentimentC\n4 = majoritySentiment\n5 = "
                      f"derivedSentiment\n6 = pre-annotated sentiment smiley\n7 = "
                      f"pre-annotated sentiment product review\n"
                      f"8 = number of rated words (shows 1 if no rated words), sums are then 0.00\n"
                      f"9 = ratings summed (valence, arousal)\n10 = text\n")
            out.write(f"\n1\t|\t2\t|\t3\t|\t4\t|\t5\t|\t6\t|\t7\t|\t8\t|\t9\t\t|\t10\n")
            out.write(200 * '=' + '\n')
            for line in tqdm(lines):
                l = line.split('\t')
                text = l[-1].strip('\n')
                results, wordcount, vsum, asum, dsum, tmp = em.evaluate_text(text)
                """
                values = {'original_text': text, 'sentimentA': int(l[0]), 'sentimentB': int(l[1]), 'sentimentC': int(l[2]),
                          'majoritySentiment': int(l[3]), 'derivedSentiment': normalize(float(l[4]), 1, 5),
                          "pre-annotated sentiment smiley": l[5], "pre-annotated sentiment product review": l[6],
                          "number of rated words": wordcount,
                          "ratings summed (valence, arousal)": (round(vsum, 2), round(asum, 2))}
                """
                out.write(f"{int(l[0])}\t|\t{int(l[1])}\t|\t{int(l[2])}\t|\t{int(l[3])}\t|\t"
                          f"{normalize(float(l[4]), 1, 5)}\t|\t{l[5]}\t|\t{l[6]}\t|\t{wordcount}\t|\t"
                          f"({vsum:.2f}, {asum:.2f})\t|\t{text}\n")
                output.append(tmp)
            json.dump(output, outjson, indent=2, ensure_ascii=False)
