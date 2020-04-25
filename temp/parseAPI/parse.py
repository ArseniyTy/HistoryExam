import json
from bs4 import BeautifulSoup as BS

def parseHist():
    try:
        with open('7-2.html','r') as file:
            html = BS(file,'html.parser')
            questions = html.select('.qtext > p')
            answers = html.select('.rightanswer')
            jsonConfig(qList=questions,aList=answers)
    except FileNotFoundError:
        pass;

def jsonConfig(qList = [], aList = [], card = '7-2'):
    exitList = []
    # Config Answers
    for i in range(0,len(qList)):
        dic = {"Card" : card, "question" : qList[i].text,
                 "answer" : aList[i].text[33:], "a_type" : ""}
        exitList.append(dic)
    # Configure JSON file
    print(exitList)
    try:
        with open('history.json', 'w') as file:
            json.dump(exitList, file,ensure_ascii=False)
    except FileNotFoundError:
        pass
# todo complete the test and this thing

if __name__ == "__main__":
    parseHist()