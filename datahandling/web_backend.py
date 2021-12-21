from flask import *  # render_template
from flask_cors import CORS, cross_origin
import emodim as em


"""
This app is the front for the Emodim word classifier demo and is used for the word-based evaluation in the front-end.
"""

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


@app.route('/evaluateSentence/<string:text>', methods=['GET', 'POST'])
@cross_origin(origins=["http://localhost:3000", "http://localhost:3001"])
def evaluateSentence(text):
    # note: jsonify sorts the dict keys alphabetically (correct values might be lost when
    # fetching ratings if they aren't fetched by key, for example if fetched by index [0] instead of ['direct_valence'])
    # print(em.evaluateText(text)[0])
    return jsonify(em.evaluateText(text))
