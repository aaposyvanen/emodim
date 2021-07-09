import libvoikko

"""
With this script one can remove sentences containing words or characters of their choosing. Sentences containing too few 
rated words (sentences that are too short to give any valuable information) may also be removed. 

The deleteTrash function takes a path to a .txt file of which one wants to remove lines. The function goes over the 
file line by line and removes the line if it contains an element in the "check" list. It also removes lines that contain 
an unwanted amount of rated words. The lines that are not to be removed are added to a list and afterwards the list is 
written onto a file.

The untrashify function defines which .txt files are to be untrashified, within is a list of files that can 
be adjusted accordingly. 
"""

path = "..\\Voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)
"""
check = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '...', '---', ',,,', '>', '???', '!!!', ':', '_',
         "jeesus", "paavali", "jumala", "raamattu", "http", "www.", '&gt;', '"', '-', '\'', '(', ')']
"""
check = ["http", "www.", '>', '...', ',,,', '???', '!!!']


def deleteTrash(trash):
    with open(trash, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"Sentences before untrashifying in {trash}: {len(lines)}")
        new = []
        for line in lines:
            line = str.lower(line)
            tok = v.tokens(line)  # make a list of libvoikko tokens (this tells us what data the line consists of)
            count = 0  # The number of words within a sentence
            for token in tok:
                if token.tokenTypeName == 'WORD':
                    count += 1
            # check for the number of tokens within a sentence (whitespaces, words, punctuation, None or unknown) and
            # check if the sentence contains unwanted words or characters, also check for the amount of rated words
            if len(tok) <= 5 or any(i in line for i in check) or count <= 2 or count >= 10:
                continue
            else:
                new.append(line)
    f.close()
    print(f"Sentences after untrashifying in {trash}: {len(new)}")
    with open(trash, 'w', encoding='utf-8') as out:
        out.writelines(new)
    out.close()


def untrashify():
    dir = "..\\..\\data\\sentences\\"
    dir2 = f"..\\..\\data\\tr\\"
    untrashify = [  # f"{dir}ArousalSentences.txt", f"{dir}ValenceSentences.txt",
                    # f"{dir}negative_valence_sentences.txt",
                    # f"{dir}positive_valence_sentences.txt", f"{dir}positive_valence_sentences2.txt",
                    # f"{dir}high_arousal_sentences.txt", f"{dir}high_arousal_sentences2.txt",
                    # f"{dir}low_arousal_sentences.txt", f"{dir}low_arousal_sentences2.txt",
                    # f"{dir}positive_valence_sentences_17-06-2021_14-23-22.txt",
                    # f"{dir}negative_valence_sentences_17-06-2021_14-23-22.txt",
                    # f"{dir}high_arousal_sentences_17-06-2021_14-23-22.txt",
                    # f"{dir}low_arousal_sentences_17-06-2021_14-23-22.txt",
                    # f"{dir2}neutralsentences.txt", f"{dir2}positivesentences.txt", f"{dir2}negativesentences.txt",
                    # f"{dir2}neg.txt", f"{dir2}negative_valence_sentences.txt", f"{dir2}neu_fi.txt",
                    # f"{dir2}neutralsentences.txt", f"{dir2}pos.txt" f"{dir2}fi-annotated_pos.txt",
                    # f"{dir2}fi-annotated_neg.txt", f"{dir2}FinnSentiment2020_neg_05-07-2021_10-23-33.txt",
                    # f"{dir2}FinnSentiment2020_neut_05-07-2021_10-23-33.txt",
                    # f"{dir2}FinnSentiment2020_pos_05-07-2021_10-23-33.txt",
                    f"{dir2}combinedneg.txt",
                    f"{dir2}combinedneut.txt",
                    f"{dir2}combinedpos.txt"
    ]
    for trash in untrashify:
        deleteTrash(trash)


untrashify()
