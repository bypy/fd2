"use strict";

(function(){
    var formId = formDescrFromBack.id || document.forms[0].id;
    var formElem = document.getElementById(formId);
    formElem.addEventListener("submit", validateForm);
    formElem.addEventListener("focusout", checkField);

    // конкретизируем сообщение об ошибке для каждого поля
    var errors = { team: "Укажите разработчиков сайта", sitename: "Укажите название сайта",
        siteurl: "Укажите адрес сайта в сети", launchdate: "Укажите дату запуска сайта", 
        visitors: "Укажите среднесуточное число посетителей", email: "Укажите e-mail для связи",
        division: "Выберите рубрику каталога", payment: "Выберите тип размещения",
        votes: "Вы должны разрешить отзывы", description: "Введите описание сайта" };

    function checkField(EO) {
        // обработчик события потери фокуса полем
        EO = EO || window.event;
        var target = ( EO.srcElement ) ? EO.srcElement : EO.target;
        var parent;
        do {
            parent = target.parentNode;
        } while (parent.tagName !== "P"); // все блоки формы заключены в тэг абзаца
        isEmptyTextField(parent, target, errors[target.name]);
    }

    function isEmptyTextField(parNode, inpTag, errText) {
        // сперва убрать сообщение об ошибке (подглядел на learnjavascript.ru),
        // затем проверить. Вернуть буль.
        hideErrorSpan(parNode, inpTag);
        if ( inpTag.value.trim() === "" &&
            (inpTag.type === "text" || inpTag.tagName === "TEXTAREA") ) {
            errText = errText || "Внимание! Поле не заполнено!";
            showErrorSpan(parNode, inpTag, errText);
            // для input и textarea подкрасим рамочку
            inpTag.classList.add("warnborder");
            return false;
        }
        return true;
    }

    function hideErrorSpan(parNode, inpTag) {
        var removing = parNode.getElementsByClassName("warning")[0];
        if ( removing ) {
            parNode.removeChild(removing);
            inpTag.classList.remove("warnborder");
        }
    }

    function showErrorSpan(parNode, inpTag, errText) {
        var textSpan = document.createElement("span");
        textSpan.textContent = errText;
        textSpan.classList
            .add("warning", "animated", "shake", "absolute"/* right: 5000 px; */);
        // смена цвета границы поля с ошибкой
        //inpTag.classList.add("warnborder");
        parNode.appendChild(textSpan);
        // оцениваем размер span и места рядом с полем воода
        var availWidth = (parNode.offsetLeft + parNode.offsetWidth) -
            ( inpTag.offsetLeft + inpTag.offsetWidth );
        var fullSpanWidth = parseInt(window.getComputedStyle(textSpan).
            getPropertyValue("margin-left")) + textSpan.offsetWidth;
        if ( availWidth < fullSpanWidth ) {
            textSpan.style.cssText = "display: block; margin: 4px 0px 0px " +
                (inpTag.offsetLeft - parNode.offsetLeft) + "px ;";
        }
        textSpan.classList.remove("absolute");
    }

    // форматирует переданную дату-время в формате дд.мм.гггг чч:мм:сс
    function formatDateTime() {
        var year=this.getFullYear();
        var month=this.getMonth()+1;
        var day=this.getDate();
        var hours=this.getHours();
        var minutes=this.getMinutes();
        var seconds=this.getSeconds();
        return str0l(day,2) + "." + str0l(month,2) + "." + year + " " + str0l(hours,2) + ":" + str0l(minutes,2) + ":" + str0l(seconds,2);
    }

    // дополняет строку Val слева нулями до длины Len
    function str0l(val,len) {
        var strVal=val.toString();
        while ( strVal.length < len )
            strVal="0"+strVal;
        return strVal;
    }

    // меняет "шкурку формы" при заполнении всех полей
    function swapTheme(form) {
        var classes = form.classList;
        if ( classes.contains("dynform--grey") ) {
            var current = "dynform--grey";
            var target = "dynform--pink";
        }
        form.classList.remove(current);
        form.classList.add(target);
    }

    function validateForm(EO) {
        EO = EO || window.event;
        var formElem = this;
        var formParts = formElem.elements;
        
        var errorText,
            isValid;
        
        var division = formParts.division,
            votes = formParts.votes,
            launchdate = formParts.launchdate,
            email = formParts.email,
            visitors = formParts.visitors,
            visitorsValue = parseInt(visitors.value.trim()),
            payment = formParts.payment;

        // для нацеливания на контейнер радиокнопок
        var paymentParent = formElem.getElementsByClassName("radio-lead")[0].parentNode;
        var paymentValue;
        // выбираем отмеченную радиокнопку и её значение сохраняем
        Array.prototype.forEach.call(payment, function(item){
            if ( item.checked ) paymentValue = parseInt(item.value);
        });

        var faultFields = []; // массив ссылок на поля с ошибками

        try {
            // валидация всех текстовых полей (input type="text" и textarea)
            // на предмет непустого содержания 
            var validationResults = []; // массив для записи результатов
            Array.prototype.forEach.call(formParts, function(elem){
                // текст ошибки выбирается из хэша по атрибуту name текущего элемента
                errorText = errors[elem.name];
                validationResults.push(
                    isEmptyTextField(elem.parentNode, elem, errorText) // true or false
                );
            });
            // получим номер первого пустого текстового поля
            var faultItemNumber = validationResults.indexOf(false);
            if ( faultItemNumber > -1 ) { // есть невалидное поле
                faultFields.push(formParts[faultItemNumber]);
                EO.preventDefault();
            }

            // валидация комбика
            if ( division.value === "") {
                errorText = errors.division;
                showErrorSpan(division.parentNode, division, errorText);
                faultFields.push(division);
                EO.preventDefault();
            }

            // валидация радиокнопок
            var validRadios = Array.prototype.some.call(payment, function(elem){
                return elem.checked; // какой-то должен быть отмечен
            });
            if ( !validRadios ) {
                errorText = errors.payment;
                showErrorSpan(paymentParent, payment[0], errorText);
                faultFields.push(paymentParent);
                EO.preventDefault();
            }

            // валидация чекбокса
            if ( !votes.checked ) {
                errorText = errors.votes;
                showErrorSpan(votes.parentNode, votes, errorText);
                faultFields.push(votes);
                EO.preventDefault();
            }
            
            // установка фокуса на первое поле с ошибкой
            
            if ( faultFields.length > 0) {
                // textarea может попасть в список первой :(
                // ставлю костыль по перекидыванию в конец списка
                if ( faultFields.length > 1 && faultFields[0].tagName === "TEXTAREA") {
                    faultFields.push( faultFields.shift() );
                }
                var focusTo = faultFields[0];
                
                // ещё один для блока радиокнопок
                if ( focusTo.tagName === "P" ) { // родитель радиокнопок
                    focusTo.scrollIntoView();
                } else {
                    focusTo.focus();
                }
                EO.preventDefault();
                return; // ждем внесения правок и следующего submit

            } else {
                // перекрасим формочку
                swapTheme(formElem);
            }

            /* ************************************** */
            /*     первичная валидация пройдена       */
            /*          все поля заполнены            */
            /* ************************************** */
            
            /*  отдельная валидация текстовых полей   */
            // посетители
            if (isNaN(visitorsValue)) {
                errorText = "Введите корректное число посетителей сайта";
                showErrorSpan(visitors.parentNode, visitors, errorText);
                formElem.classList.remove("dynform--pink");
                formElem.classList.add("dynform--grey");
                visitors.focus();
                EO.preventDefault();
                return; // не проверять дальше
            }

            // email
            var emailValue = email.value;
            // проверка на собаку и точку
            var atPos = emailValue.indexOf("@");
            var dotPos = emailValue.indexOf(".");
            atPos = ( atPos === -1 ) ? false : true;
            dotPos = ( dotPos === -1 ) ? false : true;
            isValid = ( atPos && dotPos && 
                ( emailValue.substring(atPos+1, dotPos) !== "" ) );
            if ( !isValid ) {
                errorText = "Введите корректный e-mail адрес";
                showErrorSpan(email.parentNode, email, errorText);
                email.focus();
                EO.preventDefault();
                return; // не проверять дальше
            }

            // дата
            var launchdateValue = launchdate.value;
            while ( launchdateValue.indexOf(".") > -1 ) {
                launchdateValue = launchdateValue.replace(".", "-");
            }
            var dateItems = launchdateValue.trim().split("-");
            var year, month, day;
            Array.prototype.forEach.call(dateItems, function(num){
                if (num.length === 4) {
                    year = num;
                } else if ( parseInt(num) <= 12 && dateItems.indexOf(num) === 1) {
                    month = num-1; //ага
                }
            });
            dateItems.splice( dateItems.indexOf(year), 1 );
            dateItems.splice( dateItems.indexOf(month), 1 );
            day = dateItems[0];

            launchdateValue = new Date(year, month, day);
            if ( launchdateValue == "Invalid Date" ) {
                errorText = "Введите дату вида ГГГГ-ММ-ДД";
                showErrorSpan(launchdate.parentNode, launchdate, errorText);
                launchdate.focus();
                EO.preventDefault();
                return; // не проверять дальше
            }
            launchdate.value = formatDateTime.call(launchdateValue).split(" ")[0];


            // посетители + размещение
            if ( visitorsValue < 10000 && paymentValue === 3) {
                errorText = "Недостаточная посещаемость для данного типа размещения";
                showErrorSpan(paymentParent, payment[0], errorText);
                paymentParent.scrollIntoView();
                EO.preventDefault();
                return;
            }

            // и т.д.

        } catch(err) {
            EO.preventDefault();
        }
    }
}());
