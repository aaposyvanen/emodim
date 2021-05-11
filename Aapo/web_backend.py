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
    return jsonify(resultMap)


@app.route('/evaluate_text/<string:text>')
def evaluate_text(text):
    """text = "Ihana mutta hylkäyksen pelkoa aiheuttava rakkaus ja autuus tuhoaa minut täällä."
     """
    textValues = []
    # split the text into tokens
    tokens = v.tokens(text)
    print(f"Text: \"{text}\"")
    vsum = asum = dsum = 0
    for t in tokens:
        if t.tokenType == libvoikko.Token.WORD:
            evaluate = em.word_eval(t.tokenText)
            try:
                vsum += float(evaluate['rating'][0])
                asum += float(evaluate['rating'][1])
                dsum += float(evaluate['rating'][2])
            except TypeError:
                continue
            textValues.append(evaluate)
        else:
            textValues.append({'original_text': t.tokenText})
    print("Sums of per word rated emotions in the text:")
    print(f"valence:\t{vsum:.3f}")
    print(f"arousal:\t{asum:.3f}")
    print(f"dominance:\t{dsum:.3f}")
    print(textValues)
    return jsonify(textValues)
