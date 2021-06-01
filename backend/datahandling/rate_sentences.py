import emodim as em
from tqdm import tqdm

path = "D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17.txt"
# path = "..\\data\\test_sentences_31-05-2021_15-06-45.txt"
higharousals = []
lowarousals = []
highvalences = []
lowvalences = []
with open(f'..\\data\\ratedsentences.txt', 'w', encoding='utf-8') as out:
    with open(path, 'r', encoding='utf-8') as f:
        for i, line in tqdm(enumerate(f)):
            if i == 2000:
                break
            ev, wordcount, vsum, asum, dsum = em.evaluate_text(line.replace('\n', ''))
            if vsum / wordcount < -0.4:
                lowvalences.append(ev)
                out.write(f"low valence ({vsum / wordcount:.2f}) {line}")
            if asum / wordcount < -0.4:
                lowarousals.append(ev)
                out.write(f"low arousal ({asum / wordcount:.2f}) {line}")
            if vsum / wordcount > 0.4:
                highvalences.append(ev)
                out.write(f"high valence ({vsum / wordcount:.2f}) {line}")
            if asum / wordcount > 0.4:
                higharousals.append(ev)
                out.write(f"high arousal ({asum / wordcount:.2f}) {line}")
    out.write(f"Number of high arousals: {len(higharousals)}\n")
    out.write(f"Number of high valences: {len(highvalences)}\n")
    out.write(f"Number of low arousals: {len(lowarousals)}\n")
    out.write(f"Number of low valences: {len(lowvalences)}")
