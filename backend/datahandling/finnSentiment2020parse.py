import emodim as em
from tqdm import tqdm
import json
from datetime import datetime


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
path = "D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv"
output = []


def valenceAlgorithm():
    pos = False
    valences = []
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        lines = lines[:500]
        for line in lines:
            l = line.split('\t')
            text = l[-1].strip('\n')
            ev, wc, vsum, asum, _, _ = em.evaluate_text(text)
            # word counts for high values of arousal and valence within a sentence
            negVwc, posVwc = 0, 0
            for e in ev:
                if 'rating' in e:
                    # e['rating'][0] is valence, [1] is arousal
                    if e['rating'][0] is not None and e['rating'][1]:
                        if e['rating'][0] <= -0.5:
                            negVwc += 1
                        if e['rating'][0] >= 0.5:
                            posVwc += 1
            if int(l[3]) == 1:
                pos = True
            if posVwc / wc >= 0.25 and posVwc >= 2 and pos:
                # print(f"{l[3]}\t|\t{normalize(float(l[4]), 1, 5)}\t|\t{posVwc}\t|\t{wc}\t|\t{posVwc / wc:.2f}\t|\t{vsum:.2f}\t|\t{text}\t|\tpos")
                valences.append({text: '1'})
            elif negVwc / wc >= 0.25 and negVwc >= 2 or vsum < 0 and pos:
                print(f"{l[3]}\t|\t{normalize(float(l[4]), 1, 5)}\t|\t{posVwc}\t|\t{wc}\t|\t{posVwc / wc:.2f}\t|\t{vsum:.2f}\t|\t{text}\t|\tneg")
                valences.append({text: '-1'})
            else:
                if pos:
                    print(f"{l[3]}\t|\t{normalize(float(l[4]), 1, 5)}\t|\t{posVwc}\t|\t{wc}\t|\t{posVwc / wc:.2f}\t|\t{vsum:.2f}\t|\t{text}\t|\tneut")
                valences.append({text: '0'})
            pos = False
    return valences


def writeFile():
    with open(path, 'r+', encoding='utf-8') as f:
        lines = f.readlines()
        with open(f"..\\data\\finnSentiment2020values_{time}.txt", 'w', encoding='utf-8', buffering=1) as out:
            with open(f"..\\data\\finnSentiment2020_all_data_{time}.json", 'w', encoding='utf-8', buffering=1) as outjson:
                out.write(f"1 = sentimentA\n2 = sentimentB\n3 = sentimentC\n4 = majoritySentiment\n"
                          f"5 = derivedSentiment\n6 = pre-annotated sentiment smiley\n"
                          f"7 = pre-annotated sentiment product review\n"
                          f"8 = number of rated words (shows 1 if no rated words), sums are then 0.00\n"
                          f"9 = ratings summed (valence, arousal)\n10 = text\n")
                out.write(f"\n1\t|\t2\t|\t3\t|\t4\t|\t5\t|\t6\t|\t7\t|\t8\t|\t9\t\t|\t10\n")
                out.write(200 * '=' + '\n')
                for line in tqdm(lines):
                    l = line.split('\t')
                    text = l[-1].strip('\n')
                    results, wordcount, vsum, asum, dsum, tmp = em.evaluate_text(text)
                    out.write(f"{int(l[0])}\t|\t{int(l[1])}\t|\t{int(l[2])}\t|\t{int(l[3])}\t|\t"
                              f"{normalize(float(l[4]), 1, 5)}\t|\t{l[5]}\t|\t{l[6]}\t|\t{wordcount}\t|\t"
                              f"({vsum:.2f}, {asum:.2f})\t|\t{text}\n")
                    output.append(results)
                json.dump(output, outjson, indent=2, ensure_ascii=False)


# writeFile()
print(valenceAlgorithm())
