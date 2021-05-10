from libvoikko import Voikko
import libvoikko
from flask import *  # render_template
import emodim as em
import os
from wvlib_light import lwvlib

path = f"{os.getcwd()}\\Voikko"
Voikko.setLibrarySearchPath(path)
v = Voikko(u"fi", path)
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)
app = Flask(__name__, static_folder='')


@app.route('/')
def start_page():
    # 'To ask for a rating for a word, use URL ending evaluate/<word>.'
    message = url_for("static", filename="style.css")
    return render_template('index.html', message=message)


@app.route('/evaluate/<string:word>')
def evaluate_word(word):  # Returns a python map with the rating data in JSON.
    resultMap = em.word_eval(word)
    print(resultMap)
    return jsonify(resultMap)


@app.route('/evaluate_text/<string:text>')
def evaluate_text(text):
    """
    text = "Näinhän se menee. Kuntien päättäjillä on suhteita rakennusyhtiöihin ja tekniseen toimeen on
    sisäänrakennettu tarve purkaa vanhaa ja rakentaa uutta ja lyhytikäistä. Julkisella sektorilla ei ymmärretä
     kuinka kova työ yhdenkin veroeuron eteen on tehty. Siellä on vieraannuttu täysin reaalitaloudesta."
    """
    result_list = []
    tokens = v.tokens(text)
    print(tokens)
    print(f"Text: \"{text}\"")
    vsum = asum = dsum = 0
    for t in tokens:
        resultMap = {'original_text': t.tokenText}
        if t.tokenType == libvoikko.Token.WORD:
            em.word_eval(t)

            baseform = em.find_baseform(t.tokenText, v)
            resultMap['baseform'] = baseform
            ratingResult = em.rate(baseform)
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
                print(f"No ratings for \"{baseform}\" Looking for similar words... ")
                r = em.findRatedSynonym(baseform, wv)
                if r['nearest'] is None:
                    print("None found.")
                else:
                    print(f"found: \"{r['baseform']}\"({r['similarity']}):")
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
    print(f"  valence:     {vsum:.2f}")
    print(f"  arousal:     {asum:.2f}")
    print(f"  dominance:   {dsum:.2f}")
    return jsonify(result_list)
