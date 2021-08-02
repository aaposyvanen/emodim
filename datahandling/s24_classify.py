import json
import xml.etree.cElementTree as ET
from tqdm import tqdm
import emodim as em
from datetime import datetime
import sys

"""
The Suomi24 data can be classified with this script. Somewhat redundant after discovering the script by Sampo Pyysalo: 
https://github.com/spyysalo/suomi24-corpus/blob/master/convert_vrt.py

Can still be used to extract .json data for the forum-simulator front-end in the Emodim project.
The 's24_parser' script parses through the suomi24 .vrt corpus file, extracts relevant metadata and comments. Since the 
.vrt architecture is very similiar to a .xml file, it can be parsed with xml itertools. Though, A ROOT ELEMENT MUST BE 
ADDED TO THE .vrt FILE PRIOR TO PARSING!! So, the block which is to be parsed through, must be wrapped with 
    <root>
    X amount of threads
    </root>
elements. 

The .json file is built in to the 'threadData' dict, which is dumped into .json after executing the script. 
NOTE: If the code doesn't exit via the 'root' exit condition, the structure of the .json is compromised and must be 
adjusted by hand (if, for example, parsing through the 17Gb .vrt and the script is terminated). If a </root> is 
added in to the correct spot in the .vrt and the script is let finish, there .json is the correct structure. The 
</root> is to be added after the last </text> element of the last comment of a thread to get the threads before.
"""

# path = "D:\\Work\\Data\\s24_2001.vrt"  # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24_2017.vrt"  # this file is 17Gb
path = "..\\data\\others\\test.vrt"


def createAnalyzationFiles():
    fname = ''
    time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
    # fname = f"{path.replace('.vrt', f'_classified_{time}.txt')}"  # uncomment if ratings for words is wanted in a .txt
    tname = f"{path.replace('.vrt', f'_threadData_{time}.json')}"
    # open(fname, 'w').close()  # uncomment if ratings for words is wanted in a .txt
    open(tname, 'w').close()
    return fname, tname


def s24_parser(dpath):
    threadData = {'threadMetadata': {}, 'threadID': '', 'comments': []}
    commentData = {'commentMetadata': {}, 'words': []}
    textData = {}
    wordlist = []
    text = ""
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    fix = False
    with open(fjson, 'a', encoding='utf8') as f:
        f.write('[\n')
        for event, element in tqdm(context):    # parse the .vrt file
            if event == 'end' and element.tag == 'root':    # end element reached
                json.dump(threadData, f, indent=2, ensure_ascii=False)
                f.write('\n]')
                r.clear()
            elif event == 'start' and element.tag == 'text':    # a new text block starts
                # a new thread OR COMMENT starts, save all of the new metadata in textData
                e = element.attrib
                textData = {'comment_id': e['comment_id'], 'datetime': e['datetime'], 'author': e['author'],
                            'parent_comment_id': e['parent_comment_id'], 'quoted_comment_id': e['quoted_comment_id'],
                            'thread_id': e['thread_id'], 'msg_type': e['msg_type'], 'id': e['id']
                            }
                if element.attrib['comment_id'] == "0":  # a new thread starts
                    if fix:     # this condition is needed to add the threads in the correct order
                        # threadList.append(threadData)
                        json.dump(threadData, f, indent=2, ensure_ascii=False)
                        f.write(f',\n')
                    threadData = {'threadMetadata': textData.copy(), 'threadID': element.attrib['thread_id'],
                                  'comments': []}
                commentData = {'commentMetadata': textData.copy(), 'words': []}
                fix = True
                # clear the root so memory management is reasonable
                r.clear()
            # a new paragraph starts (the "body" part)
            elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
                ev, el = next(context)
                # find where the paragraph ends and extract the text in between
                while el.tag != 'paragraph':
                    if ev == 'end':
                        words = el.text.splitlines()[1:]
                        for word in words:
                            # get the first word of the string (this is what we want)
                            text += word.split('\t')[0]
                            wordlist.append(word.split('\t')[0])
                            # the third last element is if there are spaces or newlines after the word
                            w = word.split('\t')[-3]
                            # there was a space
                            if w == '_':
                                text += ' '
                                wordlist.append(' ')
                            else:
                                w = w.split('=')[1]
                                if w != "No":
                                    text += w
                                    wordlist.append(w)
                        commentData['words'].extend(wordlist.copy())
                        wordlist.clear()
                    ev, el = next(context)
                r.clear()
            elif event == 'end' and element.tag == 'text':
                # ftxt = ''   # uncomment if you want to write a .txt containing ratings for each word (kind of useless)
                JSONvalues = em.evaluateS24Data(commentData['words'], ftxt)
                commentData['words'] = JSONvalues
                threadData['comments'].append(commentData.copy())
                wordlist.clear(), textData.clear(), r.clear()


ftxt, fjson = createAnalyzationFiles()
s24_parser(path)
sys.exit()
