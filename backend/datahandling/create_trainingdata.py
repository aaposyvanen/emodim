import PySimpleGUI as sg

# path = f"D:\\Work\\Data\\s24_2017_sentences_31-05-2021_15-17-17.txt"
path = f"..\\data\\test_sentences_31-05-2021_15-06-45.txt"


def dataFromS24(window):
    with open(path, 'r+', encoding='utf-8') as f:
        contents = f.readlines()
        with open(f"..\\data\\tr\\neg.txt", 'a', encoding='utf-8', buffering=1) as neg:
            with open(f"..\\data\\tr\\pos.txt", 'a', encoding='utf-8', buffering=1) as pos:
                with open(f"..\\data\\tr\\neut.txt", 'a', encoding='utf-8', buffering=1) as neut:
                    for i, line in enumerate(contents):
                        window.Element('-ML_KEY-').Update(line)
                        event, values = window.Read()
                        print(event, line)
                        if event == 'Exit':
                            lines = contents[i:]
                            fw = open(path, 'w', encoding='utf-8')
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


def dataFromFinnsentiment():
    with open("D:\\Work\\Data\\finsen-src\\FinnSentiment2020.tsv", 'r', encoding='utf-8') as f:
        with open(f"..\\data\\tr\\negativesentences.txt", 'w', encoding='utf-8') as neg:
            with open(f"..\\data\\tr\\positivesentences.txt", 'w', encoding='utf-8') as pos:
                with open(f"..\\data\\tr\\neutralsentences.txt", 'w', encoding='utf-8') as neut:
                    lines = f.readlines()
                    for line in lines:
                        l = line.split('\t')
                        if int(l[3]) == -1:
                            neg.write(l[-1])
                        elif int(l[3]) == 1:
                            pos.write(l[-1])
                        else:
                            neut.write(l[-1])
                    f.close(), neg.close(), neut.close(), pos.close()
    return


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


# dataFromFinnsentiment()
# dataFromS24()
# GUI()
