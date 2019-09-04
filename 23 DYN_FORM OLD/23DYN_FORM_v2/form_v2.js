"use strict";

function makeFormElement(inFormEl, formParams) {

    // цикл по всем элементам массива с параметрами
    if ( !Array.isArray(formParams) ) return; // ничего не делать

    // клонируем поступивший элемент form
    // для добавления в него дочерних элементов
    var outFormEl = inFormEl.cloneNode();

    // каждый элемент массива параметров, передается функции,
    // которая возвращает блок формы в виде тэга <p>
    // кнопка submit будет в тэге <div>
    formParams.forEach(function(item){
        var formPart = makeFormPart(item);
        outFormEl.appendChild(formPart);
    });

    // изначально неизвестно ничего о месте в DOM переданного тэга form
    // пробуем получить ссылку на его родителя 
    var formParent = inFormEl.parentNode;

    if ( formParent === null ) {
        // если родителя нет - приделывем форму к body
        document.body.appendChild(outFormEl);
    } else {
        // иначе подменяем у родителя ссылку с поступившей формы на полученную
        formParent.replaceChild(outFormEl, inFormEl);
    }
    // дело сделано


    // логика
    function makeFormPart(itemData) {
        // разбирает полученный хэш по параметрам
        // формирует тэги и атрибуты
        // добавляет созданные узлы в дочерние
        // к обертке <p> или <div> для кнопки
        // возвращает обертку

        var kindValue = itemData.kind;
        var nameValue = itemData.name;
        var labelValue = itemData.label;
    
        // хэш с базовыми атрибутами будущих элементов формы ( не label )
        var attrs =
        {
            id: nameValue,
            name: nameValue
        };
        
        // не оборачивать в span значения label радиокнопок
        // (такая стилизация)
        var spanInLabel = true;
        
        // тег-обертка текущего набора элементов формы
        var wrapEl = document.createElement("p");
        
        // метка элемента формы создается одинаково
        makeLabel(wrapEl, attrs.id, labelValue, spanInLabel);
        
        // задаю отличие полей типа longtext и shorttext
        var LONG_TEXT_SIZE = 70;
        var SHORT_TEXT_SIZE = 30;
        // количество строк в поле fieldset
        var FIELDSET_HEIGHT = 3;

        // вырианты тегов для создания
        var INPUT_TAG = "input";
        var TEXTAREA_TAG = "textarea";
        var DIV_TAG = "div";
        
    
        // изменяем набор атрибутов перед созданием элемента input
        switch ( kindValue ) {
        case "longtext":
            attrs.type = "text";
            attrs.size = LONG_TEXT_SIZE;
            makeTag(wrapEl, INPUT_TAG, attrs);
            break;
    
        case "shorttext":
            attrs.type = "text";
            attrs.size = SHORT_TEXT_SIZE;
            makeTag(wrapEl, INPUT_TAG, attrs);
            break;
    
        case "number":
            attrs.type = "number";
            makeTag(wrapEl, INPUT_TAG, attrs);
            break;
    
        case "radio":
            var ord = 0;
            var baseId = attrs.id; // сохраним оригинальное имя
            itemData.variants.forEach(function(item){
                ord++;
                attrs.type = "radio";  
                attrs.id = baseId + ord;
                attrs.value = item.value;
                labelValue = item.text;
                spanInLabel = false;
                makeTag(wrapEl, INPUT_TAG, attrs);
                makeLabel(wrapEl, attrs.id, labelValue, spanInLabel);
            });
            break;
    
        case "check":
            attrs.type = "checkbox";
            makeTag(wrapEl, INPUT_TAG, attrs);
            break;

        case "memo":
            attrs.name = nameValue;
            attrs.id = nameValue;
            //attrs.rows = FIELDSET_HEIGHT;
            makeTag(wrapEl, TEXTAREA_TAG, attrs);
            break;
    
        case "submit":
            attrs = {};
            attrs.type = "submit";
            attrs.value = labelValue;
            // для кнопки оберткой должен быть div
            wrapEl = document.createElement(DIV_TAG);
            makeTag(wrapEl, INPUT_TAG, attrs);
            break;
        }

        // ВОЗВРАЩАЕМ <p> или <div>, сформированный по
        // одной записи (хэшу) из списка параметров 
        return wrapEl;

        /*
        * функции, формирующие теги
        */

        // формирует <label>
        function makeLabel(parentEl, forVal, labelVal, isSpanned) {
            // формируем элемент label
            var labelEl = document.createElement("label");
            if ( isSpanned ) {
                var spanEl = document.createElement("span");
                spanEl.textContent = labelVal;
                labelEl.appendChild(spanEl);
            } else {
                labelEl.textContent = labelVal;
            }
            labelEl.htmlFor = forVal;
            // добавляем label последним дочерним
            // к переданному тегу-обертке
            parentEl.appendChild(labelEl);
        }

        // формирует у parentEl заданный дочерний tagName тег с атрибутами из attrHash
        function makeTag(parentEl, tagName, attrHash) {
            var inputEl = document.createElement(tagName);
            // все ключи хэша делаем атрибутами у <input>
            for (var k in attrHash) {
                inputEl.setAttribute(k, attrHash[k]);
            }
            if ( attrHash.type === "checkbox" ) {
                inputEl.checked = true;
            }
            // добавляем input последним дочерним
            // к переданному тегу-обертке
            parentEl.appendChild(inputEl);
        }

    } // makeFormPart()
}