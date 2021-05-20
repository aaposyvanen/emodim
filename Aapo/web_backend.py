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
# wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_s24_skgram.bin", 10000, 500000)
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
    return jsonify(em.evaluate_text(text))
