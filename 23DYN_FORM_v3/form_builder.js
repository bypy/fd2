"use strict";

function data2Form(inFormElem, formParamsList) {

    // цикл по всем элементам массива с параметрами
    if ( !Array.isArray(formParamsList) ) return; // ничего не делать

    // полученную форму копируем и удаляем дочерние
    var outFormElem = inFormElem.cloneNode();
    outFormElem.innerHtml = null;
    // если будет построено более одной формы на странице,
    // надо обеспечить уникальность значений атрибута id
    // у создаваемых элементов
    var F_ID = outFormElem.id;

    // каждый элемент массива параметров, передается функции,
    // которая возвращает блок формы в виде тэга <p>
    // кнопка submit будет в тэге <div>
    formParamsList.forEach(function(formItem){
        var formPart = makeFormPart(formItem);
        outFormElem.appendChild(formPart);
    });
    // содержимое переданной формы заменяем на содержимое полученной
    inFormElem.innerHTML = outFormElem.innerHTML;


    // возвращает {tagName} HTML-тег с атрибутами из хэша attrHash
    function makeTag(tagName, attrHash) {
        var htmlElem = document.createElement(tagName);
        attrHash = attrHash || {};
        // все ключи хэша делаем атрибутами созданного тега
        for (var k in attrHash) {
            htmlElem.setAttribute(k, attrHash[k]);
        }
        return htmlElem;
    }

    function makeUID(id, ns) {
        ns = ns || F_ID; // по умолчанию берется id переданной формы
        return ns.concat( "_", id );
    }

    function makeFormPart(itemDataH) {
        // разбирает полученный хэш по параметрам
        // формирует тэги и атрибуты

        var LONG_TEXT_SIZE = 70,  // задаю длины текстовым полям
            AVER_TEXT_SIZE  = 50,
            SHORT_TEXT_SIZE = 30,
            SHORTER_TEXT_SIZE = 15,
            FIELDSET_HEIGHT = 3; // количество строк в поле fieldset

        // блочный тег-обертка для каждой части создаваемой формы
        var parWrap = document.createElement("p");
        // переменные для тегов
        var labelTag,
            inputTag,
            selectTag,
            optionTag;
        var spanTag = document.createElement("span");

        // составим набор атрибутов для создания части формы
        var attrs = {};
        
        // label для большинства частей одинаковый
        // label > span > text
        attrs.for = itemDataH.name;
        labelTag = makeTag("label", attrs);
        spanTag.textContent = itemDataH.label;
        labelTag.appendChild(spanTag);
        delete attrs.for; // attrs = {}

        // набор атрибутов определяется типом части формы
        var kind = itemDataH.kind;
        switch ( kind ) {

        case "longtext":
            attrs.size = LONG_TEXT_SIZE;
            /* NO BREAK */
        case "averagetext":
            attrs.size = (kind === "averagetext") ? AVER_TEXT_SIZE : attrs.size;
            /* NO BREAK */
        case "shorttext":
            attrs.size = (kind === "shorttext") ? SHORT_TEXT_SIZE : attrs.size;
            /* NO BREAK */
        case "shortertext":
            attrs.name = itemDataH.name;
            attrs.id = makeUID(itemDataH.name);
            attrs.type = "text";
            attrs.size = (kind === "shortertext") ? SHORTER_TEXT_SIZE : attrs.size;
            parWrap.appendChild(labelTag); // p > label
            parWrap.appendChild( makeTag("input", attrs) ); // p > input
            break;
            
        case "number":
            attrs.name = itemDataH.name;
            attrs.id = makeUID(itemDataH.name);
            attrs.type = "number";
            parWrap.appendChild(labelTag);
            parWrap.appendChild( makeTag("input", attrs) );
            break;
    
        case "radio":
            parWrap.appendChild(labelTag);
            var radios = itemDataH.variants;
            var radioLabel;
            radios.forEach(function(radio){
                // input
                attrs.name = itemDataH.name;
                attrs.type = "radio";  
                attrs.value = radio.value;
                inputTag = makeTag("input", attrs);
                parWrap.appendChild(inputTag);
                // label
                attrs = {};
                attrs.for = itemDataH.name;
                radioLabel = makeTag("label", attrs);
                radioLabel.textContent = radio.text;
                parWrap.appendChild(radioLabel);
            });
            break;
        
        case "combo":
            parWrap.appendChild(labelTag);
            var combos = itemDataH.variants;
            attrs.name = itemDataH.name;
            attrs.id = makeUID(itemDataH.name);
            // select > option[]
            selectTag = makeTag("select", attrs);
            combos.forEach(function(combo){
                attrs = {};
                attrs.value = combo.value;
                optionTag = makeTag("option", attrs);
                optionTag.textContent = combo.text;
                selectTag.appendChild(optionTag);
            });
            // первая опция с подсказкой
            var emptyOption = optionTag.cloneNode();
            emptyOption.value = "";
            emptyOption.textContent = "--Выберите рубрику--";
            var firstOption = selectTag.firstChild;
            selectTag.insertBefore(emptyOption, firstOption);
            parWrap.appendChild(selectTag);
            break;

        case "check":
            attrs.name = itemDataH.name;
            attrs.id = makeUID(itemDataH.name);
            attrs.type = "checkbox";
            parWrap.appendChild(labelTag);
            parWrap.appendChild( makeTag("input", attrs) );
            break;

        case "memo":
            attrs.name = itemDataH.name;
            attrs.id = makeUID(itemDataH.name);
            attrs.rows = FIELDSET_HEIGHT;
            parWrap.appendChild( makeTag("textarea", attrs) );
            break;
    
        case "submit":
            attrs.id = makeUID("submit");
            attrs.name = "submit"
            attrs.type = "submit";
            attrs.value = itemDataH.label;
            // у кнопки созданный вначале label не нужен
            parWrap.appendChild( makeTag("input", attrs) );
            break;
        }

        // ВОЗВРАЩАЕМ часть формы, 
        // сформированную по одной записи из списка параметров
        return parWrap;
    }
}