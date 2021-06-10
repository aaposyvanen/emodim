import libvoikko

path = "Voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)


with open("..\\data\\ArousalSentences.txt", 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print(len(lines))
    new = []
    for line in lines:
        if line.find('http') != -1 or line.find('www.') != -1 or len(v.tokens(line)) <= 5:
            continue
        else:
            new.append(line)
print(len(new))
with open("..\\data\\ArousalSentences_corrected.txt", 'w', encoding='utf-8') as out:
    out.writelines(new)


def untrashifyTrainingdata():
    with open("..\\data\\tr\\neutralsentences.txt", 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(len(lines))
        new = []
        for line in lines:
            if line.find('http') != -1 or line.find('www.') != -1 or len(v.tokens(line)) <= 5:
                continue
            else:
                new.append(line)
    print(len(new))
    with open("..\\data\\tr\\neutralsentences_corrected.txt", 'w', encoding='utf-8') as out:
        out.writelines(new)

    with open("..\\data\\tr\\positivesentences.txt", 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(len(lines))
        new = []
        for line in lines:
            if line.find('http') != -1 or line.find('www.') != -1 or len(v.tokens(line)) <= 5:
                continue
            else:
                new.append(line)
    print(len(new))
    with open("..\\data\\tr\\positivesentences_corrected.txt", 'w', encoding='utf-8') as out:
        out.writelines(new)

    with open("..\\data\\tr\\negativesentences.txt", 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(len(lines))
        new = []
        for line in lines:
            if line.find('http') != -1 or line.find('www.') != -1 or len(v.tokens(line)) <= 5:
                continue
            else:
                new.append(line)
    print(len(new))
    with open("..\\data\\tr\\negativesentences_corrected.txt", 'w', encoding='utf-8') as out:
        out.writelines(new)


# untrashifyTrainingdata()
