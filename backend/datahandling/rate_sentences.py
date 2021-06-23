import emodim as em
from tqdm import tqdm
from datetime import datetime
import random


# path = "D:\\Work\\Data\\s24_2001_sentences_shuffled.txt"
path = "D:\\Work\\Data\\s24_2017_sentences_shuffled.txt"
# path = "..\\data\\test_sentences_31-05-2021_15-06-45.txt"
time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")


with open(f'..\\data\\sentences\\negative_valence_sentences_{time}.txt', 'w', encoding='utf-8', buffering=5) as negV:
    with open(f'..\\data\\sentences\\positive_valence_sentences_{time}.txt', 'w', encoding='utf-8', buffering=5) as posV:
        with open(f'..\\data\\sentences\\low_arousal_sentences_{time}.txt', 'w', encoding='utf-8', buffering=5) as lowA:
            with open(f'..\\data\\sentences\\high_arousal_sentences_{time}.txt', 'w', encoding='utf-8', buffering=5) as highA:
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    random.shuffle(lines)
                    for line in tqdm(lines):
                        ev, wc, vsum, asum, _ = em.evaluate_text(line.replace('\n', ''))
                        # word counts for high values of arousal and valence within a sentence
                        negVwc, posVwc, lowAwc, highAwc = 0, 0, 0, 0
                        for e in ev:
                            if 'rating' in e:
                                # e['rating'][0] is valence, [1] is arousal
                                if e['rating'][0] is not None and e['rating'][1]:
                                    if e['rating'][0] <= -0.5:
                                        negVwc += 1
                                    if e['rating'][0] >= 0.5:
                                        posVwc += 1
                                    if e['rating'][1] <= -0.5:
                                        lowAwc += 1
                                    if e['rating'][1] >= 0.5:
                                        highAwc += 1
                        # check if a sentence contains a big amount of highly rated words (25% of all rated words
                        # are +- 0.5 on a scale of -1 to 1, at least two words rated over +-0.5)
                        if negVwc / wc > 0.25 or posVwc / wc > 0.25 or highAwc / wc > 0.25:
                            if negVwc / wc > 0.25 and negVwc >= 2:
                                # out.write(f"low valence ({vsum / wordcount:.2f}) {line}")
                                negV.write(line)
                            elif posVwc / wc > 0.25 and posVwc >= 2:
                                pass
                                # out.write(f"low arousal ({asum / wordcount:.2f}) {line}")
                                posV.write(line)
                            if lowAwc / wc > 0.25 and lowAwc >= 2:
                                pass
                                # out.write(f"high valence ({vsum / wordcount:.2f}) {line}")
                                lowA.write(line)
                            elif highAwc / wc > 0.25 and highAwc >= 2:
                                # out.write(f"high arousal ({asum / wordcount:.2f}) {line}")
                                highA.write(line)
negV.close(), posV.close(), lowA.close(), highA.close(), f.close()
""" 
    out.write(f"Number of high arousals: {len(higharousals)}\n")
    out.write(f"Number of high valences: {len(highvalences)}\n")
    out.write(f"Number of low arousals: {len(lowarousals)}\n")
    out.write(f"Number of low valences: {len(lowvalences)}")
"""
