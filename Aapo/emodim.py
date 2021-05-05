from libvoikko import Voikko
import libvoikko
import os
from flask import *  # render_template
from wvlib_light import lwvlib
import xml.etree.ElementTree as ET
from markupsafe import escape

"""
server end for running the classifier.

What follows with the Voikko and wvlib_light may be thread-unsafe.
The libraries are loaded end kept in to increase responsiveness in a single user case 
(no need to wait for the library to load).
Consequently, bad things may happen if this is run in a production environment with many simultaneous users.

"""

path = f"{os.getcwd()}\\Voikko"
print(path)
Voikko.setLibrarySearchPath(path)
v = Voikko(u"fi", path)
tree = ET.parse("soderholm_et_al.xml")
root = tree.getroot()
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)

# help(Voikko)


def find_baseform(word, voikko_instance):
    r = voikko_instance.analyze(word)
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
    if len(word) < 2:
        return None, None
    nearest = library.nearest(word, 1000)
    if nearest is not None:
        for n in nearest:  # Iterate through the words to find the first that we have ratings for
            # print(n[1])
            if len(n[1]) > 1:
                baseform = find_baseform(n[1], v)
                ratingResult = rate(baseform)
                if ratingResult[0] is not None:
                    return {'word': n[1], 'similarity': n[0], 'baseform': baseform, 'rating': ratingResult}
    return {'word': None, 'similarity': None, 'baseform': None, 'rating': None}


app = Flask(__name__, static_folder='')


@app.route('/')
def start_page():
    # 'To ask for a rating for a word, use URL ending evaluate/<word>.'
    message = url_for("static", filename="style.css")
    return render_template('index.html', message=message)


@app.route('/evaluate/<string:word>')
def evaluate_word(word):  # Returns a python map with the rating data in JSON.
    print(word)
    resultMap = word_eval(word)
    return jsonify(resultMap)


# return escape(resultstring)

def word_eval(word):
    baseform = find_baseform(word, v)
    ratingresult = rate(baseform)
    # resultstring=("Voikko: baseform:"+baseform+" valence:"+str(ratingresult[0])+" arousal:"+str(ratingresult[1]))
    ratedsynonym = findRatedSynonym(baseform, wv)
    # resultstring=resultstring+ "\nParsebank: nearest: " + ratedsynonym['baseform'] +
    # " " + str(float(ratedsynonym['similarity'])) + " valence:" + ratedsynonym['rating'][0] +
    # " arousal:" + ratedsynonym['rating'][1]
    resultMap = {'voikko_baseform': baseform}
    if ratingresult[0] is not None:
        # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
        resultMap['direct_valence'] = float(ratingresult[0])
    if ratingresult[1] is not None:
        resultMap['direct_arousal'] = float(ratingresult[1])
        resultMap['parsebank_nearest'] = ratedsynonym['baseform']
        resultMap['parsebank_nearest_distance'] = float(ratedsynonym['similarity'])
        resultMap['parsebank_nearest_valence'] = float(ratedsynonym['rating'][0])
        resultMap['parsebank_nearest_arousal'] = float(ratedsynonym['rating'][1])
    # print(resultMap)
    return resultMap


@app.route('/evaluate_text/<string:text>')
def evaluate_text(text):
    # text="Näinhän se menee. Kuntien päättäjillä on suhteita rakennusyhtiöihin ja tekniseen toimeen on sisäänrakennettu
    # tarve purkaa vanhaa ja rakentaa uutta ja lyhytikäistä. Julkisella sektorilla ei ymmärretä kuinka kova työ yhdenkin
    # veroeuron eteen on tehty. Siellä on vieraannuttu täysin reaalitaloudesta."
    result_list = []
    tokens = v.tokens(text)
    print(tokens)
    print("Text: ", '"', text, '"')
    vsum = asum = dsum = 0
    for t in tokens:
        resultMap = {'original_text': t.tokenText}
        if t.tokenType == libvoikko.Token.WORD:
            baseform = find_baseform(t.tokenText, v)
            resultMap['baseform'] = baseform
            ratingResult = rate(baseform)
            if ratingResult[0] is not None:
                print(t.tokenText, "->", baseform, ":", end=' ')
                # the presence of the 'direct_' fields shows that the parsebank would not have been needed.
                resultMap['direct_valence'] = float(ratingResult[0])
                resultMap['direct_arousal'] = float(ratingResult[1])
                resultMap['direct_dominance'] = float(ratingResult[2])
                for result in ratingResult:
                    print(result, end=" ")
                print('')
            if ratingResult[0] is not None:
                vsum += float(ratingResult[0])
                asum += float(ratingResult[1])
                dsum += float(ratingResult[2])
            else:
                print("No ratings for \"", baseform, "\". Looking for similar words... ", end='', sep='')
                r = findRatedSynonym(baseform, wv)
                if r['word'] is None:
                    print("None found.")
                else:
                    print("found: \"", r['baseform'], "\"(", r['similarity'], "):", end=' ', sep='')
                    resultMap['parsebank_nearest'] = r['baseform']
                    resultMap['parsebank_nearest_distance'] = float(r['similarity'])
                    resultMap['parsebank_nearest_valence'] = float(r['rating'][0])
                    resultMap['parsebank_nearest_arousal'] = float(r['rating'][1])
                    resultMap['parsebank_nearest_dominance'] = float(r['rating'][2])
                    for rresult in r['rating']:
                        print(rresult, end=" ")
                    print('')
                    vsum += float(r['rating'][0])
                    asum += float(r['rating'][1])
                    dsum += float(r['rating'][2])
        elif t.tokenType == libvoikko.Token.PUNCTUATION:
            print(t.tokenText)
        result_list.append(resultMap)
    # else:
    print("Sums of per word rated emotions in the text:")
    print("  valence:   %.2f" % vsum)
    print("  arousal:   %.2f" % asum)
    print("  dominance: %.2f" % dsum)
    return jsonify(result_list)
