import json
from bs4 import BeautifulSoup as BS

def parseHist():
    try:
        with open('12-2.html','r',encoding='UTF-8') as file:
            html = BS(file,'html.parser')
            questions = html.select('.qtext > p')
            answers = html.select('.rightanswer')
            jsonConfig(qList=questions,aList=answers)
    except FileNotFoundError:
        pass

def jsonConfig(qList = [], aList = [], card = '12-2'):
    exitList = []
    # Config Answers
    for i in range(0,len(qList)):
        a_type = "1"
        question = qList[i].text
        answer = aList[i].text[18:]
        # answer.replace('/\"',' ') TODO
        #Questions filter
        if(question.find("Растаўце ў храналагічнай паслядоўнасці") > -1):
            numbers = "0123456789"
            question = answer
            a_type = "0"
            for n in numbers:
                if (question.find(n)):
                    question = question.replace(" – " + n,"")
        if(question.find("Суаднясіце  даты і падзеі:") > -1):
            question = answer
            answer = "У пытанні"
            a_type = "0"
        if (question.find("Суаднясіце тэрмін і яго вызначэнне") > -1):
            question = answer
            answer = "У пытаннi"
            a_type = "0"
        if (question.find("Вызначце невернае сцвярджэнне:") > -1):
            question = answer
            answer = "Неверно"
            a_type = "0"
        if(answer.find("Верно") > -1 or answer.find("Неверно") > -1
            or answer.find(',') > -1):
            a_type = "0"
        if(question.find("Суаднясіце") > -1):
            question = answer
            answer = "У пытаннi"
            a_type = "0"
        # Fill the dictionary
        question = question[0].upper() + question[1:]  
        dic = {"Card" : card, "question" : question,
                 "answer" : answer, "a_type" : a_type}
        exitList.append(dic)
    # Configure JSON file
    # print(exitList)
    try:
        with open('history.json', 'w', encoding='UTF-8') as file:
            json.dump(exitList, file,ensure_ascii=False)
    except FileNotFoundError:
        pass

if __name__ == "__main__":
    parseHist()