import libvoikko
from libvoikko import Voikko
import xml.etree.cElementTree as ET
import os
from wvlib_light import lwvlib


"""
server end for running the classifier.

What follows with the Voikko and wvlib_light may be thread-unsafe.
The libraries are loaded end kept in to increase responsiveness in a single user case 
(no need to wait for the library to load).
Consequently, bad things may happen if this is run in a production environment with many simultaneous users.

"""

path = f"{os.getcwd()}\\Voikko"
Voikko.setLibrarySearchPath(path)
v = Voikko(u"fi", path)
tree = ET.parse("soderholm_normalized.xml")
#tree = ET.parse("soderholm_et_al.xml")
root = tree.getroot()
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)


def find_baseform(word, v):
    r = v.analyze(word)
    if len(r) == 0:
        return None
    return r[0]['BASEFORM']


def rate(word):
    va = a = d = None
    for pattern in root.iter('pattern'):
        if pattern.attrib['word'] == word:
            # print(pattern.tag, pattern.attrib)
            va = pattern.attrib['valence']
            a = pattern.attrib['arousal']
            d = pattern.attrib['dominance']
    return va, a, d


def findRatedSynonym(word, library):
    ratingResult = rate(word)
    if word is None or len(word) < 2:
        return {"word": word, "nearest": None, "similarity": None, "baseform": None, "rating": ratingResult}
    nearest = library.nearest(word, 1000)
    if nearest is not None:
        for n in nearest:  # Iterate through the words to find the first that we have ratings for
            # print(n[1])
            if len(n[1]) > 1:
                baseform = find_baseform(n[1], v)
                ratingResult = rate(baseform)
                if ratingResult[0] is not None:
                    return {"word": word, "nearest": n[1], "similarity": round(float(n[0]), 3), "baseform": baseform, "rating": ratingResult}
    return {"word": word, "nearest": None, "similarity": None, "baseform": None, "rating": ratingResult}


def word_eval(word):
    baseform = find_baseform(word, v)
    if baseform is None:
        result = findRatedSynonym(word, wv)
        return result
    # fetch the ratings for valence, arousal and dominance for the baseform word
    rr = rate(baseform)
    rs = findRatedSynonym(baseform, wv)
    resultMap = {"original_text": word, "baseform": baseform}
    resultstring = f"Voikko: baseform: {baseform} v: {rr[0]} a: {rr[1]} d: {rr[2]}"
    resultstring = f"{resultstring}\nParsebank: {rs}"
    # print(resultstring)
    if rr[0] is not None and rr[1] is not None and rr[2] is not None:
        # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
        resultMap["direct_valence"] = rr[0]
        resultMap["direct_arousal"] = rr[1]
        resultMap["direct_dominance"] = rr[2]
        resultMap["rating"] = rr
    else:
        if rs is None:
            print(f"None found. (Word: {word})")
        else:
            resultMap["parsebank_nearest"] = rs['nearest']
            resultMap["parsebank_nearest_distance"] = rs['similarity']
            resultMap["parsebank_nearest_valence"] = rs['rating'][0]
            resultMap["parsebank_nearest_arousal"] = rs['rating'][1]
            resultMap["parsebank_nearest_dominance"] = rs['rating'][2]
            resultMap["rating"] = (rs['rating'][0], rs['rating'][1], rs['rating'][2])
    return resultMap
