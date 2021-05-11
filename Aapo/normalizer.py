import xml.etree.cElementTree as ET
tree = ET.parse('soderholm_et_al.xml')
root = tree.getroot()


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


newroot = ET.Element("EmotionPatterns")
comm = "\nThis is a database for the \"emotion\" classifier for the emodim project\nPoika Isokoski 2020.\n\n" \
          "Data is from:\nSöderholm C, Häyry E, Laine M, Karrasch M (2013) \n" \
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
with open('soderholm_normalized.xml', 'wb') as f:
    newtree.write(f, encoding='UTF-8', xml_declaration=True, short_empty_elements=True)
