from tqdm import tqdm
from datetime import datetime

time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")


def parseTSV():
    path = f"..\\..\\data\\fi-annotated.tsv"
    pos, neg = [], []
    novotes = 0
    """classes = "anger": '1', "anticipation": '2', "disgust": '3', 
    "fear": '4', "joy": '5', "sadness": '6', "surprise": '7', "trust": '8'"""
    positives = {"anticipation": '2', "joy": '5', "trust": '8'}
    negatives = {"anger": '1', "disgust": '3', "fear": '4', "sadness": '6'}
    with open(path, 'r', encoding='utf-8') as f:
        with open(path.replace(".tsv", f"_pos_{time}.txt"), 'w', encoding='utf-8') as outpos:
            with open(path.replace(".tsv", f"_neg_{time}.txt"), 'w', encoding='utf-8') as outneg:
                lines = f.readlines()
                # for j, line in enumerate(tqdm(lines)):
                for j, line in enumerate(lines):
                    text = line.split('\t')[0]
                    values = line.split('\t')[-1]
                    if any(i in values for i in list(positives.values())):
                        if any(k in values for k in list(negatives.values())):
                            novotes += 1
                        else:
                            pos.append(text)
                            outpos.write(f"{text}\n")
                    else:
                        if any(l in values for l in list(negatives.values())):
                            neg.append(text)
                            outneg.write(f"{text}\n")
                        else:
                            novotes += 1

    print(len(pos), len(neg), novotes)


def parseFinnsentiment():
    path = "D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv"
    with open(path, 'r', encoding='utf-8') as f:
        with open(path.replace(".tsv", f"_pos_{time}.txt"), 'w', encoding='utf-8') as outpos:
            with open(path.replace(".tsv", f"_neg_{time}.txt"), 'w', encoding='utf-8') as outneg:
                with open(path.replace(".tsv", f"_neut_{time}.txt"), 'w', encoding='utf-8') as outneut:
                    lines = f.readlines()
                    for line in tqdm(lines):
                        l = line.split('\t')
                        text = l[-1].strip('\n')
                        gt = l[3]
                        if gt == '-1':
                            outneg.write(f"{text}\n")
                        if gt == '0':
                            outneut.write(f"{text}\n")
                        if gt == '1':
                            outpos.write(f"{text}\n")


# parseTSV()
parseFinnsentiment()
