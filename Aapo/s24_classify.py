from libvoikko import Voikko
import xml.etree.cElementTree as ET
from tqdm import tqdm
from wvlib_light import lwvlib
import emodim as em
import os

# path = "D:\\Work\\Data\\s24_2001.vrt"
# path = "D:\\Work\\Data\\s24_2017.vrt"
path = "test.vrt"
vpath = f"{os.getcwd()}\\Voikko"
Voikko.setLibrarySearchPath(vpath)
v = Voikko(u"fi", vpath)
tree = ET.parse("soderholm_normalized.xml")
root = tree.getroot()
wv = lwvlib.load("D:\\Work\\skipgram_dbs\\finnish_4B_parsebank_skgram.bin", 10000, 500000)


def evaluate_s24_data(datadict, vsum, asum, dsum):
    paragraphValues = []
    for key, item in datadict.items():
        for word in item:
            evaluate = em.word_eval(word)
            try:
                vsum += float(evaluate['rating'][0])
                asum += float(evaluate['rating'][1])
                dsum += float(evaluate['rating'][2])
            except TypeError:
                continue
            paragraphValues.append(evaluate)
    return paragraphValues, round(vsum, 3), round(asum, 3), round(dsum, 3)


def s24_parser(dpath):
    textData = {}
    paragraphData = {}
    wordlist = []
    # get an iterable
    context = ET.iterparse(dpath, events=("start", "end"))
    # turn it into an iterator
    context = iter(context)
    # get the root element
    event, r = next(context)
    # search for metadata for a text block
    vsum = asum = dsum = 0
    for event, element in context:
        if event == 'end' and element.tag == 'root':
            break
        # a new textblock starts
        if event == 'start' and element.tag == 'text':
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
                    # paragraphData[el.attrib['id']] = wordlist.copy()
                    paragraphData[element.attrib['id']].extend(wordlist.copy())
                    wordlist.clear()
                ev, el = next(context)
            r.clear()
        # do stuff to paragraphData here before it is emptied (and textData)
        elif event == 'end' and element.tag == 'text':
            pData, pvsum, pasum, pdsum = evaluate_s24_data(paragraphData, vsum, asum, dsum)
            print(pData, pvsum, pasum, pdsum)
            wordlist.clear()
            textData.clear()
            paragraphData.clear()
            r.clear()


s24_parser(path)
