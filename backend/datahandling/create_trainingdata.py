from tqdm import tqdm


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


"""
#with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r+', encoding='utf-8') as f:
 #   lines = f.readlines()
  #  for i, line in enumerate(tqdm(lines)):
   #     l = line.split('\t')
    #    text = l[-1].strip('\n')
     #   if int(l[3]) == -1:
      #      with open(f"..\\data\\train\\neg\\{i}.txt", 'w', encoding='utf-8') as neg:
      #          neg.write(text)
      #  elif int(l[3]) == 1:
      #      with open(f"..\\data\\train\\pos\\{i}.txt", 'w', encoding='utf-8') as pos:
      #          pos.write(text)
      #  else:
      #      with open(f"..\\data\\train\\neut\\{i}.txt", 'w', encoding='utf-8') as neut:
      #          neut.write(text)
"""


with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r+', encoding='utf-8') as f:
    with open(f"..\\data\\tr\\neg\\negativesentences.txt", 'w+', encoding='utf-8') as neg:
        with open(f"..\\data\\tr\\pos\\positivesentences.txt", 'w+', encoding='utf-8') as pos:
            with open(f"..\\data\\tr\\neut\\neutralsentences.txt", 'w+', encoding='utf-8') as neut:
                lines = f.readlines()
                for line in tqdm(lines):
                    l = line.split('\t')
                    text = l[-1].strip('\n')
                    if int(l[3]) == -1:
                        neg.write(l[-1])
                    elif int(l[3]) == 1:
                        pos.write(l[-1])
                    else:
                        neut.write(l[-1])
                f.close(), neg.close(), neut.close(), pos.close(
