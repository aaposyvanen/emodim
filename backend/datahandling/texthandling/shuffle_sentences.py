import random


# path = f"D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17.txt"
path = f"D:\\Work\\Data\\s24_2001_sentences.txt"

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
random.shuffle(lines)
with open(path.replace(".txt", "_shuffled.txt"), "w", encoding='utf-8') as f:
    f.writelines(lines)
