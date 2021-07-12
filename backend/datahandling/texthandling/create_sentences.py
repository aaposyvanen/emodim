import xml.etree.cElementTree as ET
from tqdm import tqdm
from datetime import datetime   # for dynamic filename generation


"""
With this script one can parse through the s24 corpus .vrt files and extract complete sentences. To change the file 
to parse, just change the path variable to the correct one. 
Should not be used unless for some reason one wants to create more sentences from the corpus data.

The 'createAnalyzationFile' function either creates a new dynamically named file, or uses the template one (creates 
the template if one does not already exists). THE CONTENTS OF THE TEMPLATE FILE ARE REMOVED IF THIS IS NOT COMMENTED 
OUT AND THE TEMPLATE FILE ALREADY CONTAINS SENTENCES! Dynamically created textfilenames always keep the previous 
instances of the sentence files, unlike the template file.

The 's24_parser' function parses through the s24 corpus .vrt file and extracts whole sentences from the file. All 
other data is disregarded within this script (use s24_classify.py for the metadata).

"""

time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
# path = f"D:\\Work\\Data\\s24\\s24_2001.vrt"  # this file is 3,5Gb
# path = f"D:\\Work\\Data\\s24\\s24_2017.vrt"  # this file is 17Gb
path = "..\\..\\data\\legacy\\test.vrt"


def createAnalyzationFile():
    fname = f"{path.replace('.vrt', f'_sentences_{time}.txt')}"   # use for dynamic filenames
    # fname = f"{path.replace('.vrt', f'_sentences.txt')}"
    open(fname, 'w').close()    # by this action, the former .txt file is emptied.
    return fname


def s24_parser(dpath):
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    with open(ftxt, 'a+', encoding='utf8') as f:
        for i, (event, element) in enumerate(tqdm(context)):
            if event == 'end' and element.tag == 'root':
                r.clear()
                break
            if event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
                ev, el = next(context)
                # find where the paragraph ends and extract the text in between, formatting the text to sentences
                while el.tag != 'paragraph':
                    text = ""
                    if ev == 'end':
                        words = el.text.splitlines()[1:]
                        for word in words:
                            # get the first word of the string (this is what we want)
                            text += word.split('\t')[0]
                            # the third last element is if there are spaces or newlines after the word
                            w = word.split('\t')[-3]
                            # there was a space
                            if w == '_':
                                text += ' '
                            else:
                                w = w.split('=')[1]
                                if w != "No":
                                    text += ' '
                        f.write(f"{text}\n")
                    ev, el = next(context)
                r.clear()
    return


ftxt = createAnalyzationFile()
s24_parser(path)
