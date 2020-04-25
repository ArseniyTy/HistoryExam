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
    var pQuestion = document.createElement('p');
    var pAnswer = document.createElement('p');
    var pAnswer_span = document.createElement('span');

    pQuestion.innerHTML = "Вопрос: " + question.question;
    pAnswer_span.innerHTML = question.answer;
    pAnswer.innerHTML = "Ответ : ";

    li.appendChild(pQuestion);
    pAnswer.appendChild(pAnswer_span);
    li.appendChild(pAnswer);
    list.appendChild(li);

    //в итоге такая структура
    /*<li>
        <p>Вопрос: За часы кіравання Гедыміна тэрыторыя ВКЛ павялічылася ў два разы.</p>
        <p>Ответ : <span>Неверно</span></p>
    </li>
    */ 
}





function AddOnClicksToLiElems() {
    var li_elems = document.getElementById("answersList").getElementsByTagName('li');
    for(let i=0; i<li_elems.length; i++) {
        li_elems[i].onclick = function() {
            // Выборка текста span,     внутри параграфа ответа p,     внутри li элемента
            var answer = li_elems[i].getElementsByTagName('p')[1].getElementsByTagName('span')[0];  
            
            var range = document.createRange();  
            range.selectNode(answer);
            //очищаем и вставляем в буфер
            window.getSelection().removeAllRanges(); 
            window.getSelection().addRange(range);

            try {  
                // выполним команду копирования
                document.execCommand('copy');  
                //даём этому элементу класс
                li_elems[i].classList.add('successCopy');
                //через 1.6 секунд удаляем класс
                setTimeout(function() {
                    li_elems[i].classList.remove('successCopy');
                  }, 1600);

              } catch(err) {  
                console.log('Unable to copy');  
              }  
                
              // Снятие выделения
              window.getSelection().removeRange(range);  
        }
    }
}

