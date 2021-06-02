import emodim as em
from tqdm import tqdm


path = "..\\data\\s24_2001_paragraphs_01-06-2021_15-36-01.txt"
# path = "D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17.txt"
# path = "..\\data\\test_sentences_31-05-2021_15-06-45.txt"
higharousals = []
lowarousals = []
highvalences = []
lowvalences = []
notrated = []
with open(f'..\\data\\ratedsentences3.txt', 'w', encoding='utf-8') as out:
    with open(path, 'r', encoding='utf-8') as f:
        for i, line in tqdm(enumerate(f)):
            if i == 1000:
                break
            ev, wordcount, vsum, asum, dsum = em.evaluate_text(line.replace('\n', ''))
            if vsum / wordcount < -0.3 or asum / wordcount < -0.3 or vsum / wordcount > 0.3 or asum / wordcount > 0.3:
                if vsum / wordcount < -0.3:
                    lowvalences.append(ev)
                    out.write(f"low valence ({vsum / wordcount:.2f}) {line}")
                elif asum / wordcount < -0.3:
                    lowarousals.append(ev)
                    out.write(f"low arousal ({asum / wordcount:.2f}) {line}")
                if vsum / wordcount > 0.3:
                    highvalences.append(ev)
                    out.write(f"high valence ({vsum / wordcount:.2f}) {line}")
                elif asum / wordcount > 0.3:
                    higharousals.append(ev)
                    out.write(f"high arousal ({asum / wordcount:.2f}) {line}")
            else:
                notrated.append({line: [round(vsum / wordcount, 2), round(asum / wordcount, 2)]})
    out.write(f"Number of high arousals: {len(higharousals)}\n")
    out.write(f"Number of high valences: {len(highvalences)}\n")
    out.write(f"Number of low arousals: {len(lowarousals)}\n")
    out.write(f"Number of low valences: {len(lowvalences)}")
