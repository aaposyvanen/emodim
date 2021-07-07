import xml.etree.cElementTree as ET
import pandas as pd
import emodim as em
import libvoikko
from datetime import datetime


time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
v = libvoikko.Voikko(u"fi", "Voikko")


def openFile(t):
    found = False
    if t == 'xml':
        while not found:
            try:
                xml = input('Insert the name of the file to normalize (should be written as: "name_of_file.xml": ')
                tree = ET.parse(xml)
                root = tree.getroot()
                found = True
                createNormalizedXML(f"..\\data\\{xml}", root)
            except OSError:
                print('Error accessing file. Check file name and path and try again. File should be located in the '
                      'data folder.')
    elif t == 'excel':
        while not found:
            try:
                excel = input('Insert the name of the file to normalize (should be written as: '
                              '"SaifMohammad_NRC_Valence_Arousal_Dominance_Lexicon.xlsx": ')
                found = True
                createNormalizedExel(f"..\\data\\{excel}")
            except OSError:
                print('Error accessing file. Check file name and path and try again. File should be located in the '
                      'data folder.')
    else:
        filetype = input('Incorrect format. Type "xml" or "excel": ')
        openFile(filetype)


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
    with open(f'..\\data\\normalized_{xml}', 'wb') as f:
        newtree.write(f, encoding='UTF-8', xml_declaration=True, short_empty_elements=True)
    print(f'File created as normalized_{xml}')
    return


def createNormalizedExel(filename):
    df = pd.read_excel(filename, skiprows=5, sheet_name='Sheet5')
    for i, row in df.iterrows():
        df.at[i, 'Finnish-bf'] = em.find_baseform(df.at[i, 'Finnish-fi'], v)
        df.at[i, 'Valence'] = round(normalize(df.at[i, 'Valence'], 0, 1), 3)
        df.at[i, 'Arousal'] = round(normalize(df.at[i, 'Arousal'], 0, 1), 3)
        df.at[i, 'Dominance'] = round(normalize(df.at[i, 'Dominance'], 0, 1), 3)
    df.to_excel(f'..\\data\\bigList_normalized_{time}.xlsx', index=False, encoding='utf-8')
    df.to_csv(f'..\\data\\bigList_normalized_{time}.csv', index=False, sep=',', encoding='utf-8')


def main():
    t = str.lower(input('Xml or excel? '))
    openFile(t)


main()
