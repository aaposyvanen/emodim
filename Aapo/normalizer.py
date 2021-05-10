from lxml import etree

tree = etree.parse('soderholm_et_al.xml')
root = tree.getroot()


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized

newroot = etree.Element("EmotionPatterns")

for elem in root:
    nv = f"{normalize(float(elem.attrib['valence']), -3, 3):.2f}"
    na = f"{normalize(float(elem.attrib['arousal']), -3, 3):.2f}"
    nd = f"{normalize(float(elem.attrib['dominance']), -3, 3):.2f}"
    newelem = {'word': elem.attrib['word'], 'valence': nv, 'arousal': na, 'dominance': nd}
    print(newelem)
    etree.SubElement(newroot, 'pattern').text = f"word=\"{elem.attrib['word']}\" valence= \"{nv}\" arousal= \"{na}\" dominance=\"{nd}\""

newtree = etree.ElementTree(newroot)
newtree.write("soderholm_normalized.xml", pretty_print=True)
