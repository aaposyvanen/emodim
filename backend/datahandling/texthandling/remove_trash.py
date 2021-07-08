import libvoikko


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
            tok = v.tokens(line)
            count = 0
            for token in tok:
                if token.tokenTypeName == 'WORD':
                    count += 1
            if len(tok) <= 5 or any(i in line for i in check) or count <= 2 or count >= 10:
                continue
            else:
                new.append(line)
    f.close()
    print(f"Sentences after untrashifying in {trash}: {len(new)}")
    with open(trash, 'w', encoding='utf-8') as out:
        out.writelines(new)
    out.close()


def untrashifySentences():
    directory = "..\\..\\data\\sentences\\"
    untrashify = [f"{directory}ArousalSentences.txt", f"{directory}ValenceSentences.txt",
                  f"{directory}negative_valence_sentences.txt",
                  f"{directory}positive_valence_sentences.txt", f"{directory}positive_valence_sentences2.txt",
                  f"{directory}high_arousal_sentences.txt", f"{directory}high_arousal_sentences2.txt",
                  f"{directory}low_arousal_sentences.txt", f"{directory}low_arousal_sentences2.txt",
                  f"{directory}positive_valence_sentences_17-06-2021_14-23-22.txt",
                  f"{directory}negative_valence_sentences_17-06-2021_14-23-22.txt",
                  f"{directory}high_arousal_sentences_17-06-2021_14-23-22.txt",
                  f"{directory}low_arousal_sentences_17-06-2021_14-23-22.txt"]
    for trash in untrashify:
        deleteTrash(trash)


def untrashifyTrainingdata():
    directory = f"..\\..\\data\\tr\\"
    untrashify = [#f"{directory}neutralsentences.txt",
                  #f"{directory}positivesentences.txt",
                  #f"{directory}negativesentences.txt",
                  #f"{directory}neg.txt",
                  #f"{directory}negative_valence_sentences.txt",
                  #f"{directory}neu_fi.txt",
                  #f"{directory}neutralsentences.txt",
                  #f"{directory}pos.txt"
                  #f"{directory}fi-annotated_pos.txt",
                  #f"{directory}fi-annotated_neg.txt",
                  #f"{directory}FinnSentiment2020_neg_05-07-2021_10-23-33.txt",
                  #f"{directory}FinnSentiment2020_neut_05-07-2021_10-23-33.txt",
                  #f"{directory}FinnSentiment2020_pos_05-07-2021_10-23-33.txt",
                  f"{directory}combinedneg.txt",
                  f"{directory}combinedneut.txt",
                  #f"{directory}combinedpos.txt"
                  ]
    for trash in untrashify:
        deleteTrash(trash)


# untrashifySentences()
untrashifyTrainingdata()
