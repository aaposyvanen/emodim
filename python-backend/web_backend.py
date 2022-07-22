from flask import *  # render_template
from flask_cors import CORS, cross_origin
import emodim as em
from transformers import AutoTokenizer
import numpy as np

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

@app.route('/tokenize/', methods = ['POST'])
@cross_origin(origins=["http://localhost:3000"])
def tokenize():
    tokenizer = AutoTokenizer.from_pretrained("TurkuNLP/bert-base-finnish-uncased-v1")
    t = tokenizer.batch_encode_plus(request.json["instances"], add_special_tokens=True ,return_attention_mask=True, return_token_type_ids=False, max_length=75, padding='max_length')
    encoded = [np.array(t["input_ids"]), np.array(t["attention_mask"])]
    print(encoded)
    return encoded
