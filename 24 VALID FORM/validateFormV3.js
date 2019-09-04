"use strict";
// валидируемая форма
var formEl = document.getElementById("catalogForm");
// и её элементы
var formElems = document.forms.catalogForm.elements;


var team = document.forms.catalogForm.team,
    siteName = document.forms.catalogForm.sitename,
    siteUrl = document.forms.catalogForm.siteurl,
    launchDate = document.forms.catalogForm.launchdate,
    visitors = document.forms.catalogForm.visitors,
    email = document.forms.catalogForm.email,
    division = document.forms.catalogForm.division,
    payment = document.forms.catalogForm.payment,
    votes = document.forms.catalogForm.votes,
    description = document.forms.catalogForm.description;


// назначаем слушателей
formEl.onsubmit = function(EO) {
    EO = EO || window.event;
    try {
        var ec = 0;
        ec += valTeam(!ec);  // Я в шоке!!!
        ec += valSiteName(!ec);
        ec += valSiteUrl(!ec);
        ec += valLaunchDate(!ec);
        ec += valVisitors(!ec);
        ec += valEmail(!ec);
        ec += valDivision(!ec);
        ec += valPayment(!ec);
        ec += valVotes(!ec);
        ec += valDescription(!ec);
    } catch(err) {
        EO.preventDefault();
        console.log(err.message, err.lineNumber);
    }
    if ( ec )
        EO.preventDefault();
}

formElems.team.onblur = function() {
    valTeam(false);
};
formElems.sitename.onblur = function() {
    valSiteName(false);
};

// для подсказки формата ссылки на сайт
var urlMask = "https://";
// показываем плейсхолдер для URL
addPlaceholder(formElems.siteurl, urlMask);
// при фокусе на поле для URL оставим плейсхолдер для удобства
formElems.siteurl.onfocus = function() {
    this.style.color = "inherit";
    var self = this;
    if ( !this.was ) {
        setTimeout(function() {
            // подсветка http(s)
            self.setSelectionRange("http".length, "http".length+1);
        }, .1);
    } else {
        // если фокус на поле уже не первый, то акцент на протоколе не нужен
        setTimeout(function() {
            self.setSelectionRange(self.value.length, self.value.length);
        }, .1); 
    }
    this.was = true;
};
formElems.siteurl.onblur = function() { valSiteUrl(false); };

// для подсказки формата вводимой даты
var dateMask = "ГГГГ-ММ-ДД";
// показываем
addPlaceholder(formElems.launchdate, dateMask);
// и убираем содержимое при фокусе на поле (только если значение поля невалидно)
formElems.launchdate.onfocus = function() {
    if ( !this.valid ){
        this.value = "";
        this.style.color = "inherit";
    }
};

formElems.launchdate.onblur = function() { valLaunchDate(false); };
formElems.visitors.onblur = function() { valVisitors(false); };
// при смене, но не при вводе числа посетителей
// надо перевалидировать зависимые поля
formElems.visitors.onchange = function() {
    if ( !this.was ) // это первый ввод посетителей
        return;
    // изменяяется число посетителей
    if ( !checkError(division, "empty") )
        valDivision(false);
    if ( !checkError( paymentRadios.value, "empty") )
        valPayment(false);
};
formElems.email.onblur = function() { valEmail(false); };

formElems.division.onchange = function() {
    valDivision(false);
    // перевалидировать размещение, если оно уже было заполнено
    if ( !checkError( paymentRadios.value, "empty") )
        valPayment(false);
};

var paymentRadios = formElems.payment; // коллекция
Array.prototype.forEach.call(paymentRadios, function(lastChangedPaym){
    lastChangedPaym.onchange = function() {
        valPayment(false);
        // перевалидировать division, если тот уже был заполнен
        if ( !checkError(division.value, "empty") )
            valDivision(false);
    };
});

formElems.votes.onchange = function() { valVotes(false); };
formElems.description.onblur = function() { valDescription(false); };


function valTeam(af){
    var errSpan = team.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(team);
        team.parentNode.appendChild(errSpan);
    }
    var teamValue = team.value.trim();
    var errCount = 0;
    if ( checkError(teamValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Введите название команды";
    } else {
        errSpan.innerHTML = "";
        team.classList.remove("warnborder");
    }
    if ( errCount ) {
        team.classList.add("warnborder");
        if ( af ) 
            team.focus();
    }
    // возвращаем число ошибок
    return errCount;
}

function valSiteName(af){
    var errSpan = siteName.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(siteName);
        siteName.parentNode.appendChild(errSpan);
    }
    var siteNameValue = siteName.value.trim();
    var errCount = 0;
    if ( checkError(siteNameValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Введите название сайта";
    } else {
        errSpan.innerHTML = "";
        siteName.classList.remove("warnborder");
    }
    if ( errCount ) {
        siteName.classList.add("warnborder");
        if ( af ) 
            siteName.focus();
    }
    // возвращаем число ошибок
    return errCount;
}


function valSiteUrl(af){
    var errSpan = siteUrl.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(siteUrl);
        siteUrl.parentNode.appendChild(errSpan);
    }
    var siteUrlValue = siteUrl.value.trim();
    var errCount = 0;
    if ( checkError(siteUrlValue, "empty") || siteUrlValue === urlMask ) {
        errCount++;
        errSpan.innerHTML = "Укажите ссылку на сайт";
        // если ввод был пустой - вернуть плейсхолдер
        addPlaceholder(siteUrl, urlMask);
    } else if ( checkError(siteUrlValue, "urldomain") ) {
        errCount++;
        errSpan.innerHTML = "Укажите доменную зону сайта (отделяется от имени точкой)";
    } else if ( checkError(siteUrlValue, "urlprotocol") ) {
        errCount++;
        errSpan.innerHTML = "Укажите протокол обмена данными с сайтом";
    } else {
        errSpan.innerHTML = "";
        siteUrl.classList.remove("warnborder");
    }
    if ( errCount ) {
        siteUrl.classList.add("warnborder");
        if ( af ) 
            siteUrl.focus();
    }
    // возвращаем число ошибок
    return errCount;
}


function valLaunchDate(af) {
    var errSpan = launchDate.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(launchDate);
        launchDate.parentNode.appendChild(errSpan);
    }
    var launchDateValue = launchDate.value.trim();
    var errCount = 0;
    if ( checkError(launchDateValue, "empty") || launchDateValue === dateMask) {
        errCount++;
        errSpan.innerHTML = "Укажите дату запуска сайта";
        // если ввод был пустой - вернуть плейсхолдер
        addPlaceholder(launchDate, dateMask);
    } else if ( checkError(launchDateValue, "date") ) {
        errCount++;
        errSpan.innerHTML = "Введите дату вида ГГГГ-ММ-ДД";
    } else {
        errSpan.innerHTML = "";
        launchDate.classList.remove("warnborder");
        // при возможном возвращении на поле надо отменить механизм
        // убирающий содержимое (плейсхолдер) поля при фокусе
        // это свойство узла и отвечает за отмену механизма
        launchDate.valid = true;
    }
    if ( errCount ) {
        launchDate.classList.add("warnborder");
        launchDate.valid = false; // при фокусе содержимое затрется
        if ( af ) 
            launchDate.focus();
    }
    // возвращаем число ошибок
    return errCount;
}


function valVisitors(af) {
    var errSpan = visitors.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(visitors);
        visitors.parentNode.appendChild(errSpan);
    }
    var visitorsValue = visitors.value.trim();
    var errCount = 0;
    if ( checkError(visitorsValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Введите количество посетителей";
    } else if ( checkError(visitorsValue, "separator") ) { // точки или запятые
        errCount++;
        errSpan.innerHTML = "Не отделяйте разряды числа точками или запятыми";   
    } else if ( checkError(visitorsValue, "nonInteger") ) { // проверка на приводимость к числу
        errCount++;
        errSpan.innerHTML = "Введите корректное (положительное) число";
    } else {
        errSpan.innerHTML = "";
        visitors.classList.remove("warnborder");
        visitors.was = true;
    }
    if ( errCount ) {
        visitors.classList.add("warnborder");
        if ( af ) 
            visitors.focus();
    }
    // возвращаем число ошибок
    return errCount;
}

function valEmail(af) {
    var errSpan = email.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(email);
        email.parentNode.appendChild(errSpan);
    }
    var emailValue = email.value.trim();
    var errCount = 0;
    if ( checkError(emailValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Укажите e-mail для связи";
    } else if ( checkError(emailValue, "email") ) {
        errCount++;
        errSpan.innerHTML = "Введите корректный адрес электронной почты";
    } else if ( checkError(emailValue, "nonLatin") ) {
        errCount++;
        errSpan.innerHTML = "Введите другой e-mail, не содержащий русские буквы";
        // почту на домене с названием на кириллице считаем неподходящей
    } else {
        errSpan.innerHTML = "";
        email.classList.remove("warnborder");
    }
    if ( errCount ) {
        email.classList.add("warnborder");
        if ( af ) 
            email.focus();
    }
    // возвращаем число ошибок
    return errCount;
}

function valDivision(af) {
    var errSpan = division.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(division);
        division.parentNode.appendChild(errSpan);
    }
    var divisionValue = division.value;
    var errCount = 0;
    if ( checkError(divisionValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Выберите рубрику каталога";
    } else if ( checkError(divisionValue, "division|visitors") ) {
        errCount++;
        errSpan.innerHTML = "Недостаточная посещаемость для размещения в выбранной рубрике";
    } else {
        errSpan.innerHTML = "";
        division.classList.remove("warnborder");
    }
    if ( errCount ) {
        division.classList.add("warnborder");
        if ( af ) 
            division.focus();
    }
    // возвращаем число ошибок
    return errCount;
}

function valPayment(af) {
    var errSpan = payment[0].parentNode.lastChild;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(payment);
        // payment это коллекция радиокнопок
        payment[0].parentNode.appendChild(errSpan);
    }
    var paymentValue = "";
    // выбираем отмеченную радиокнопку и её значение сохраняем
    Array.prototype.forEach.call(payment, function(item){
        if ( item.checked ) paymentValue = item.value;
    });
    var errCount = 0;
    // если отмеченных не было, то значение осталось равным "",
    // поэтому можно использовать готовую проверку "empty"
    if ( checkError(paymentValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Вы не выбрали тип размещения";
    } else if ( checkError(paymentValue, "payment|division") ) {
        errCount++;
        errSpan.innerHTML = "Данный тип размещения недоступен при выбранной выше рубрике";
    } else if ( checkError(paymentValue, "payment|visitors") ) {
        errCount++;
        errSpan.innerHTML = "Недостаточная посещаемость для выбранного типа размещения";
    } else {
        errSpan.innerHTML = "";
    }
    if ( errCount && af )
        payment[0].scrollIntoView();
    // возвращаем число ошибок
    return errCount;
}

function valVotes(af) {
    var errSpan = votes.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(payment);
        votes.parentNode.appendChild(errSpan);
    }
    var votesValue = votes.checked;
    var errCount = 0;
    if ( checkError(votesValue, "disagree") ) {
        errCount++;
        errSpan.innerHTML = "Необходимо разрешить отзывы";
    } else {
        errSpan.innerHTML = "";
    }
    if ( errCount && af)
        votes.scrollIntoView();
    // возвращаем число ошибок
    return errCount;
}

function valDescription(af) {
    var errSpan = description.nextSibling;
    if ( !isErrSpan(errSpan) ) {
        errSpan = makeErrSpan(payment);
        description.parentNode.appendChild(errSpan);
    }
    var descriptionValue = description.value.trim();
    var errCount = 0;
    if ( checkError(descriptionValue, "empty") ) {
        errCount++;
        errSpan.innerHTML = "Введите описание сайта";
    } else {
        errSpan.innerHTML = "";
        description.classList.remove("warnborder");
    }
    if ( errCount ) {
        description.classList.add("warnborder");
        if ( af ) 
            description.focus();
    }
    // возвращаем число ошибок
    return errCount;
}

/*
** "МОДУЛЬ" ПРОВЕРОК
*/
function checkError(fieldValue, fieldType) {
    switch ( fieldType ) {
        case "empty":
        return fieldValue === "" ;

        case "nonInteger":
        return isNaN(fieldValue) || fieldValue < 0;

        case "urldomain":
        if ( fieldValue.charAt(fieldValue.length-1) === "." )
            return true;
        else if ( fieldValue.toLowerCase().indexOf("www") !== -1 )  
            return fieldValue.indexOf(".") === fieldValue.lastIndexOf(".");
        else
            return fieldValue.indexOf(".") === -1 ;

        case "urlprotocol":
        return fieldValue.indexOf("http://") === -1 && fieldValue.indexOf("https://") === -1;

        case "separator":
        return fieldValue.indexOf(",") !== -1 || fieldValue.indexOf(".") !== -1;

        case "date":
        var dateItems = fieldValue.split("-");
        var year = dateItems[0],
            month = dateItems[1],
            day = dateItems[2];
            fieldValue = new Date(year, month, day);
        return fieldValue == "Invalid Date";

        case "email":
        var emailParts = fieldValue.split("@");
        if ( !emailParts[1] )
            // отсутствие собаки
            return true;
        else
            // разбор части после @
            var domain = emailParts[1].split(".");
            // длина имени ящика < 2; отсутствие точки; gjckt 
        return  domain[0].length<2 || !domain[1] || domain[1].length<2;

        case "nonLatin":
        var chars = fieldValue.split("");
        return Array.prototype.some.call(chars, isCyrrChar);

        case "division|visitors":
        var visVal = parseInt(visitors.value)
        // в рубрику "здоровье" нельзя с числом посетителей меньше 5000
        // в рубрику "домашний уют" нельзя с числом посетителей меньше 500
        return /*isNaN(visVal) ||*/ ( fieldValue == 1 && visVal < 5000 ) || ( fieldValue == 2 && visVal < 500 );

        case "payment|division":
        // бесплатное размещение невозможно в рубрике бытовая техника 
        return ( fieldValue == 1 && division.value == 3 )

        case "payment|visitors":
        var visVal = parseInt(visitors.value)
        // бесплатное размещение невозможно при числе посетителей меньше 30000
        return /*isNaN(visVal) ||*/ fieldValue == 1 && visVal < 30000 ;

        case "disagree":
        return !fieldValue;
    }

}

/*
** ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
*/

// проверяет у поля ввода наличие рядом span-тега для вывода ошибок
function isErrSpan(spanTag) {
    return spanTag && spanTag.className.indexOf("warning") !== -1;
}

// формирует тег span и классы для него
// для отображения текста ошибки у поля ввода 
function makeErrSpan(inpTag) {
    var textSpan = document.createElement("span");
    textSpan.classList
        .add("warning", "animated", "shake");
    return textSpan;
}

// помещает значение подсказки в поле
function addPlaceholder(field, text) {
    field.value = text;
    field.style.color = "#a0a0a0"; // серенький
}

// возвращает истину для букв кириллицы
function isCyrrChar(char) {
    var codePoint = char.charCodeAt();
    return  (1040 <= codePoint && codePoint <= 1103) ||  
            (codePoint == 1025 || codePoint == 1105 || codePoint == 39);
}
