function ShowAnswers_AJAX(value) {
    if(value == "" || value.length <= 2){
        return
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    let request = new XMLHttpRequest();
    request.open('GET', 'temp/history.json', true);

    //onload выполняется после выполнения запроса
    request.onload = function () {
        // Convert JSON data to an object
        let questions = JSON.parse(this.response);
        //находим переданную строку value (переводим 2 строкі в нижний регистр на всякий)
        let questionsToShow = new Array();
        for(let i=0; i<questions.length; i++) {
            if(questions[i].question.toLowerCase().includes(value.toLowerCase())) {
                questionsToShow.push(questions[i]);
            }
        }
        show_answers(questionsToShow);
    }
    request.send();
}

function show_answers(questions) {
    var list = document.getElementById('answersList');
    var oldLi_s = document.getElementsByTagName('li');
    //удаляем все предыдущие ответы
    while(oldLi_s.length!=0) {
        list.removeChild(oldLi_s[0]);
    }

    //выводим все ответы из массива
    for(let i=0; i<questions.length; i++) {
        show_single_answer(questions[i]);
    }

    AddOnClicksToLiElems();
}
function show_single_answer(question) {
    var list = document.getElementById('answersList');
    var li = document.createElement('li');
    //создаём элементы, которые потом помещаем в элемент списка 
    var pAnswer = document.createElement('p');
    var pQuestion = document.createElement('p');

    pQuestion.innerHTML = "Вопрос: " + question.question;
    pAnswer.innerHTML = "Ответ : " + question.answer;

    li.appendChild(pQuestion);
    li.appendChild(pAnswer);
    list.appendChild(li);
}



function AddOnClicksToLiElems() {
    var li_elems = document.getElementById("answersList").getElementsByTagName('li');
    for(let i=0; i<li_elems.length; i++) {
        li_elems[i].onclick = function() {
            // Выборка текста параграфа внутри li элемента
            var answer = li_elems[i].getElementsByTagName('p')[1];  

            var range = document.createRange();  
            range.selectNode(answer);
            //очищаем и вставляем в буфер
            window.getSelection().removeAllRanges(); 
            window.getSelection().addRange(range);

            try {  
                // Теперь, когда мы выбрали текст ссылки, выполним команду копирования
                var successful = document.execCommand('copy');  
                var msg = successful ? 'successful' : 'unsuccessful';  
                console.log('Copy command was ' + msg);  
              } catch(err) {  
                console.log('Oops, unable to copy');  
              }  
                
              // Снятие выделения
              window.getSelection().removeRange(range);  
        }
    }
}

