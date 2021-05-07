import xml.etree.cElementTree as ET

# path = "D:\\Work\\Data\\s24_2001.vrt"

textData = {}
paragraphData = {}
wordlist = []
path = "test.vrt"
# get an iterable
context = ET.iterparse(path, events=("start", "end"))
# turn it into an iterator
context = iter(context)
# get the root element
event, root = next(context)
# search for metadata for a text block
for event, element in context:
    # a new textblock starts
    if event == 'start' and element.tag == 'text':
        # save all of the metadata in textData
        textData = element.attrib
        # clear the root so memory management is reasonable
        root.clear()
        # a new paragraph starts
    elif event == 'start' and element.tag == 'paragraph' and element.attrib['type'] == 'body':
        ev, el = next(context)
        # find where the paragraph ends and extract the text in between
        while el.tag != 'paragraph':
            if ev == 'end':
                words = el.text.splitlines()[1:]
                for word in words:
                    wordlist.append(word.split('\t')[0])
                paragraphData[el.attrib['id']] = wordlist
            ev, el = next(context)
        if ev == 'end':
            # wordlist = wordlist.splitlines()[1:]
            print(len(paragraphData), paragraphData)
        root.clear()
