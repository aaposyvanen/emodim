import libvoikko
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


path = "Voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)
df = pd.read_excel(f"..\\data\\bigList_normalized.xlsx")
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


def word_eval(token):
    resultMap = {}
    baseform = find_baseform(token.tokenText, v)
    if baseform is None:
        result = findRatedSynonym(token.tokenText, baseform, wv)
        return result
    # fetch the ratings for valence, arousal and dominance for the baseform word
    rr = rate(baseform)
    if rr[0] is not None:
        # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
        resultMap = {"original_text": token.tokenText, "baseform": baseform, "direct_valence": rr[0],
                     "direct_arousal": rr[1], "direct_dominance": rr[2], "rating": rr}
    else:
        ratedSynonym = findRatedSynonym(token.tokenText, baseform, wv)
        resultString = f"Voikko: baseform: {baseform} v: {rr[0]} a: {rr[1]} d: {rr[2]} Parsebank: {ratedSynonym}"
        # print(resultString)
        if ratedSynonym is None:
            print(f"None found. (Word: {token.tokenText})")
        else:
            # finding ratedSynonym makes the iteration 70 times slower
            rs = ratedSynonym
            resultMap = {"original_text": token.tokenText, "baseform": baseform, "parsebank_nearest": rs['nearest'],
                         "nearest_baseform": rs['baseform'], "parsebank_nearest_distance": rs['similarity'],
                         "parsebank_nearest_valence": rs['rating'][0], "parsebank_nearest_arousal": rs['rating'][1],
                         "parsebank_nearest_dominance": rs['rating'][2],
                         "rating": (rs['rating'][0], rs['rating'][1], rs['rating'][2])}
    return resultMap


def evaluate(data):
    # textValues is what evaluate_text wants, JSONvalues is what evaluate_s24_data wants
    JSONvalues, textValues = [], []
    vsum, asum, dsum, wordcount = 0, 0, 0, 0
    for token in data:
        if token.tokenType == libvoikko.Token.WORD:
            ev = word_eval(token)
            va, a, d = ev['rating'][0], ev['rating'][1], ev['rating'][2]
            JSONvalues.append({'word': token.tokenText, 'type': token.tokenTypeName,
                               'valence': va, 'arousal': a, 'dominance': d})
            textValues.append(ev)
            if va is not None:
                wordcount += 1
                vsum += va
                asum += a
                dsum += d
        else:
            JSONvalues.append({'word': token.tokenText, 'type': token.tokenTypeName})
            textValues.append({'original_text': token.tokenText})
    if wordcount == 0:
        wordcount = 1
    return wordcount, vsum, asum, dsum, JSONvalues, textValues


def evaluate_text(text):
    # split the text into tokens
    tokens = v.tokens(text)
    wordcount, vsum, asum, dsum, tmp, ev = evaluate(tokens)
    return ev, wordcount, vsum, asum, dsum, tmp


def evaluate_s24_data(data, ftxt):
    tokenized = []
    for d in data:
        if v.tokens(d)[0].tokenType == libvoikko.Token.UNKNOWN:
            tokenized.append(libvoikko.Token(f"{d}", libvoikko.Token.UNKNOWN))
        else:
            tokenized.append(v.tokens(d)[0])
    wordcount, vsum, asum, dsum, JSONvalues, ev = evaluate(tokenized)
    if ftxt != '':
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

