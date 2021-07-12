import emodim as em
from tqdm import tqdm
import json
from datetime import datetime


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
path = "D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv"
parsepath = f"..\\data\\txts\\finnSentiment2020values_29-06-2021_10-50-44.txt"
output = []


def ratingAlgorithm():
    valences, arousals = [], []
    with open(path, 'r', encoding='utf-8') as f:
        with open(f"..\\data\\txts\\alldata_{time}.txt", 'w', encoding='utf-8', buffering=1) as out:
            out.write("wc = word count (number of rated words within a sentence)\n"
                      "lowAwc = low Arousal word count (number of low rated words within a sentence[-0.5 or lower])\n"
                      "highAwc = high Arousal word count (number of high rated words within a sentence[0.5 or higher])\n"
                      "negVwc = negative Valence word count (number of negatively rated words within a sentence [-0.5 or lower])\n"
                      "posVwc = positive Valence word count (number of positively rated words within a sentence [0.5 or higher])\n"
                      "vsum = sum of Valence ratings within a sentence\n"
                      "asum = sum of Arousal ratings within a sentence\n"
                      "gt = ground truth (majority value from finnsentiment)\n\n"
                      "The x / wc ratings are the ratio of highly / low rated words (or the mean of Valence or Arousal)\n")
            lines = f.readlines()
            for line in tqdm(lines):
            # for line in lines:
                l = line.split('\t')
                text = l[-1].strip('\n')
                ev, wc, vsum, asum, _, _ = em.evaluateText(text)
                # word counts for high values of arousal and valence within a sentence
                negVwc, posVwc, lowAwc, highAwc = ratingLoop(ev)
                alldata = f"wc: {wc}\t|\tlowAwc: {lowAwc}\t|\thighAwc: {highAwc}\t|\tlowAwc / wc: {lowAwc / wc:.2f}" \
                          f"\t|\thighAwc / wc: {highAwc / wc:.2f}\t|\tnegVwc: {negVwc}\t|\tposVwc: {posVwc}" \
                          f"\t|\tnegVwc / wc: {negVwc / wc:.2f}\t|\tposVwc / wc: {posVwc / wc:.2f}" \
                          f"\t|\tvsum: {vsum:.2f}\t|\tvsum/wc: {vsum / wc:.2f}\t|\tasum: {asum:.2f}\t|\t" \
                          f"asum/wc: {asum / wc:.2f}\t|\tgt: {int(l[3])}\t|\ttext: {text}\n"
                out.write(alldata)
                if (posVwc / wc >= 0.5 and posVwc >= 2) or vsum / wc >= 0.55:
                    valences.append({text: '1'})
                elif (negVwc / wc >= 0.5 and negVwc >= 2) or vsum <= -0.2:
                    valences.append({text: '-1'})
                else:
                    valences.append({text: '0'})
                if (highAwc / wc >= 0.25 and highAwc >= 2) or asum / wc >= 0.25:
                    #input(f"High\nwc: {wc}\t|\tlowAwc: {lowAwc}\t|\t highAwc: {highAwc}\t|\tasum: {asum:.2f}\t|\tasum/wc: {asum / wc:.2f}\t|\thighAwc / wc: {highAwc / wc:.2f}\t|\tlowAwc / wc: {lowAwc / wc:.2f}\t|\ttext: {text}")
                    arousals.append({text: '1'})
                elif (lowAwc / wc >= 0.5 and lowAwc >= 2) or asum / wc <= -0.25:
                    #input(f"Low\nwc: {wc}\t|\tlowAwc: {lowAwc}\t|\t highAwc: {highAwc}\t|\tasum: {asum:.2f}\t|\tasum/wc: {asum / wc:.2f}\t|\thighAwc / wc: {highAwc / wc:.2f}\t|\tlowAwc / wc: {lowAwc / wc:.2f}\t|\ttext: {text}")
                    arousals.append({text: '-1'})
                else:
                    #input(f"Else\nwc: {wc}\t|\tlowAwc: {lowAwc}\t|\t highAwc: {highAwc}\t|\tasum: {asum:.2f}\t|\tasum/wc: {asum / wc:.2f}\t|\thighAwc / wc: {highAwc / wc:.2f}\t|\tlowAwc / wc: {lowAwc / wc:.2f}\t|\ttext: {text}")
                    arousals.append({text: '0'})

    return valences, arousals


def ratingLoop(ev):
    negVwc, posVwc, lowAwc, highAwc = 0, 0, 0, 0
    for e in ev:
        if 'rating' in e:
            # e['rating'][0] is valence, [1] is arousal
            if e['rating'][0] is not None and e['rating'][1]:
                if e['rating'][0] <= -0.7:
                    negVwc += 1
                if e['rating'][0] >= 0.7:
                    posVwc += 1
                if e['rating'][1] <= -0.3:
                    lowAwc += 1
                if e['rating'][1] >= 0.2:
                    highAwc += 1
    return negVwc, posVwc, lowAwc, highAwc


def writeFile():
    with open(path, 'r+', encoding='utf-8') as f:
        lines = f.readlines()
        with open(f"..\\data\\txts\\finnSentiment2020values_{time}.txt", 'w', encoding='utf-8', buffering=1) as out:
            with open(f"..\\data\\jsons\\finnSentiment2020_all_data_{time}.json", 'w', encoding='utf-8', buffering=1) as outjson:
                out.write(f"1 = sentimentA\n2 = sentimentB\n3 = sentimentC\n4 = majoritySentiment\n"
                          f"5 = derivedSentiment\n6 = pre-annotated sentiment smiley\n"
                          f"7 = pre-annotated sentiment product review\n"
                          f"8 = number of rated words (shows 1 if no or just one rated word), sums are then 0.00\n"
                          f"9 = ratings summed (valence, arousal)\n10 = word-based predicted valence\n"
                          f"11 = word-based predicted arousal\n"
                          f"12 = Finnsentiment & calculated Valence, calculated Arousal\n"
                          f"13 = Accuracy\n"
                          f"14 = text\n")
                out.write(f"\n1\t|\t2\t|\t3\t|\t4\t|\t5\t|\t6\t|\t7\t|\t8\t|\t9\t\t|\t10\t|\t11\t|\t12\t\t|\t13\t\t|\t14\n")
                out.write(250 * '=' + '\n')
                # count = number of correctly classified sentences,
                # predVposCount = number of 'positive' valence predicted sentences,
                # predVnegCount = number of 'negative' valence predicted sentences,
                # predVneutCount = number of 'neutral' valence predicted sentences,
                # predAlowCount = number of 'low' arousal predicted sentences,
                # predAhighCount = number of 'high' arousal predicted sentences,
                # predAneutCount = number of 'neutral' arousal predicted sentences
                count, predVposCount, predVnegCount, predVneutCount, predAlowCount, predAhighCount, predAneutCount = 0, 0, 0, 0, 0, 0, 0
                for i, line in enumerate(tqdm(lines)):
                    l = line.split('\t')
                    text = l[-1].strip('\n')
                    ev, wc, vsum, asum, dsum, tmp = em.evaluateText(text)
                    negVwc, posVwc, lowAwc, highAwc = ratingLoop(ev)
                    if (posVwc / wc >= 0.5 and posVwc >= 2) or vsum / wc >= 0.33:
                        predV = 1
                        predVposCount += 1
                    elif (negVwc / wc >= 0.5 and negVwc >= 2) or vsum <= -0.2:
                        predV = -1
                        predVnegCount += 1
                    else:
                        predV = 0
                        predVneutCount += 1
                    if (highAwc / wc >= 0.25 and highAwc >= 2) or asum / wc >= 0.25:
                        predA = 1
                        predAhighCount += 1
                    elif (lowAwc / wc >= 0.5 and lowAwc >= 2) or asum / wc <= -0.25:
                        predA = -1
                        predAlowCount += 1
                    else:
                        predA = 0
                        predAneutCount += 1
                    if predV == int(l[3]):
                        count += 1
                    out.write(f"{int(l[0])}\t|\t{int(l[1])}\t|\t{int(l[2])}\t|\t{int(l[3])}\t|\t"
                              f"{normalize(float(l[4]), 1, 5)}\t|\t{l[5]}\t|\t{l[6]}\t|\t{wc}\t|\t"
                              f"({vsum:.2f}, {asum:.2f})\t|\t{predV}\t|\t{predA}\t|\t({int(l[3])}, {predV}), "
                              f"{predA}\t|\tAccuracy: {count / (i + 1):.2f}\t|\t{text}\n")
                    output.append(ev)
                out.write(f"Number of negative Valences predicted: {predVnegCount}\n"
                          f"Number of neutral Valences predicted: {predVneutCount}\n"
                          f"Number of positive Valences predicted: {predVposCount}\n"
                          f"Number of low Arousals predicted: {predAlowCount}\n"
                          f"Number of neutral Arousals predicted: {predAneutCount}\n"
                          f"Number of high Arousals predicted: {predAhighCount}\n"
                          f"Accuracy for Valence: {count / 27000:.2f}\n")
                # json.dump(output, outjson, indent=2, ensure_ascii=False)


def parseResults():
    positivesasneutrals, positivesasnegatives, correctpositives = 0, 0, 0
    neutralsaspositives, neutralsasnegatives, correctneutrals = 0, 0, 0
    negativesasneutrals, negativesaspositives, correctnegatives = 0, 0, 0
    with open(f"..\\data\\txts\\finnSentiment2020values_{time}.txt", 'r', encoding='utf-8', buffering=1) as f:
        lines = f.readlines()
        for line in lines[17:-7]:
            data = line.split("\t")
            gt = data[-5].split()[0][1:-1]
            pred = data[-5].split()[1][:-2]
            if gt == '1' and pred == '1':
                correctpositives += 1
            if gt == '0' and pred == '0':
                correctneutrals += 1
            if gt == '-1' and pred == '-1':
                correctnegatives += 1
            if gt == '1' and pred == '0':
                positivesasneutrals += 1
            if gt == '1' and pred == '-1':
                positivesasnegatives += 1
            if gt == '0' and pred == '-1':
                neutralsasnegatives += 1
            if gt == '0' and pred == '1':
                neutralsaspositives += 1
            if gt == '-1' and pred == '0':
                negativesasneutrals += 1
            if gt == '-1' and pred == '1':
                negativesaspositives += 1
    print(f"Number of negative sentences labeled correctly: {correctnegatives}, {correctnegatives / (correctnegatives + negativesasneutrals + negativesaspositives) * 100:.2f}%\n"
          f"Number of negative sentences labeled as neutrals: {negativesasneutrals}, {negativesasneutrals / (correctnegatives + negativesasneutrals + negativesaspositives) * 100:.2f}%\n"
          f"Number of negative sentences labeled as positives: {negativesaspositives}, {negativesaspositives / (correctnegatives + negativesasneutrals + negativesaspositives) * 100:.2f}%\n"
          f"Number of neutral sentences labeled correctly: {correctneutrals}, {correctneutrals / (correctneutrals + neutralsasnegatives + neutralsaspositives) * 100:.2f}%\n"
          f"Number of neutral sentences labeled as negatives: {neutralsasnegatives}, {neutralsasnegatives / (correctneutrals + neutralsasnegatives + neutralsaspositives) * 100:.2f}%\n"
          f"Number of neutral sentences labeled as positives: {neutralsaspositives}, {neutralsaspositives / (correctneutrals + neutralsasnegatives + neutralsaspositives) * 100:.2f}%\n"
          f"Number of positive sentences labeled correctly: {correctpositives}, {correctpositives / (correctpositives + positivesasnegatives + positivesasneutrals) * 100:.2f}%\n"
          f"Number of positive sentences labeled as negatives: {positivesasnegatives}, {positivesasnegatives / (correctpositives + positivesasnegatives + positivesasneutrals) * 100:.2f}%\n"
          f"Number of positive sentences labeled as neutrals: {positivesasneutrals}, {positivesasneutrals / (correctpositives + positivesasnegatives + positivesasneutrals) * 100:.2f}%\n"
          f"Number of overall correct predictions: {correctnegatives + correctneutrals + correctpositives}, {(correctnegatives + correctneutrals + correctpositives) / 27000 * 100:.2f}%\n"
          f"Number of mislabeled negatives: {negativesasneutrals + negativesaspositives}\n"
          f"Number of mislabeled neutrals: {neutralsasnegatives + neutralsaspositives}\n"
          f"Number of mislabeled positives: {positivesasnegatives + positivesasneutrals}")


writeFile()
# v, a = ratingAlgorithm()
parseResults()
