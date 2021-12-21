import random


"""
With this script one can slice trainingdata (sentences) from a file and create a shuffled .txt file of the sentences. 
Uncomment the function calls to perform one of the actions. The slice length can be adjusted by changing the readlines 
indexing (for example, lines = f.readlines()[:50000] takes 50k sentences and lines = f.readlines()[:100] takes 100).

The 'sliceTrainingdata' function takes a slice of a desired length of a textfile and then writes it into a new .txt file. 

The 'shuffleSentences' function makes a shuffled copy of a .txt file and then writes it into a new .txt file.
"""


# path = f"D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17.txt"
# path = f"D:\\Work\\Data\\s24_2001_sentences.txt"
#path = "E:\\OneDrive - TUNI.fi\\Emodim\\data\\tr\\combinedpos.txt"
path = "E:\\OneDrive - TUNI.fi\\Emodim\\data\\tr\\combinedneg.txt"
#path = "E:\\OneDrive - TUNI.fi\\Emodim\\data\\tr\\combinedneut2.txt"



def sliceTrainingdata():
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()[:20000]
    with open(path.replace(".txt", "_slice.txt"), "w", encoding='utf-8') as f:
        f.writelines(lines)


def shuffleSentences():
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    random.shuffle(lines)
    with open(path.replace(".txt", "_shuffled.txt"), "w", encoding='utf-8') as f:
        f.writelines(lines)

def removeLongSentences():
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        keep = []
        for line in lines:
            if len(line) <= 140:
                keep.append(line)
    print(len(keep), len(lines))
    with open(path, "w", encoding='utf-8') as f:
        f.writelines(keep)
# sliceTrainingdata()
# shuffleSentences()
removeLongSentences()