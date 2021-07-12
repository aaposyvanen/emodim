import xml.etree.cElementTree as ET
from tqdm import tqdm
from datetime import datetime


"""
With this script one can parse through the s24 corpus .vrt files and extract complete paragraphs. To change the file 
to parse, just change the path variable to the correct one. 
Should not be used unless for some reason one wants to create more paragraphs from the corpus data.

The 'createAnalyzationFiles' function either creates a new dynamically named file, or uses the template one (creates 
the template if one does not already exists). THE CONTENTS OF THE TEMPLATE FILE ARE REMOVED IF THIS IS NOT COMMENTED 
OUT AND THE TEMPLATE FILE ALREADY CONTAINS SENTENCES! Dynamically created textfilenames always keep the previous 
instances of the sentence files, unlike the template file.

The 's24_parser' function parses through the s24 corpus .vrt file and extracts whole sentences from the file. All 
other data is disregarded within this script (use s24_classify.py for the metadata).

"""


path = "D:\\Work\\Data\\s24\\s24_2001.vrt"  # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24\\s24_2017.vrt"  # this file is 17Gb
# path = "..\\..\\data\\legacy\\test.vrt"


def createAnalyzationFiles():
    time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
    # uncomment these next two lines to save into 'data' folder
    # tmp = path.replace('D:\\Work\\Data\\', "..\\..\\data\\txts\\")    # used to relocate where the file is saved
    # fname = f"{tmp.replace('.vrt', f'_paragraphs_{time}.txt')}"
    # fname = f"{path.replace('.vrt', f'_paragraphs.txt')}"       # uncomment this to always overwrite the same file
    fname = f"{path.replace('.vrt', f'_paragraphs_{time}.txt')}"
    open(fname, 'w').close()
    return fname


def s24_parser(dpath):
    paragraphList = []
    paragraph = ""
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    for event, element in tqdm(context):
        # The end event of the root element is reached (very last line of file)
        if event == 'end' and element.tag == 'root':
            r.clear()   # the .vrt files are huge, clear the root often to preserve memory
            break
        elif event == 'start' and element.tag == 'text':
            paragraph = ""
            r.clear()
        # a whole new comment starts here (the title is skipped in this script)
        elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
            ev, el = next(context)
            # find where the paragraph ends and extract the text in between (one whole paragraph is a single comment)
            while el.tag != 'paragraph':
                text = ""
                if ev == 'end':
                    words = el.text.splitlines()[1:]
                    for word in words:
                        # get the first word of the string (this is what we want)
                        text += word.split('\t')[0]
                        # the third last element is if there are spaces or newlines after the word
                        w = word.split('\t')[-3]
                        # check for special characters (like space or newline or tab) after the word
                        if w == '_':
                            text += ' '    # there was a space
                        else:
                            w = w.split('=')[1]
                            if w != "No":
                                text += ' '     # there was another special character, in this script replace with space
                    paragraph += text
                ev, el = next(context)
            r.clear()
        # the end of the comment is reached, append the whole comment to file
        elif event == 'end' and element.tag == 'text':
            with open(ftxt, 'a+', encoding='utf8') as f:
                f.write(f"{paragraph}\n")
            paragraphList.append(paragraph)
            r.clear()
    return


ftxt = createAnalyzationFiles()
s24_parser(path)
