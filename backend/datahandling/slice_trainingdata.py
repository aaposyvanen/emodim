# path = "D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17_shuffled.txt"
path = f"D:\\Work\\Data\\s24_2001_sentences_shuffled.txt"


with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()[:20000]
with open(path.replace(".txt", "_slice.txt"), "w", encoding='utf-8') as f:
    f.writelines(lines)


"Lopulta voi käydä myös niin, että vaikka olettekin olleet yhdessä ja nauttineet keskenänne paljosta rakkaudesta," \
" te ette ole enää oikeita kumppaneita seuraavaa vaihetta varten." # Label: 1