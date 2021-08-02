import PySimpleGUI as sg

"""
With this script one can classify sentences. The .txt file that is parsed must be formatted in way of: sentence\n
so, sentence followed by a newline character. There is a GUI that pops up with buttons and the text to analyse. 
There are four buttons - Neg, Neut, Pos, Skip and Exit. To classify a sentence, click one of these buttons. 
Neg corresponds to a 'negative' review of the sentence, Neut corresponds to a 'neutral' review of the sentence and 
Pos corresponds to a 'positive' review of the sentence. With Skip, one can skip labeling a sentence (rating is too 
ambiguous and would not give good classification). The Exit button closes the application and deletes sentences from 
the text file that got rated or skipped. Exiting the application with the X (close) button also does this functionality.

The 'dataFromS24' function parses through the file containing the sentences to classify and with the GUI function 
prompts the user to classify a sentence in some way. 

The 'GUI' function operates the PySimpleGUI Graphical User Interface.
"""


path = 'data\\data.txt'


def dataFromS24(window):
    with open(path, 'r+', encoding='utf-8') as f:
        contents = f.readlines()
        with open(f"data\\neg.txt", 'a', encoding='utf-8', buffering=1) as neg:
            with open(f"data\\pos.txt", 'a', encoding='utf-8', buffering=1) as pos:
                with open(f"data\\neut.txt", 'a', encoding='utf-8', buffering=1) as neut:
                    for i, line in enumerate(contents):
                        window.Element('-ML_KEY-').Update(line)
                        event, values = window.Read()
                        print(event, line)
                        # upon pressing exit, the sentences file is rewritten with only sentences not yet rated
                        # (rated sentences are removed from the file, so huge sentence files might take time & memory)
                        if event == 'Exit' or event == sg.WIN_CLOSED:
                            lines = contents[i:]
                            fw = open(f'data\\data.txt', 'w', encoding='utf-8')
                            fw.writelines(lines)
                            fw.close(), f.close(), neg.close(), pos.close(), neut.close()
                            return
                        if event == 'Neg':
                            neg.write(line)
                        if event == 'Neut':
                            neut.write(line)
                        if event == 'Pos':
                            pos.write(line)
                        if event == 'Skip':
                            pass


def GUI():
    layout = [[sg.Text("Label this text as negative (Neg), neutral (Neut), positive (Pos) or skip (Skip): ")],
              [sg.Multiline(default_text='First line\nSecond line',
                            disabled=True,
                            auto_size_text=True,
                            key='-ML_KEY-')],
              [sg.Button('Neg'), sg.Button('Neut'), sg.Button('Pos'), sg.Button('Skip'), sg.Exit()]]
    window = sg.Window('My Application', layout, size=(640, 320), finalize=True)
    dataFromS24(window)
    window.Close()

GUI()
