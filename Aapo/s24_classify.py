import json
import xml.etree.cElementTree as ET
from tqdm import tqdm
import emodim as em
import os
from datetime import datetime
import visualizer as vis


"""
The Suomi24 data can be classified with this script.
"""

# path = "D:\\Work\\Data\\s24_2001.vrt"  # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24_2017.vrt"  # this file is 17Gb
path = "test.vrt"


def createAnalyzationFiles():
    time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
    fname = f"{path.replace('.vrt', f'_classified_{time}.txt')}"
    tname = f"{path.replace('.vrt', f'_threadData_{time}.json')}"
    open(fname, 'w').close()
    open(tname, 'w').close()
    return fname, tname


def evaluate_s24_data(data, vsum, asum, dsum):
    paragraphValues = []
    JSONvalues = []
    # print(f"datadict['words]: {datadict['words']}")
    # this loop executes often < 10it/s
    for word in data:
        ev = em.word_eval(word)
        paragraphValues.append(ev)
        JSONvalues.append({'word': word, 'valence': ev['rating'][0], 'arousal': ev['rating'][1],
                           'dominance': ev['rating'][2]})
        with open(ftxt, 'a+', encoding='utf8') as f:
            f.write(f"{ev['original_text']}: {ev['rating']} \n")
        vis.createRatings(ev['original_text'], ev['rating'])
        try:
            vsum += float(ev['rating'][0])
            asum += float(ev['rating'][1])
            dsum += float(ev['rating'][2])
        # if the word that was processed had None values in the rating list
        except TypeError:
            continue
    return paragraphValues, JSONvalues,  round(vsum, 3), round(asum, 3), round(dsum, 3)


def s24_parser(dpath):
    # 2,748,069 iterations for s24 2001 dataset, around 4-10 it/s to process (around 130 hours), has to be optimized
    # the evaluate_s24_data function slows iteration down by over 75k it/s. word_eval function in emodim.py needs work.
    # Could be because the data is located in HDD not SSD. Saved JSON for the 2001 set will be around 160Gb
    threadList = []
    threadData = {'threadMetadata': {}, 'threadID': '', 'comments': []}
    commentData = {'commentMetadata': {}, 'commentID': '', 'words': []}
    textData = {}
    wordlist = []
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    vsum = asum = dsum = 0
    fix = False
    for event, element in tqdm(context):
        if event == 'end' and element.tag == 'root':
            textData = element.attrib
            commentData['commentMetadata'] = textData.copy()
            pData, JSONvalues, pvsum, pasum, pdsum = evaluate_s24_data(commentData['words'], vsum, asum, dsum)
            commentData['words'] = JSONvalues
            threadData['comments'].append(commentData.copy())
            threadList.append(threadData)
            vis.plot()
            with open(fjson, 'w', encoding='utf8') as f:
                json.dump(threadList, f, indent=2, ensure_ascii=False)
                # json.dump(threadData, f, indent=2, ensure_ascii=False)
            break
        # a new text block starts
        if event == 'start' and element.tag == 'text':
            # a new thread starts, save all of the new metadata in textData
            e = element.attrib
            textData = {'comment_id': e['comment_id'], 'datetime': e['datetime'], 'author': e['author'],
                        'parent_comment_id': e['parent_comment_id'], 'quoted_comment_id': e['quoted_comment_id'],
                        'nick_type': e['nick_type'], 'thread_id': e['thread_id'], 'title': e['title'],
                        'msg_type': e['msg_type'], 'topic_name_leaf': e['topic_name_leaf'],
                        'topic_name_top': e['topic_name_top'], 'topic_names': e['topic_names'],
                        'topic_names_set': e['topic_names_set'], 'id': e['id'], 'author_v1': e['author_v1'],
                        'author_name_type': e['author_name_type'], 'thread_start_datetime': e['thread_start_datetime'],
                        'parent_datetime': e['parent_datetime']}
            commentData['commentMetadata'] = textData.copy()
            pData, JSONvalues, pvsum, pasum, pdsum = evaluate_s24_data(commentData['words'], vsum, asum, dsum)
            commentData['words'] = JSONvalues
            threadData['comments'].append(commentData.copy())
            commentData = {'commentMetadata': {}, 'commentID': '', 'words': []}
            # process the info of the last thread
            if element.attrib['comment_id'] == "0":
                if fix is True:
                    threadList.append(threadData)
                    # with open(fjson, 'a+', encoding='utf8') as f:
                    #    json.dump(threadData, f, indent=2, ensure_ascii=False)
                threadData = {'threadMetadata': textData.copy(), 'threadID': element.attrib['thread_id'], 'comments': []}
                fix = True
            vsum = asum = dsum = 0
            # clear the root so memory management is reasonable
            r.clear()
        # a new paragraph starts (only process the "body" part, not "title")
        elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
            commentData['commentID'] = textData['id']
            ev, el = next(context)
            # find where the paragraph ends and extract the text in between
            while el.tag != 'paragraph':
                if ev == 'end':
                    words = el.text.splitlines()[1:]
                    for word in words:
                        # get the first word of the string (this is what we want)
                        wordlist.append(word.split('\t')[0])
                    commentData['words'].extend(wordlist.copy())
                    wordlist.clear()
                ev, el = next(context)
            r.clear()
        # do stuff to paragraphData here before it's emptied (and textData which contains metadata of the comment chain)
        elif event == 'end' and element.tag == 'text':
            wordlist.clear(), textData.clear(), r.clear()


ftxt, fjson = createAnalyzationFiles()
s24_parser(path)
