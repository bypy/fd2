"use strict";
// получает ссылку 'formEl' на html элемент <form>
// получает массив 'formDef' с описанием полей формы
// => наполняет указанную форму переданным содержимым

function formBuilder(formEl, formDef){
    // проверить, что полученный formDef это массив
    if ( !Array.isArray(formDef) ) return;
    
    // создаем newFormEl - непривязанный DOM клон элемента formEl
    var workForm = formEl.cloneNode();

    // выбор тега для обертывания составляющих формы
    var FORM_ITEM_WRAPPER = "p";

    // элементы-заготовки для добавления данных  
    var inp = document.createElement("input");
    var lbl = document.createElement("label");
    var spn = document.createElement("span");
    var txtAr = document.createElement("textarea");
    var sel = document.createElement("select");
    var opt = document.createElement("option");
    var div = document.createElement("div");
    var wrapTag = document.createElement(FORM_ITEM_WRAPPER);

    lbl.setAttribute("for", "");
    inp.setAttribute("type","");
    inp.setAttribute("id","");
    inp.setAttribute("name","");
    sel.setAttribute("id","");
    sel.setAttribute("name","");
    opt.setAttribute("value");
    txtAr.setAttribute("name","");
    txtAr.setAttribute("id","");
    txtAr.setAttribute("rows","");
    div.setAttribute("class","btn");

    lbl.appendChild(spn);

    function buildFormItem(data){
        var i;
        var inputKind = data.kind;
        var inputName = data.name;
        var inputLabel = data.label;
        var inputVariants = data.variants;
                
        var input = inp.cloneNode(true);
        var div = div.cloneNode(true);
        var label = lbl.cloneNode(true);
        var select = sel.cloneNode(true);
        var option = opt.cloneNode(true);

        // общие для всех label свойства
        label.HtmlFor = inputName;
        label.textContent = inputLabel;
        // общие для всех input свойства
        input.id = inputName;
        input.name = inputName;
        select.id = inputName;
        select.name = inputName;

        if ( inputKind === "submit" ) {
            input.type = "submit";
            input.setAttribute("value","Опубликовать");
            div.appendChild(input);
            return div; // кнопка обернута div-ом
        }

        if ( inputKind === "longtext" || inputKind === "shorttext" ) {
            input.type = "text";
            input.size = ( inputKind === "longtext" ) ? "70" : "30";
            wrapTag.appendChild(label);
            wrapTag.appendChild(input);
        } else if ( inputKind === "number" ) {
            input.type = "number";
            wrapTag.appendChild(label);
            wrapTag.appendChild(input);
        } else if ( inputKind === "combo" ) {
            for ( i=0; i < inputVariants.length; i++) {
                option.value = inputVariants[i].value;
                option.textContent = inputVariants[i].text;
            } 
            wrapTag.appendChild(label);
            wrapTag.appendChild(select);
        } else if ( inputKind === "radio" ) {
            input.type = "radio";
            var headLabel = document.createElement("label");
            headLabel.setAttribute("for","");
            headLabel.textContent = "Размещение:";
            for ( i=0; i < inputVariants.length; i++) {
                input.type = "radio";
                input.id += i.toString();
                input.value = inputVariants[i].text;
            }
        }
        

        return wrapTag;
    }



    // перебор массива с параметрами и данными формы
    formDef.forEach(function(item){
        
        

        if ( inputKind === "longtext" ) {

        } else if ( inputKind === "longtext" ) {

        }

        console.log(labelText, inputKind, inputVariants)
    });

    // заменить formEl на newFormEl
    
}