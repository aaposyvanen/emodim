import emodim as em
from tqdm import tqdm

path = "D:\\Work\\Data\\s24_2001_sentences_shuffled.txt"
# path = "D:\\Work\\Data\\s24_2017_sentences_shuffled.txt"
# path = "..\\data\\test_sentences_31-05-2021_15-06-45.txt"
higharousals = []
lowarousals = []
highvalences = []
lowvalences = []
notrated = []
with open(f'..\\data\\ValenceSentences.txt', 'w', encoding='utf-8') as val:
    with open(f'..\\data\\ArousalSentences.txt', 'w', encoding='utf-8') as ar:
        with open(path, 'r', encoding='utf-8') as f:
            for i, line in tqdm(enumerate(f)):
                ev, wc, vsum, asum, dsum = em.evaluate_text(line.replace('\n', ''))
                if vsum / wc < -0.3 or asum / wc < -0.3 or vsum / wc > 0.3 or asum / wc > 0.3:
                    if vsum / wc < -0.3:
                        lowvalences.append(ev)
                        # out.write(f"low valence ({vsum / wordcount:.2f}) {line}")
                        val.write(line)
                    elif asum / wc < -0.3:
                        lowarousals.append(ev)
                        # out.write(f"low arousal ({asum / wordcount:.2f}) {line}")
                        ar.write(line)
                    if vsum / wc > 0.3:
                        highvalences.append(ev)
                        # out.write(f"high valence ({vsum / wordcount:.2f}) {line}")
                        val.write(line)
                    elif asum / wc > 0.3:
                        higharousals.append(ev)
                        # out.write(f"high arousal ({asum / wordcount:.2f}) {line}")
                        ar.write(line)
                else:
                    notrated.append({line: [round(vsum / wc, 2), round(asum / wc, 2)]})
val.close(), ar.close(), f.close()
""" 
    out.write(f"Number of high arousals: {len(higharousals)}\n")
    out.write(f"Number of high valences: {len(highvalences)}\n")
    out.write(f"Number of low arousals: {len(lowarousals)}\n")
    out.write(f"Number of low valences: {len(lowvalences)}")
"""