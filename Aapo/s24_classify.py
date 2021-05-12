import json
import xml.etree.cElementTree as ET
from tqdm import tqdm
import emodim as em
import os

"""
The Suomi24 data can be classified 
"""

# path = "D:\\Work\\Data\\s24_2001.vrt" # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24_2017.vrt" # this file is 17Gb
path = "test.vrt"


def evaluate_s24_data(datadict, vsum, asum, dsum):
    paragraphValues = []
    # this loop executes often < 10it/s
    for key, item in datadict.items():
        for word in item:
            evaluate = em.word_eval(word)
            paragraphValues.append(evaluate)
            # with open(f"{path.replace('.vrt', '_classified.txt')}", 'a', encoding='utf8') as f:
            #   f.write(f"{evaluate['original_text']}: {evaluate['rating']} \n")
            try:
                vsum += float(evaluate['rating'][0])
                asum += float(evaluate['rating'][1])
                dsum += float(evaluate['rating'][2])
            except TypeError:
                continue
    return paragraphValues, round(vsum, 3), round(asum, 3), round(dsum, 3)


def s24_parser(dpath):
    # 2,748,069 iterations for s24 2001 dataset, around 4-10 it/s to process (around 130 hours), has to be optimized
    # the evaluate_s24_data function slows iteration down by over 75k it/s. word_eval function in emodim.py needs work.
    # Could be because the data is located in HDD not SSD
    threadData = {}
    textData = {}
    paragraphData = {}
    wordlist = []
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    vsum = asum = dsum = 0
    for event, element in tqdm(context):
        if event == 'end' and element.tag == 'root':
            break
        # a new textblock starts
        if event == 'start' and element.tag == 'text':
            if element.attrib['comment_id'] == "0":
                threadData[element.attrib['thread_id']] = []
            vsum = asum = dsum = 0
            # save all of the metadata in textData
            textData = element.attrib
            # clear the root so memory management is reasonable
            r.clear()
        # a new paragraph starts (only process the "body" part, not "title")
        elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
            paragraphData[element.attrib['id']] = []
            ev, el = next(context)
            # find where the paragraph ends and extract the text in between
            while el.tag != 'paragraph':
                if ev == 'end':
                    words = el.text.splitlines()[1:]
                    for word in words:
                        # get the first word of the string (this is what we want)
                        wordlist.append(word.split('\t')[0])
                    paragraphData[element.attrib['id']].extend(wordlist.copy())
                    wordlist.clear()
                ev, el = next(context)
            r.clear()
        # do stuff to paragraphData here before it is emptied (and textData which contains metadata of the commentchain)
        elif event == 'end' and element.tag == 'text':
            pData, pvsum, pasum, pdsum = evaluate_s24_data(paragraphData, vsum, asum, dsum)
            threadData[textData['thread_id']].append(pData)
            # print(pData, pvsum, pasum, pdsum)
            wordlist.clear()
            textData.clear()
            paragraphData.clear()
            r.clear()
    """ uncomment to save everything to a json file
     with open(f"{path.replace('.vrt', '_threadData.json')}", 'w', encoding='utf8') as f:
       json.dump(threadData, f, indent=2, ensure_ascii=False)
     threadData.clear() """


s24_parser(path)
