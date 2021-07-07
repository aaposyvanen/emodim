import json
import xml.etree.cElementTree as ET
from tqdm import tqdm
import emodim as em
import os
from datetime import datetime
import visualizer as vis
import sys


"""
The Suomi24 data can be classified with this script.
"""

path = "D:\\Work\\Data\\s24_2001.vrt"  # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24_2017.vrt"  # this file is 17Gb
# path = "..\\data\\test.vrt"


def createAnalyzationFiles():
    time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
    fname = f"{path.replace('.vrt', f'_classified_{time}.txt')}"
    tname = f"{path.replace('.vrt', f'_threadData_{time}.json')}"
    open(fname, 'w').close()
    open(tname, 'w').close()
    return fname, tname


def s24_parser(dpath):
    # 2,748,069 iterations for s24 2001 dataset, around 4-10 it/s to process (around 130 hours), has to be optimized
    # the evaluate_s24_data function slows iteration down by over 75k it/s. word_eval function in emodim.py needs work.
    # Could be because the data is located in HDD not SSD. Saved JSON for the 2001 set will be around 160Gb
    # threadList = []
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
        for event, element in tqdm(context):
            if event == 'end' and element.tag == 'root':
                # threadList.append(threadData)
                # vis.plot()
                # with open(fjson, 'w', encoding='utf8') as f:
                    #  json.dump(threadList, f, indent=2, ensure_ascii=False)
                json.dump(threadData, f, indent=2, ensure_ascii=False)
                r.clear()
                sys.exit()
            # a new text block starts
            elif event == 'start' and element.tag == 'text':
                # a new thread OR COMMENT starts, save all of the new metadata in textData
                e = element.attrib
                textData = {'comment_id': e['comment_id'], 'datetime': e['datetime'], 'author': e['author'],
                            'parent_comment_id': e['parent_comment_id'], 'quoted_comment_id': e['quoted_comment_id'],
                            'thread_id': e['thread_id'], 'msg_type': e['msg_type'], 'id': e['id']
                            }
                # a new thread starts
                if element.attrib['comment_id'] == "0":
                    if fix:
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
                ftxt = ''
                JSONvalues = em.evaluate_s24_data(commentData['words'], ftxt)
                commentData['words'] = JSONvalues
                threadData['comments'].append(commentData.copy())
                wordlist.clear(), textData.clear(), r.clear()


ftxt, fjson = createAnalyzationFiles()
s24_parser(path)
