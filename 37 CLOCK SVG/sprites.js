"use strict";

// запуск создания спрайтов начинается после
// выполнения функции createClockElements, которая в свою очередь выполнится
// после загрузки DOM дерева
// Это обусловлено снятием размеров с показываемых стрелок (в форме линий)
// и установки этих размеров спрайтам

// функция подготавливает спрайты, добавляя код в разметку
function createVintageElements(clockElements) {

    // clockElements  - это svg_группа для добавления в неё группы со спрайтами

    // наименования идентификаторов спрайтов
    var HOUR_SYMB_ID = "#hourSymb",
        MINUTE_SYMB_ID = "#minuteSymb",
        SECOND_SYMB_ID = "#secondSymb";

    var svgNS = "http://www.w3.org/2000/svg";
    var params = {};

    // svg контейнер для спрайтов
    params = { xmlns: svgNS, display: "none" };
    var svgEl = createSvgElem(svgNS, "svg", params);

    // defs
    var defsEl = createSvgElem(svgNS, "defs");

    // symbol элементы
    // часвой стрелки
    params = { id: "hourSymb", viewBox: "34.48 107.07 90.08 297.86",
                preserveAspectRatio: "xMidYMid meet" };
    var hourSymbol = createSvgElem(svgNS, "symbol", params);

    // минутной стрелки
    params = { id: "minuteSymb", viewBox: "168.34 59.96 85.42 392.08",
                preserveAspectRatio: "xMidYMid meet" };
    var minuteSymbol = createSvgElem(svgNS, "symbol", params);

    // секундной стрелки
    params = { id: "secondSymb", viewBox: "330.47 28.93 49.06 454.14",
                preserveAspectRatio: "xMidYMid meet" };
    var secondSymbol = createSvgElem(svgNS, "symbol", params);

    hourSymbol.innerHTML = "<path fill=\"black\" d=\"M124.556,235.758c-1.354-18.965-24.533-26.188-34.768-13.546c-4.968,2.258-5.87-10.386-1.354-17.609c4.516-7.226,2.257-12.644-1.807-15.804s1.204-82.179-7.074-81.728c-8.277-0.451-3.01,78.566-7.073,81.728c-4.063,3.16-6.321,8.579-1.807,15.804c4.516,7.225,3.612,19.867-1.354,17.609c-10.233-12.644-33.412-5.419-34.768,13.546c-1.354,18.964,16.255,20.771,13.998,23.027c-2.258,2.258-5.419,14.9,4.364,18.964c9.782,4.064,16.856-5.418,18.212-1.806c1.354,3.612-4.064,19.867-2.771,34.769c1.294,14.899,9.091,24.382,6.532,23.931c-4.666,0-9.182,11.288-4.666,14.9c1.12,0.896,1.878,1.949,2.386,3.026c-11.344,3.058-19.693,13.41-19.693,25.721c0,14.713,11.927,26.641,26.64,26.641c14.714,0,26.642-11.928,26.642-26.641c0-12.311-8.351-22.663-19.694-25.721c0.508-1.077,1.266-2.131,2.386-3.026c4.516-3.612,0-14.9-4.666-14.9c-2.559,0.451,5.238-9.03,6.532-23.931c1.294-14.901-4.124-31.155-2.771-34.769c1.354-3.613,8.43,5.869,18.213,1.806c9.783-4.063,6.622-16.706,4.365-18.964S125.911,254.721,124.556,235.758zM60.206,274.137c-6.404,0.451-9.852-7.676-2.996-13.546c6.854-5.87-0.194-16.706-0.194-16.706s1.919,5.418-6.323,6.32c-8.241,0.903-9.698-10.697-9.366-17.009c0.273-5.234,7.676-9.632,11.589-9.632s16.856,1.354,20.018,22.125C76.093,266.462,66.609,273.685,60.206,274.137zM90.368,378.284c0,5.979-4.841,10.82-10.811,10.82s-10.82-4.841-10.82-10.82c0-5.97,4.852-10.81,10.82-10.81S90.368,372.314,90.368,378.284zM108.417,250.206c-8.242-0.902-6.323-6.32-6.323-6.32s-7.049,10.836-0.193,16.706c6.854,5.869,3.407,13.997-2.997,13.546s-15.888-7.677-12.727-28.446c3.16-20.771,16.105-22.125,20.019-22.125c3.914,0,11.314,4.396,11.589,9.632C118.116,239.509,116.659,251.109,108.417,250.206z\"/>"
    minuteSymbol.innerHTML = "<path fill=\"black\" d=\"M251.789,206.859c-6.623-15.653-21.674-9.633-28.84-7.826c-7.166,1.806-0.66-11.439-0.059-16.255c0.603-4.816-3.611-8.429-5.419-13.847c-1.806-5.418,0-84.285,0-96.326S211,59.962,211,59.962s-6.473,0.603-6.473,12.644s1.807,90.908,0,96.326s-6.021,9.03-5.418,13.847c0.603,4.814,7.106,18.061-0.059,16.255c-7.167-1.807-22.218-7.827-28.84,7.826c-6.623,15.653,4.516,23.78,15.051,24.383c3.612,1.204-2.407,9.632,2.408,15.051c4.816,5.418,13.244,0.902,15.051-1.505c0,0,2.107,14.749-3.311,24.382c-5.419,9.633,3.611,106.862,3.311,113.484c-0.3,6.622-6.32,7.525-6.32,13.245c0,3.067,1.73,6.905,3.337,9.813c-7.881,4.08-13.271,12.306-13.271,21.793c0,13.549,10.983,24.532,24.533,24.532c13.549,0,24.532-10.983,24.532-24.532c0-9.487-5.389-17.713-13.271-21.793c1.606-2.908,3.339-6.746,3.339-9.813c0-5.72-6.021-6.623-6.321-13.245c-0.302-6.622,8.729-103.853,3.311-113.484s-3.311-24.382-3.311-24.382c1.806,2.407,10.233,6.923,15.05,1.505c4.817-5.419-1.203-13.847,2.409-15.051C247.274,230.64,258.412,222.513,251.789,206.859zM192.94,242.756c-2.031-2.031-0.227-6.547,2.258-9.48c2.482-2.937-0.451-7.677-6.773-7.677c-6.32,0-11.885-5.639-11.514-11.288c1.129-17.158,24.157-10.386,26.866,1.58C208.968,237.789,194.971,244.788,192.94,242.756zM221.812,427.507c0,5.971-4.841,10.812-10.812,10.812s-10.812-4.841-10.812-10.812c0-5.972,4.841-10.812,10.812-10.812S221.812,421.535,221.812,427.507zM233.577,225.598c-6.321,0-9.257,4.74-6.773,7.677c2.483,2.935,4.29,7.449,2.259,9.48c-2.031,2.032-16.029-4.967-10.836-26.865c2.709-11.966,25.736-18.738,26.865-1.58C245.463,219.96,239.899,225.598,233.577,225.598z\"/>"
    secondSymbol.innerHTML = "<path fill=\"black\" d=\"M366.262,436.744c1.605-2.908,3.338-6.746,3.338-9.814c0-5.719-6.021-6.623-6.32-13.244c-0.277-6.094,7.346-88.918,4.342-109.596c-5.439-9.85-9.008-26.295-9.008-44.932c0-16.673,2.855-31.589,7.354-41.601c0.439-1.463,0.803-2.778,0.924-3.749c0.604-4.816-3.611-8.429-5.418-13.847s0-146.347,0-158.388S355,28.931,355,28.931s-6.473,0.602-6.473,12.643s1.807,152.969,0,158.388c-1.807,5.418-6.02,9.03-5.418,13.847c0.121,0.971,0.484,2.287,0.926,3.75c4.496,10.013,7.352,24.929,7.352,41.6c0,18.639-3.566,35.084-9.008,44.934c-3.004,20.678,4.619,103.5,4.344,109.594c-0.301,6.621-6.32,7.525-6.32,13.244c0,3.068,1.73,6.906,3.336,9.814c-7.881,4.08-13.271,12.305-13.271,21.793c0,13.549,10.984,24.531,24.533,24.531s24.533-10.982,24.533-24.531C379.533,449.049,374.145,440.824,366.262,436.744zM355,469.347c-5.971,0-10.811-4.842-10.811-10.813s4.84-10.811,10.811-10.811s10.813,4.84,10.813,10.811S360.971,469.347,355,469.347z\"/>"

    defsEl.appendChild(hourSymbol);
    defsEl.appendChild(minuteSymbol);
    defsEl.appendChild(secondSymbol);

    svgEl.appendChild(defsEl);
    document.body.appendChild(svgEl);
    // вызов функции, подключающей спрайты на страницу
    appendVintageSprites(clockElements, HOUR_SYMB_ID, MINUTE_SYMB_ID, SECOND_SYMB_ID);
}

// функция использует добавленные спрайты по переданным идентификаторам спрайтов 
var appendVintageSprites = function(parentGroupNode, hourId, minuteId, secondId) {

    var svgNS = "http://www.w3.org/2000/svg";

    // контейнер находим только для считывания атрибута с его шириной
    var svgContainer = document.getElementById("clock"); // изначально в разметке
    var clockWidthS = svgContainer.getAttribute("data-width");
    var clockRad = parseInt(clockWidthS)/2;

    // parentGroupNode - это родительский элемент для группы стрелок
    // (пока не в DOM, это произойдет при запуске представления)

    // снимем размеры показываемых стрелок часов
    // концы линии закруглены?
    var roundCap = Boolean(parentGroupNode.getAttribute("data-round-linecap"));

    var currHHand = parentGroupNode.querySelector("#hourHand"),
        currMHand = parentGroupNode.querySelector("#minuteHand"),
        currSHand = parentGroupNode.querySelector("#secondHand");
    
    var addHLen=0, addMLen=0, addSLen=0;
    if (roundCap) {
        addHLen += parseInt(currHHand.getAttribute("stroke-width"));
        // пополам не делю, так как закругления имеются на обоих концах стрелок
        addMLen += parseInt(currMHand.getAttribute("stroke-width"));
        addSLen += parseInt(currSHand.getAttribute("stroke-width"));
    }

    var hHandTopS = currHHand.getAttribute("y2");
    var mHandTopS = currMHand.getAttribute("y2");
    var sHandTopS = currSHand.getAttribute("y2");
    
    var hHandLen = clockRad + addHLen - parseInt(hHandTopS);
    var mHandLen = clockRad + addMLen - parseInt(mHandTopS);
    var sHandLen = clockRad + addSLen - parseInt(sHandTopS);

    // элементы <use> для вставки спрайтов
    var spriteEl = document.createElementNS(svgNS, "use");
    // одинаковая ширина элементов <use>, равная ширине часов (это центрирует стрелки по оси X)
    spriteEl.setAttribute("width", clockWidthS);

    // <use> элементы для стрелок
    var hourSprite = spriteEl.cloneNode();
    var minuteSprite = spriteEl.cloneNode();
    var secondSprite = spriteEl.cloneNode();
    hourSprite.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", hourId);
    minuteSprite.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", minuteId);
    secondSprite.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", secondId);

    hourSprite.setAttribute("height", hHandLen);
    minuteSprite.setAttribute("height", mHandLen);
    secondSprite.setAttribute("height", sHandLen);
    // 8.9% это соотношение
    // (радиус "колечка" на хвосте часовой стрелки) / (длина стрелки) 
    // 6.3% для минутной стрелки и т.д.
    hourSprite.setAttribute("y", (clockRad - hHandLen*(1-0.089)).round2() ); 
    minuteSprite.setAttribute("y", (clockRad - mHandLen*(1-0.063)).round2() );
    secondSprite.setAttribute("y", (clockRad - sHandLen*(1-0.054)).round2() );

    // так как querySelector по атрибуту href для use у меня ничего не вибирает
    // добавлю свои атрибуты
    hourSprite.setAttribute("data-hand", "hour");
    minuteSprite.setAttribute("data-hand", "minute");
    secondSprite.setAttribute("data-hand", "second");

    // фоновое изображение циферблата
    var bgImg = { width: clockWidthS*2/3, height: clockWidthS*2/3 };
    bgImg.x = clockRad - bgImg.width/2;
    bgImg.y = clockRad - bgImg.height/2;
    params = {id: "vintage-clock-bg", width: bgImg.width, height: bgImg.height,
                x: bgImg.x, y: bgImg.y };
    var vintageBgImg = createSvgElem(svgNS, "image", params);
    vintageBgImg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "alla.png");

    // спрайт винтажного циферблата
    params = {id: "vintage-clock-face", width: clockWidthS, height: clockWidthS};
    var clockFaceSprite = createSvgElem(svgNS, "use", params);
    clockFaceSprite.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "my_roman_numerals.svg#clock");
    
    var params = { id: "vintageElements", style:"display: none;" }
    var vintageElementsGroup = createSvgElem(svgNS, "g", params);
    var vintageHandsGroup = createSvgElem(svgNS, "g", { id:"vintage-hands"});
    
    vintageElementsGroup.appendChild(clockFaceSprite);
    vintageElementsGroup.appendChild(vintageBgImg);
    vintageHandsGroup.appendChild(hourSprite);
    vintageHandsGroup.appendChild(minuteSprite);
    vintageHandsGroup.appendChild(secondSprite);
    vintageElementsGroup.appendChild(vintageHandsGroup);

    parentGroupNode.appendChild(vintageElementsGroup);
}