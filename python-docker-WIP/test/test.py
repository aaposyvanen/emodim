import libvoikko
from flask import Flask


path = "voikko"
libvoikko.Voikko.setLibrarySearchPath(path)
v = libvoikko.Voikko(u"fi", path)

inp = "Lause jossa on sanoja"

print(v.analyze(inp))

app = Flask(__name__)


@app.route('/')
def hello_world():
    return inp + "toimii"
