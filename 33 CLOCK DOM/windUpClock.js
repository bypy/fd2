// delay возвращает обертку для установки таймера размером "ms" мс 
// перед выполнением функции "func",
// переданной в delay

function delay(func, ms) {
    return function() {
        var params = arguments;
        var self = this;
// здесь, наверное, лажа        
        // хочется, но не получается вызвать для остановки таймеров по отдельности
        var pause = false;
        var pauseJob = function() {
            pause = !pause;
        }
// и здесь
        // хочется, но не получается хранить последнее число в таймере
        var lastValue = "";

        setTimeout(function doJob(){
            if ( !globalStop /* !pause */ ) {
                // отметили время до начала работы функции
                var begin = new Date().getTime();

                func.apply(self,params);
                console.log(lastValue, pause);
                // корректируем таймаут для следующего вызова
                var duration = new Date().getTime() - begin;
                setTimeout( doJob, ms - duration);
            }
        }, ms);
    };
}



var clock = document.getElementById("clock");
var clockBorderColor = window.getComputedStyle(clock)
    .getPropertyValue("border-top-color");

var clockFrame = document.getElementById("clock-frame");
clockFrame.style.lineHeight = clockFrame.offsetHeight + "px";
clockFrame.style.fontSize = clockFrame.offsetHeight * 0.8 + "px";
clockFrame.style.textAlign = "center";

var clockFrameBgColor = window.getComputedStyle(clock)
    .getPropertyValue("background-color");


// смог только через глобальную переменную остановить все таймеры
var globalStop = false;

// для остановки выполнения функции
window.onkeyup = function(EO){
    EO = EO || window.event;
    switch ( EO.keyCode ) {

        // TypeError: delayBorderChangeColor.pauseJob is not a function
        case 49: // клавиша 1 останавливает таймер смены цвета рамки
        delayBorderChangeColor.pauseJob();
        break;

        case 50: // клавиша 2 останавливает таймер смены цвета фона
        delayBgChangeColor.pauseJob();
        break;

        case 51: // клавиша 3 останавливает таймер отсчета
        delayWriteSecondsToElem.pauseJob();
        //delayWriteSecondsToElem.pause = 
        break;

        // снять с паузы

        case 81:
        border(); // q
        break;

        case 87:
        bg();   // w
        break;

        case 69:
        seconds();  // e
        break;

        // остановить все таймеры через глобальную переменную 
        default:
        globalStop = !globalStop;
        console.log("Paused: ", globalStop);
    }
}

function changeColor(elem, property, startColor) {
    var colorArr = ( startColor.indexOf("rgbp") !== -1 ) ?
        startColor
            .slice(startColor.indexOf("(") + 1, startColor.indexOf(")"))
            .split(",")
        :
        ["10", "10", "10"];
    var nextColor = colorArr.map( function(color) {
        var add = Math.random() * 256;
        var sum = parseInt(color) + parseInt(add);
        if ( sum > 255)
            return  sum - 256;
        else
            return  sum;
    });

    elem.style[property] = "rgb(" + nextColor.toString() + ")";
}

function writeSecondsToElem(elem, val) {
    if ( elem === null )
        return;
    val = val || new Date().getSeconds()
    elem.innerHTML = val;
}


var delayBorderChangeColor = delay(changeColor, 1000);
var delayBgChangeColor = delay(changeColor, 1000);
var delayWriteSecondsToElem = delay(writeSecondsToElem, 1000);


function border() {
    delayBorderChangeColor(clock, "border-color", clockBorderColor);
}

function bg() {
    delayBgChangeColor(clockFrame, "background-color", clockFrameBgColor);
}

function seconds(startValue) {
    delayWriteSecondsToElem(clockFrame, startValue);
}

border();
bg();
seconds();

