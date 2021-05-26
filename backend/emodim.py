import libvoikko
import os
from wvlib_light import lwvlib
from tqdm import tqdm
import pandas as pd


"""
server end for running the classifier.

What follows with the Voikko and wvlib_light may be thread-unsafe.
The libraries are loaded end kept in to increase responsiveness in a single user case 
(no need to wait for the library to load).
Consequently, bad things may happen if this is run in a production environment with many simultaneous users.

"""
path = f"{os.getcwd()}\\Voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)
df = pd.read_excel(f"data\\bigList_normalized.xlsx")
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)


def find_baseform(word, v):
    r = v.analyze(word)
    if len(r) == 0:
        return None
    return r[0]['BASEFORM']


def rate(word):
    va = a = d = None
    if word is None:
        return va, a, d
    if word in df['Finnish-fi'].values:
        return df.loc[df['Finnish-fi'] == word]['Valence'].values[0], \
               df.loc[df['Finnish-fi'] == word]['Arousal'].values[0], \
               df.loc[df['Finnish-fi'] == word]['Dominance'].values[0]
    return va, a, d


# This function seems to be the slowest
def findRatedSynonym(word, bf, library):
    if word is None or len(word) < 2 or bf is None:
        return {"original_text": word, "nearest": None, "similarity": None, "baseform": None, "rating": (None, None, None)}
    nearest = library.nearest(word, 50)
    if nearest is not None:
        for n in nearest:  # Iterate through the words to find the first that we have ratings for
            if len(n[1]) > 1:
                baseform = find_baseform(n[1], v)
                ratingResult = rate(baseform)
                if ratingResult[0] is not None:
                    return {"original_text": bf, "nearest": n[1],
                            "similarity": round(float(n[0]), 3), "baseform": baseform, "rating": ratingResult}
    return {"original_text": word, "nearest": None, "similarity": None, "baseform": bf, "rating": (None, None, None)}


def word_eval(word):
    resultMap = {}
    t = v.tokens(word)
    if t[0].tokenType != libvoikko.Token.WORD:
        resultMap = {"original_text": t[0].tokenText, "baseform": None, "rating": (None, None, None)}
        # print(f"Token was not of type WORD: {resultMap}")
        return resultMap
    baseform = find_baseform(t[0].tokenText, v)
    if baseform is None:
        result = findRatedSynonym(t[0].tokenText, baseform, wv)
        # print(f"Baseform was None: {result}")
        return result
    # return {"original_text": t[0].tokenText, "nearest": None, "similarity": None, "baseform": None, "rating": [0, 0, 0]} # 1000it/s
    # fetch the ratings for valence, arousal and dominance for the baseform word
    rr = rate(baseform)
    if rr[0] is not None and rr[1] is not None and rr[2] is not None:
        # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
        resultMap = {"original_text": t[0].tokenText, "baseform": baseform, "direct_valence": rr[0],
                     "direct_arousal": rr[1], "direct_dominance": rr[2], "rating": rr}
        # print(f"Rating came through for baseform: {resultMap}")
    # return {"original_text": t[0].tokenText, "nearest": None, "similarity": None, "baseform": None, "rating": [0, 0, 0]} # 750 it/s
    else:
        ratedSynonym = findRatedSynonym(t[0].tokenText, baseform, wv)
        # return {"original_text": t[0].tokenText, "nearest": None, "similarity": None, "baseform": None, "rating": [0, 0, 0]} # < 10 it/s
        resultString = f"Voikko: baseform: {baseform} v: {rr[0]} a: {rr[1]} d: {rr[2]} Parsebank: {ratedSynonym}"
        # print(resultString)
        if ratedSynonym is None:
            print(f"None found. (Word: {t[0].tokenText})")
        # word_eval at this moment ends in this else statement most often (> 90% of the cases)
        else:
            # finding ratedSynonym makes the iteration 70 times slower
            rs = ratedSynonym
            resultMap = {"original_text": t[0].tokenText, "baseform": baseform, "parsebank_nearest": rs['nearest'],
                         "nearest_baseform": rs['baseform'], "parsebank_nearest_distance": rs['similarity'],
                         "parsebank_nearest_valence": rs['rating'][0], "parsebank_nearest_arousal": rs['rating'][1],
                         "parsebank_nearest_dominance": rs['rating'][2],
                         "rating": (rs['rating'][0], rs['rating'][1], rs['rating'][2])}
            # print(f"Rating did not come through for baseform and ratedSynonym was not None: {resultMap}")
    return resultMap


def evaluate_text(text):
    """text = "Ihana mutta hylkäyksen pelkoa aiheuttava rakkaus ja autuus tuhoaa minut täällä."
     """
    # split the text into tokens
    tokens = v.tokens(text)
    wordcount, vsum, asum, dsum, _, ev = evaluate(tokens)
    print("Sums of per word rated emotions in the text:")
    print(f"valence:\t{vsum / wordcount:.3f}")
    print(f"arousal:\t{asum / wordcount:.3f}")
    print(f"dominance:\t{dsum / wordcount:.3f}")
    return ev


def evaluate_s24_data(data, ftxt):
    tokenized = []
    for d in data:
        if v.tokens(d)[0].tokenType == libvoikko.Token.UNKNOWN:
            tokenized.append(f"{d}")
        else:
            tokenized.append(v.tokens(d)[0])
    wordcount, vsum, asum, dsum, JSONvalues, ev = evaluate(tokenized)
    for element in ev:
        with open(ftxt, 'a+', encoding='utf8') as f:
            if len(element) > 1:
                f.write(f"{element['original_text']}: "
                        f"{(element['rating'][0], element['rating'][1], element['rating'][2])}\n")
    """
    # vis.createRatings(ev['original_text'], ev['rating'])
    print("Sums of per word rated emotions in the text:")
    print(f"JSONvalues:\t{JSONvalues}")
    print(f"valence:\t{vsum / wordcount:.3f}")
    print(f"arousal:\t{asum / wordcount:.3f}")
    print(f"dominance:\t{dsum / wordcount:.3f}")
    """
    return JSONvalues


def evaluate(data):
    JSONvalues, textValues = [], []
    vsum, asum, dsum, wordcount = 0, 0, 0, 0
    for word in data:
        if type(word) != libvoikko.Token:
            JSONvalues.append({'word': word, 'valence': None, 'arousal': None, 'dominance': None})
            textValues.append({'original_text': word})
            continue
        if word.tokenType == libvoikko.Token.WORD:
            wordcount += 1
            ev = word_eval(word.tokenText)
            va, a, d = ev['rating'][0], ev['rating'][1], ev['rating'][2]
            JSONvalues.append({'word': word.tokenText, 'valence': va, 'arousal': a, 'dominance': d})
            textValues.append(ev)
            if va is not None:
                vsum += va
                asum += a
                dsum += d
        else:
            JSONvalues.append({'word': word.tokenText, 'valence': None, 'arousal': None, 'dominance': None})
            textValues.append({'original_text': word.tokenText})
    if wordcount == 0:
        wordcount = 1
    return wordcount, vsum, asum, dsum, JSONvalues, textValues
