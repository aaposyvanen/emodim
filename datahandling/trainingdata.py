import PySimpleGUI as sg


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
                        if event == 'Exit' or event == sg.WIN_CLOSED:
                            lines = contents[i:]
                            f = open(f'data\\data.txt', 'w', encoding='utf-8')
                            f.writelines(lines)
                            f.close()
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
