from tqdm import tqdm
from datetime import datetime


""""
With this script one can parse through the 'fi-annotated.tsv' file and extract binary classes for OpenSubtitles 
sentences. With little modifications, classes for 8 different emotions may be extracted. For binary classification, 
classes 'anger', 'disgust', 'fear' and 'sadness' are classified as negative and classes 'anticipation', 'joy' and 'trust' 
are classified as positive.

The 'parseTSV' function parses through the 'fi-annotated.tsv' file and extracts classes for the sentences present. 
The classified sentences are written into files sentence by sentence, filenames are formatted as 
'fi-annotated_pos_xx.xx.xx_xx-xx-xx.txt' or 'fi-annotated_neg_xx.xx.xx_xx-xx-xx.txt' where the end part with xx-xx 
is the timestamp the file was saved, and the polarity of the senteces is indicated by the 'neg' or 'pos' flags.

The 'parseFinnsentiment' function parses through the 'FinnSentiment2020.tsv' file and extracts classes for the sentences 
present. As this file contains multiple different classifications, the script extracts the 'MajorityValue' value as the 
class, where -1 is classified as negative, 0 is classified as neutral and 1 is classified as positive. Unlike the 
'parseTSV' function, this function does take into account neutral sentences.
"""


time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")


def parseTSV():
    path = f"..\\..\\data\\legacy\\fi-annotated.tsv"
    pos, neg = [], []
    novotes = 0
    """classes = "anger": '1', "anticipation": '2', "disgust": '3', 
    "fear": '4', "joy": '5', "sadness": '6', "surprise": '7', "trust": '8'"""
    # skip 'surprise' since it cannot really be used to classify one way or another
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
                    # check if current text values contain any positive classifications
                    if any(i in values for i in list(positives.values())):
                        # check if current text values contain any negative classifications
                        if any(k in values for k in list(negatives.values())):
                            novotes += 1    # text contained conflicting classifications, skip the line
                        else:
                            pos.append(text)    # text contained only positive classifications, add text to positives
                            outpos.write(f"{text}\n")
                    else:   # text did not contain any positive classifications
                        # check if text contains any negative classifications
                        if any(l in values for l in list(negatives.values())):
                            neg.append(text)    # text contained only negative classifications, add text to negatives
                            outneg.write(f"{text}\n")
                        else:   # text did not contain any positive or negative classifications, skip the line
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
