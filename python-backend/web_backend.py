from flask import *  # render_template
from flask_cors import CORS, cross_origin
import emodim as em
from transformers import AutoTokenizer, InputFeatures


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
@cross_origin(origins=["http://localhost:3000", "http://localhost:3010"])
def tokenize():
    tokenizer = AutoTokenizer.from_pretrained("tokenizer")
    t = tokenizer.batch_encode_plus(request.json["instances"], 
                                    add_special_tokens=True, 
                                    return_attention_mask=True, 
                                    return_token_type_ids=False, 
                                    max_length=83, padding='max_length')
    inputs = {"inputs": {"input_1": t["input_ids"], "input_2": t["attention_mask"]}}
    return json.dumps(inputs)