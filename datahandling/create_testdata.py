import PySimpleGUI as sg
import json
import emodim as em
import os
from datetime import datetime


time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
textData = {"comment_id": "0",
            "datetime": f"{time}",
            "author": "",
            "parent_comment_id": "0",
            "thread_id": "0",
            "title": "",
            "msg_type": "thread_start"
            }
commentData = {'commentMetadata': {}, 'words': []}
threadData = {'comments': []}


def createDiscussion(window):
    with open(fr"{path}/data/jsons/discussion.json", 'w', encoding='utf-8') as f:
        f.write('[\n')
        event, values = window.Read()
        while event != 'Exit' and event != sg.WIN_CLOSED:
            print(event, values)
            if event == 'opener':
                values = values['textbox']
                window['opener'].update(disabled=True), window['username'].update(disabled=False)
                window['title'].update('', disabled=True), window['titletext'].update('')
                window['titleinput'].update('', disabled=True), window['textbox'].update('', disabled=False)
                window['comment'].update(disabled=False), window['author'].update('')
                window['titleinput'].update('', disabled=True)
                JSONvalues = em.evaluateText(values)[-1]
                commentData['words'] = JSONvalues
                commentData['commentMetadata'] = textData.copy()
                threadData['comments'].append(commentData.copy())
                # json.dump(commentData, f, indent=2, ensure_ascii=False)
                # f.write(f',\n')
            elif event == 'restart':
                window['opener'].update(disabled=False)
                f.truncate(0)
                f.write('[\n')
                textData['author'] = ""
                textData['title'] = ""
                window['author'].update(''), window['titleinput'].update('')
            elif event == 'comment':
                values = values['textbox']
                window['textbox'].update(''), window['titleinput'].update('')
                window['author'].update(''),  window['title'].update(disabled=False)
                window['username'].update(disabled=False)
                JSONvalues = em.evaluateText(values)[-1]
                commentData['words'] = JSONvalues
                commentData['commentMetadata'] = textData.copy()
                threadData['comments'].append(commentData.copy())
                # json.dump(commentData, f, indent=2, ensure_ascii=False)
                # f.write(f',\n')
            elif event == 'username':
                values = values['author']
                print(values)
                window['username'].update(disabled=True), window['title'].update(disabled=False)
                textData['author'] = values
            elif event == 'title':
                values = values['titleinput']
                window['title'].update(disabled=True),  window['opener'].update(disabled=False)
                window['textbox'].update(disabled=False)
                textData['title'] = values
            print(event, values)
            event, values = window.Read()
        json.dump(threadData, f, indent=2, ensure_ascii=False)
        f.write('\n]')


def GUI():
    sg.theme('DarkGrey9')
    layout = [[sg.Text("Insert the discussion starting paragraph. Start by inputting Username and title: ")],
              [sg.Text('Username', size=(15, 1)), sg.InputText(key='author')],
              [sg.Text('Title', size=(15, 1), key='titletext'), sg.InputText(key='titleinput')],
              [sg.Button('Save username', key='username'), sg.Button('Save title', key='title', disabled=True)],
              [sg.Multiline(size=(120, 10), key='textbox', disabled=True)],
              [sg.Button('Add an opening message', key='opener', disabled=True), sg.Button('Add a comment', key='comment', disabled=True),
               sg.Button('Exit', key='Exit'), sg.Button('I messed up, restart!', key='restart')]]
    window = sg.Window('Create discussion', layout, size=(640, 320), finalize=True)
    createDiscussion(window)
    window.Close()


GUI()
