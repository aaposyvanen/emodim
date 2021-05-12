import libvoikko
from libvoikko import Voikko
import xml.etree.cElementTree as ET
import os
from wvlib_light import lwvlib
from tqdm import tqdm

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
# tree = ET.parse("soderholm_et_al.xml")
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
    w = find_baseform(word, v)
    ratingResult = rate(word)
    if word is None or len(word) < 2 or w is None:
        return {"original_text": word, "nearest": None, "similarity": None, "baseform": None, "rating": ratingResult}
    nearest = library.nearest(word, 1000)
    if nearest is not None:
        for n in nearest:  # Iterate through the words to find the first that we have ratings for
            # print(n[1])
            if len(n[1]) > 1:
                baseform = find_baseform(n[1], v)
                ratingResult = rate(baseform)
                if ratingResult[0] is not None:
                    return {"original_text": w, "nearest": n[1], "similarity": round(float(n[0]), 3), "baseform": baseform, "rating": ratingResult}
    return {"original_text": w, "nearest": None, "similarity": None, "baseform": None, "rating": ratingResult}


def word_eval(word):
    t = v.tokens(word)
    baseform = find_baseform(t[0].tokenText, v)
    resultMap = {}
    if t[0].tokenType != libvoikko.Token.WORD:
        resultMap = {"original_text": t[0].tokenText, "baseform": baseform, "rating": rate(t[0].tokenText)}
        return resultMap
    if baseform is None:
        result = findRatedSynonym(t[0].tokenText, wv)
        # print(f"Baseform was None: {result}")
        return result
    # fetch the ratings for valence, arousal and dominance for the baseform word
    rr = rate(baseform)
    ratedSynonym = findRatedSynonym(t[0].tokenText, wv)
    resultstring = f"Voikko: baseform: {baseform} v: {rr[0]} a: {rr[1]} d: {rr[2]}"
    resultstring = f"{resultstring}\nParsebank: {ratedSynonym}"
    # print(resultstring)
    if rr[0] is not None and rr[1] is not None and rr[2] is not None:
        # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
        resultMap = {"original_text": t[0].tokenText, "baseform": baseform, "direct_valence": rr[0],
                     "direct_arousal": rr[1], "direct_dominance": rr[2], "rating": rr}
        # print(f"Rating came through for baseform: {resultMap}")

    else:
        if ratedSynonym is None:
            print(f"None found. (Word: {t[0].tokenText})")
        else:
            rs = ratedSynonym
            resultMap = {"original_text": t[0].tokenText, "baseform": baseform, "parsebank_nearest": rs['nearest'],
                         "nearest_baseform": rs['baseform'], "parsebank_nearest_distance": rs['similarity'],
                         "parsebank_nearest_valence": rs['rating'][0], "parsebank_nearest_arousal": rs['rating'][1],
                         "parsebank_nearest_dominance": rs['rating'][2],
                         "rating": (rs['rating'][0], rs['rating'][1], rs['rating'][2])}
            # print(f"Rating did not come through for baseform and ratedSynonym was not None: {resultMap}")
            # word_eval at this moment ends in this else statement most often (> 90% of the cases)
    return resultMap
