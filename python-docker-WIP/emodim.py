import libvoikko
from wvlib_light import lwvlib
import pandas as pd

"""
With this script one can classify words' valence, arousal or dominance values, ranging from (-1, 1). A baseform for 
the evaluated word is acquired with the Voikko library, then the baseform is compared to the wordlist entries and if it 
exists (the words' baseform has a human-made evaluation), the values associated with the word are then returned. If 
the baseform does not have a rating in the wordlist, 50 nearest neighbors for the word are retrieved with the wvlib 
library. For each of these neighbors the same word evaluation is executed: find baseform - check if it is in the list - 
check the next word or return ratings. If the word is not rated or any of the 50 neighbors are not rated, a null rating 
is given. 

The 'findBaseform' function returns the baseform for the word. If no baseform is found, returns None.

The 'rate' function parses through the wordlist and checks if the analyzed word is found from within. If the word is 
found (has a human-made rating), returns the ratings, otherwise returns None for all three ratings.

The 'findRatedSynonym' function finds the word neighbors (what words are most often used within the same context) and 
finds a rating for the nearest neighbor. If none of the neighbors have a rating in the wordlist (rare), sets the ratings 
to None. Returns a dict containing the original word, the nearest neighbor that has a rating (or if no rating for n 
nearest, returns the nearest neighbor), the similarity of the nearest to the original word, and the ratings for the word 
or the neighbor.

The 'wordEval' function finds the baseform and the ratings for the baseform (or calls 'findRatedSynonym' function) and 
returns a dict containing relevant data case by case. NOTE: all dicts always contain a "original_text" and a "rating" 
keys, with which ratings for any word can be easily extracted (other elements can be disregarded) with the exception of 
whitespaces or punctuation, which only return the "original_text" key.

The 'evaluate' function takes an arbitrary length string, splits it into tokens and fetches ratings for the tokens 
(words) within the string. The function returns the amount of words that have gotten a rating, the sum of valences, 
the sum of arousals and the sum of dominances the words within a sentence receive, a dict containing relevant data to 
s24_classify.py script (JSONvalues, only the 'word', 'type', 'valence', 'arousal' and 'dominance'. 'type' is the Voikko 
tokenType, which is usually WORD, PUNCTUATION or WHITESPACE) and a dict containing everything the 'wordEval' function 
produces (textValues).

The 'evaluateText' function just splits a sentence into tokens and calls the evaluate function. The function returns 
textValues (ev), wordcount, vsum, asum, dsum, and tmp (JSONvalues) from the 'evaluate' function.

The 'evaluateS24Data' function writes into a .txt file the ratings for individual words extracted from s24 corpus and 
returns the whole JSONvalues dict from the 'evaluate' function. 
"""

path = "Voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)
df = pd.read_excel(f"final_wordlist.xlsx")
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)


def findBaseform(word, v):
    r = v.analyze(word)
    if len(r) == 0:
        return None
    return r[0]['BASEFORM']


def rate(word):
    va, a, d = None, None, None
    if word is None:
        return va, a, d
    if word in df['Finnish-fi'].values:
        return df.loc[df['Finnish-fi'] == word]['Valence'].values[0], \
               df.loc[df['Finnish-fi'] == word]['Arousal'].values[0], \
               df.loc[df['Finnish-fi'] == word]['Dominance'].values[0]
    return va, a, d


def findRatedSynonym(word, bf, library):
    # check if the word is useless to evaluate (too short or not defined correctly)
    if word is None or len(word) < 2 or bf is None:
        return {"original_text": word, "nearest": None, "similarity": None, "baseform": None,
                "rating": (None, None, None)}
    n = 50  # number of neighbors to take into consideration
    nearest = library.nearest(word, n)
    if nearest is not None:
        for n in nearest:  # Iterate through the words to find the first that we have ratings for
            if len(n[1]) > 1:
                baseform = findBaseform(n[1], v)
                ratingResult = rate(baseform)
                if ratingResult[0] is not None:
                    return {"original_text": bf, "nearest": n[1],
                            "similarity": round(float(n[0]), 3), "baseform": baseform, "rating": ratingResult}
    return {"original_text": word, "nearest": None, "similarity": None, "baseform": bf, "rating": (None, None, None)}


def wordEval(token):
    resultMap = {}
    baseform = findBaseform(token.tokenText, v)  # token.TokenText is just the word to be evaluated
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
    # textValues is what evaluateText wants, JSONvalues is what evaluateS24Data wants
    JSONvalues, textValues = [], []
    vsum, asum, dsum, wordcount = 0, 0, 0, 0
    for token in data:
        if token.tokenType == libvoikko.Token.WORD:
            ev = wordEval(token)
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


def evaluateText(text):
    # split the text into tokens
    tokens = v.tokens(text)
    wordcount, vsum, asum, dsum, tmp, ev = evaluate(tokens)  # tmp = JSONvalues, ev = textValues
    return ev, wordcount, vsum, asum, dsum, tmp


def evaluateS24Data(data, ftxt):
    tokenized = []
    for d in data:
        # check if the token is of type 'UNKNOWN' (s24 data has "words" like "\t" which libvoikko doesn't like)
        if v.tokens(d)[0].tokenType == libvoikko.Token.UNKNOWN:
            # make a new token that contains the whole original text (for example, if word is "\t", libvoikko considers
            # it as two tokens "\" and "t", so a new token in the form of ("\t", "UNKNOWN") has to be formed)
            tokenized.append(libvoikko.Token(f"{d}", libvoikko.Token.UNKNOWN))
        else:
            tokenized.append(v.tokens(d)[0])
    wordcount, vsum, asum, dsum, JSONvalues, ev = evaluate(tokenized)
    if ftxt != '':
        for element in ev:
            with open(ftxt, 'a+', encoding='utf8') as f:
                # just write words and ratings, not whitespaces or punctuation
                if len(element) > 1:
                    f.write(f"{element['original_text']}: "
                            f"{(element['rating'][0], element['rating'][1], element['rating'][2])}\n")
    return JSONvalues
