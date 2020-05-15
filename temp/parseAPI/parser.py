import json
from bs4 import BeautifulSoup as BS

def parseHist():
     # UTF-8 can be a problem : - (
     with open('temp/13_1.html','r',encoding='UTF-8') as file:
        html = BS(file,'html.parser')
        jsonConfig(html, card='13-1')

def jsonConfig(html, card = "1-1"):
    # Actual Parse
    amount = len(html.select('.state'))
    qNum = [f"q{value}" for value in range(1,amount + 1)]
    qList = []
    aList = []
    type_list = []
    for q in qNum:
        qQue = html.find('div',{"id" : f'{q}'})
        state = qQue.find('div',{'class' : 'state'}).text
        # Question
        question = qQue.find('div', {'class': 'qtext'}).find('p').text
        # Answer
        answers = qQue.find_all('div', {'class' : 'answer'})
        tanswers = qQue.find_all('table', {'class': 'answer'})
        if(len(answers) > 0 or len(tanswers) > 0):
            if(len(answers) > 0):
                answer = getAnswerType_1(answers, state=state)
                qList.append(question)
                aList.append(answer)
                type_list.append("0")
            else:
                qa = getAnswerType_2(tanswers, state=state)
                aList.append(qa['answer'])
                qList.append(qa['question'])
                type_list.append("0")
        else:
            answer = getAnswerType_3(qQue, state=state)
            question = question.replace(' -- Ответ', ' ')
            qList.append(question)
            aList.append(answer)
            type_list.append("1")
    exitList = []
    # Config Answers
    for i in range(0,len(qList)):
        # Fill the dictionary
        question = qList[i]
        answer = aList[i]
        a_type = type_list[i]
        dic = {"Card" : card, "question" : question,
                 "answer" : answer, "a_type" : a_type}
        exitList.append(dic)
    # Configure JSON file
    try:
        with open('main.json', 'w', encoding='UTF-8') as file:
            json.dump(exitList, file,ensure_ascii=False)
    except FileNotFoundError:
        pass
# Type 1
def getAnswerType_1(answers, state = "Верно"):
    exitanswer = ""
    if (state == "Верно"):
        for answer in answers:
            crr_answS0 = answer.find_all('div', {'class': 'r0 correct'})
            crr_answS1 = answer.find_all('div', {'class': 'r1 correct'})
            # Type 1
            if (len(crr_answS0) > 0):
                for crr_answ in crr_answS0:
                    exitanswer += f"{crr_answ.find('label').text}; "
            if (len(crr_answS1) > 0):
                for crr_answ in crr_answS1:
                    exitanswer += f"{crr_answ.find('label').text}; "
        exitanswer = exitanswer[:-2]
    if (state == "Частично правильный"):
        for answer in answers:
            crr_answS0 = answer.find_all('div', {'class': 'r0 correct'})
            crr_answS1 = answer.find_all('div', {'class': 'r1 correct'})
            if (len(crr_answS0) > 0):
                for crr_answ in crr_answS0:
                    exitanswer += f"{crr_answ.find('label').text[3:]}; "
            if (len(crr_answS1) > 0):
                for crr_answ in crr_answS1:
                    exitanswer += f"{crr_answ.find('label').text[3:]}; "
        exitanswer = f'{exitanswer[:-2]} + INFO'
    if (state == "Неверно" or state == "Нет ответа"):
        exitanswer = "+ INFO"
    return exitanswer
# Type 2
def getAnswerType_2(answers, state = "Верно"):
    exitanswer = ""
    exitquestion = ""
    # Form the question
    questions = answers[0].find('tbody').find_all('td', {'class' : 'text'})
    for q in questions:
        exitquestion += f'{q.text}; '
    # end of forming
    if (state == "Верно"):
        for answer in answers:
            tr_r0 = answer.find_all('tr', {'class': 'r0'})
            tr_r1 = answer.find_all('tr', {'class': 'r1'})
            if (len(tr_r0) > 0):
                for r0 in tr_r0:
                    exitanswer += f"{r0.find('td', {'class': 'text'}).find('p').text[:-1]} - " \
                                    f"{r0.find('option', {'selected': 'selected'}).text};"
            if (len(tr_r1) > 0):
                for r1 in tr_r1:
                    exitanswer += f"{r1.find('td', {'class': 'text'}).find('p').text[:-1]} - " \
                                    f"{r1.find('option', {'selected': 'selected'}).text};"
    if(state == "Частично правильный"):
        for answer in answers:
            tr_r0 = answer.find_all('tr', {'class': 'r0'})
            tr_r1 = answer.find_all('tr', {'class': 'r1'})
            if (len(tr_r0) > 0):
                for r0 in tr_r0:
                    if (len(r0.find_all('td', {'class': 'control correct'})) > 0):
                        exitanswer += f"{r0.find('td', {'class' : 'text'}).find('p').text[:-1]} - " \
                                f"{r0.find('option', {'selected': 'selected'}).text};"
                    else:
                        exitanswer += f"{r0.find('td', {'class' : 'text'}).find('p').text[:-1]} - INFO;"
            if (len(tr_r1) > 0):
                for r1 in tr_r1:
                    if (len(r1.find_all('td', {'class': 'control correct'})) > 0):
                        exitanswer += f"{r1.find('td', {'class' : 'text'}).find('p').text[:-1]} - " \
                                    f"{r1.find('option', {'selected': 'selected'}).text};"
                    else:
                        exitanswer += f"{r1.find('td', {'class' : 'text'}).find('p').text[:-1]} - INFO;"
    if (state == "Неверно" or state == "Нет ответа"):
        exitanswer += "+ INFO"
    return {'question' : exitquestion[:-2], 'answer' : exitanswer}
# Type 3
def getAnswerType_3(i, state = "Верно"):
    exitanswer = ""
    if(state == "Верно"):
        mid_answ = i.find('div',{'class':'qtext'}).find_all('input')
        if(len(mid_answ) == 0):
            exitanswer += i.find('div',{'class':'ablock'}).find('input')['value']
        else:
            exitanswer += mid_answ[0]['value']
    if (state == "Неверно" or state == "Нет ответа"):
        exitanswer += "+ INFO"
    return exitanswer

# BOOOOOST MATHERFUCKA
if __name__ == "__main__":
    parseHist()