import xml.etree.cElementTree as ET
import pandas as pd
from datetime import datetime

"""
With this script one can normalize any excel or xml file to contain values in between -1 and 1,  given that the files 
are formatted the same way the wordlists are.

SHOULD NOT BE USED WITHOUT EDITING (SOME OF THE EXCELS ARE FORMATTED VERY POORLY). The usable and best version of the 
wordlist is 'final_wordlist.xlsx', use that. 

The 'openFile' function keeps asking the user for the correct filename until it finds a suitable file to open. 

The 'normalize' function normalizes values to fit between -1, 1 (requires the maximum and minimum values in the data).

The 'createNormalizedXML' function parses the given xml file and normalizes the values.

The 'createNormalizedExel' function parses the given excel file, normalizes the values and calculates means for 
duplicate words. The final product is saved to a .csv and a .xlsx files.
"""


time = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")


def openFile(t):
    found = False
    if t == 'xml':
        while not found:
            xml = input('Insert the name of the file to normalize (should be written as: "name_of_file.xml"): ')
            try:
                createNormalizedXML(f"..\\..\\data\\legacy\\{xml}")
                found = True
            except OSError as e:
                print(f"Error: {e}")
                print('Error accessing file. Check file name and path and try again. File should be located in the '
                      '"data" folder.')
                continue
    elif t == 'excel':
        while not found:
            excel = input('Insert the name of the file to normalize (should be written as: '
                          '"name_of_file.xlsx"): ')
            try:
                import os
                path = f"{os.path.abspath(os.path.join(os.path.split(os.path.dirname(os.path.abspath(__file__)))[0], os.pardir))}\\data\\xlsxs\\"
                createNormalizedExel(path, excel)
                found = True
            except OSError as e:
                print(f'Error: {e}')
                print('Error accessing file. Check file name and path and try again. File should be located in the '
                      '"data" folder.')
                continue
    else:
        filetype = input('Incorrect format. Type "xml" or "excel": ')
        openFile(filetype)
    return


def normalize(value, minimum, maximum):
    normalized = 2 * ((value - minimum) / (maximum - minimum)) - 1
    return normalized


def createNormalizedXML(xml):
    tree = ET.parse(xml)
    root = tree.getroot()
    newroot = ET.Element("EmotionPatterns")
    comm = "\nThis is a normalized database for the \"emotion\" classifier for the emodim project\n" \
           "Poika Isokoski 2021.\n\nData is from:\nSöderholm C, Häyry E, Laine M, Karrasch M (2013) \n" \
           "Valence and Arousal Ratings for 420 Finnish Nouns by Age and Gender. \n" \
           "PLoS ONE 8(8): e72859. https://doi.org/10.1371/journal.pone.0072859\n"
    comment = ET.Comment(comm)
    newroot.insert(0, comment)

    for elem in root:
        newelem = {"word": elem.attrib['word'], "valence": f"{normalize(float(elem.attrib['valence']), -3, 3):.3f}",
                   "arousal": f"{normalize(float(elem.attrib['arousal']), -3, 3):.3f}",
                   "dominance": f"{normalize(float(elem.attrib['dominance']), -3, 3):.3f}"}
        se = ET.SubElement(newroot, 'pattern', newelem)
        se.tail = '\n'
    newtree = ET.ElementTree(newroot)
    with open(f"{xml.replace('.xml', '')}_normalized_{time}.xml", 'wb') as f:
        newtree.write(f, encoding='UTF-8', xml_declaration=True, short_empty_elements=True)
    print(f"File created as {xml.replace('.xml', '')}_normalized_{time}.xml")
    return


def createNormalizedExel(path, filename):
    input(f"{path}{filename}")
    df = pd.read_excel(f"{path}{filename}", sheet_name='Sheet1', usecols=lambda x: 'Unnamed' not in x)
    for i, row in df.iterrows():
        df.at[i, 'Valence'] = round(normalize(df.at[i, 'Valence'], 0, 1), 3)
        df.at[i, 'Arousal'] = round(normalize(df.at[i, 'Arousal'], 0, 1), 3)
        df.at[i, 'Dominance'] = round(normalize(df.at[i, 'Dominance'], 0, 1), 3)
    dfn = df.groupby("Finnish-fi").mean().round(3).reset_index()
    dfn['Finnish-fi'] = dfn['Finnish-fi'].str.lower()
    dfn = dfn.sort_values('Finnish-fi')
    dfn.to_excel(f"{path}final_wordlist.xlsx", index=False, encoding='utf-8')
    df.to_csv(f"{path}bigList_normalized_{time}.csv", index=False, sep=',', encoding='utf-8')
    return


def main():
    t = str.lower(input('Xml or excel? '))
    openFile(t)


main()
