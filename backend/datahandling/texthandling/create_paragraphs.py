import xml.etree.cElementTree as ET
from tqdm import tqdm
from datetime import datetime


path = "D:\\Work\\Data\\s24_2001.vrt"  # this file is 3,5Gb
# path = "D:\\Work\\Data\\s24_2017.vrt"  # this file is 17Gb
# path = "..\\..\\data\\test.vrt"


def createAnalyzationFiles(i):
    # time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
    tmp = path.replace('D:\\Work\\Data\\', "..\\..\\data\\")
    fname = f"{tmp.replace('.vrt', f'_paragraphs_{i}.txt')}"
    open(fname, 'w').close()
    return fname


def s24_parser(dpath):
    paragraphList = []
    # get an iterable, turn it into an iterator and get the root element
    context = ET.iterparse(dpath, events=("start", "end"))
    context = iter(context)
    event, r = next(context)
    for i, (event, element) in enumerate(tqdm(context)):
        if i >= 1000:
            break
        if event == 'end' and element.tag == 'root':
            r.clear()
            break
        elif event == 'start' and element.tag == 'text':
            paragraph = ""
            r.clear()
        elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
            ev, el = next(context)
            # find where the paragraph ends and extract the text in between
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
                    paragraph += text
                ev, el = next(context)
            r.clear()
        elif event == 'end' and element.tag == 'text':
            ftxt = createAnalyzationFiles(i)
            with open(ftxt, 'a+', encoding='utf8') as f:
                f.write(f"{paragraph}\n")
            paragraphList.append(paragraph)
            r.clear()
    return


s24_parser(path)
