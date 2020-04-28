function ShowAnswers_AJAX(value) {
    if(value == "" || value.length <= 2){
        return
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    let request = new XMLHttpRequest();
    request.open('GET', 'temp/data.json', true);

    //onload выполняется после выполнения запроса
    request.onload = function () {
        // Convert JSON data to an object
        let questions = JSON.parse(this.response);
        //находим переданную строку value (переводим 2 строкі в нижний регистр на всякий)
        let questionsToShow = new Array();
        
        if(value == "ShowAll") {
            questionsToShow = questions;
        } else { 
            for(let i=0; i<questions.length; i++) {
                if(questions[i].question.toLowerCase().includes(value.toLowerCase())) {
                    questionsToShow.push(questions[i]);
                }
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

    AddOnClicksToLiElems(questions);
}
function show_single_answer(question) {
    var list = document.getElementById('answersList');
    var li = document.createElement('li');
    //создаём элементы, которые потом помещаем в элемент списка 
    var pQuestion = document.createElement('p');
    var pAnswer = document.createElement('p');
    var pAnswer_span = document.createElement('span');

    pQuestion.innerHTML = "Пытанне: " + question.question;
    pAnswer_span.innerHTML = question.answer;
    pAnswer.innerHTML = "Адказ: ";

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





function AddOnClicksToLiElems(questions) {
    var li_elems = document.getElementById("answersList").getElementsByTagName('li');
    for(let i=0; i<li_elems.length; i++) {
        //функція копірованія возможно только для білетов с a_type = 1        
        if(questions[i].a_type == '1') {
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
                    
                    //создаём параграф (текст позади li элемента) внутрі li
                    var pAlert = document.createElement('p');
                    pAlert.textContent = "COPIED";
                    pAlert.classList.add('behindElement');
                    li_elems[i].appendChild(pAlert);
                    //через 1.6 секунд удаляем класс
                    setTimeout(function() {
                        li_elems[i].classList.remove('successCopy');
                        li_elems[i].removeChild(pAlert);
                      }, 1600);
    
                  } catch(err) {  
                    console.log('Unable to copy');  
                  }  
                    
                  // Снятие выделения
                  window.getSelection().removeRange(range);  
            }
        }
    }
}

