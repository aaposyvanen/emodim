from libvoikko import Voikko
from flask import *  # render_template
from flask_cors import CORS, cross_origin
import emodim as em
from wvlib_light import lwvlib

path = "Voikko"
Voikko.setLibrarySearchPath(path)
v = Voikko(u"fi", path)
# wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_s24_skgram.bin", 10000, 500000)
# wv = lwvlib.load("data\\finnish_s24_skgram.bin", 10000, 500000)
app = Flask(__name__, static_folder='')
cors = CORS(app)


@app.route('/')
def startPage():
    # 'To ask for a rating for a word, use URL ending evaluate/<word>.'
    message = url_for("static", filename="style.css")
    return render_template('index.html', message=message)


@app.route('/evaluate/<string:word>')
def evaluateWord(word):  # Returns a python map with the rating data in JSON.
    resultMap = em.wordEval(word)
    # note: jsonify sorts the dict keys alphabetically (correct values might be lost when
    # fetching ratings if they aren't fetched by key, for example if fetched by index [0] instead of ['direct_valence'])
    return jsonify(resultMap)


@app.route('/evaluateSentence/<string:text>')
@cross_origin(origins=["http://localhost:3000"])
def evaluateSentence(text):
    # note: jsonify sorts the dict keys alphabetically (correct values might be lost when
    # fetching ratings if they aren't fetched by key, for example if fetched by index [0] instead of ['direct_valence'])
    return jsonify(em.evaluateText(text))
