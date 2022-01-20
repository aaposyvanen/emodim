from flask import *  # render_template
from flask_cors import CORS, cross_origin
import emodim as em
import requests

app = Flask(__name__, static_folder='')
cors = CORS(app)


@app.route('/evaluateSentence/', methods = ['POST'])
@cross_origin(origins=["http://localhost:3000"])
def evaluateSentence():
    text = request.json["instances"]
    # note: jsonify sorts the dict keys alphabetically (correct values might be lost when
    # fetching ratings if they aren't fetched by key, for example if fetched by index [0] instead of ['direct_valence'])
    # print(em.evaluateText(text)[0])
    return jsonify(em.evaluateText(text))


@app.route('/fetchPredictions/', methods = ['POST'])
@cross_origin(origins=["http://localhost:3000", "http://localhost:8501"])
def predictions():
    r = requests.post('http://localhost:8501/v1/models/rnnmodel:predict', json=request.json["instances"])
    pred = json.loads(r.content.decode('utf-8'))
    print(r, pred)
    # note: jsonify sorts the dict keys alphabetically (correct values might be lost when
    # fetching ratings if they aren't fetched by key, for example if fetched by index [0] instead of ['direct_valence'])
    # print(em.evaluateText(text)[0])
    # print(text)
    return #jsonify(em.evaluateText(text))

