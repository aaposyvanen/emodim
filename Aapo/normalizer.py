import xml.etree.cElementTree as ET


def openFile():
    found = False
    while not found:
        try:
            xml = input('Insert the name of the file to normalize (should be written as: "name_of_file.xml": ')
            tree = ET.parse(xml)
            root = tree.getroot()
            createNormalizedXML(xml, root)
            found = True
        except OSError:
            print('Error accessing file. Check file name and path and try again. File should be located in the same '
                  'folder as this script file.')


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


def createNormalizedXML(xml, root):
    newroot = ET.Element("EmotionPatterns")
    comm = "\nThis is a normalized database for the \"emotion\" classifier for the emodim project\n" \
           "Poika Isokoski 2021.\n\nData is from:\nSöderholm C, Häyry E, Laine M, Karrasch M (2013) \n" \
           "Valence and Arousal Ratings for 420 Finnish Nouns by Age and Gender. \n" \
           "PLoS ONE 8(8): e72859. https://doi.org/10.1371/journal.pone.0072859\n"
    comment = ET.Comment(comm)
    newroot.insert(0, comment)

    for elem in root:
        nv = f"{normalize(float(elem.attrib['valence']), -3, 3):.3f}"
        na = f"{normalize(float(elem.attrib['arousal']), -3, 3):.3f}"
        nd = f"{normalize(float(elem.attrib['dominance']), -3, 3):.3f}"
        elem = {"word": elem.attrib['word'], "valence": nv, "arousal": na, "dominance": nd}
        se = ET.SubElement(newroot, 'pattern', elem)
        se.tail = '\n'
    newtree = ET.ElementTree(newroot)
    with open(f'normalized_{xml}', 'wb') as f:
        newtree.write(f, encoding='UTF-8', xml_declaration=True, short_empty_elements=True)
    print(f'File created as normalized_{xml}')


openFile()
