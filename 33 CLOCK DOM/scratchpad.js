"use strict";

var container =document.getElementById("container");
var maxWidth = container.clientWidth; // px

var CLOCK_WIDTH = maxWidth;
var CLOCK_FRAME_WIDTH = CLOCK_WIDTH / 16; // px
var CLOCK_FRAME_COLOR = "#faa805";
var CLOCK_RADIUS = (CLOCK_WIDTH - 2 * CLOCK_FRAME_WIDTH) / 2;

var HOUR_HAND_WIDTH = "6%";
var MINUTE_HAND_WIDTH = "4%";

var HOUR_HAND_TOP = "25%";
var MINUTE_HAND_TOP = "15%";
var NUMBER_PLACE_HEIGHT = "10vmin";
var NUMBER_PLACE_WIDTH = "10vmin";


var HOUR_HAND_COLOR = "red";
var MINUTE_HAND_COLOR = "black";

var HANDS_BOTTOM_OFFSET_FROM_ORIGIN = "10%";
var HANDS_X_ORIGIN = "50%" ;
var HANDS_Y_ORIGIN = (parseInt("100%") - parseInt(HANDS_BOTTOM_OFFSET_FROM_ORIGIN)) + "%";

//var HAND_BORDER_RADIUS = "45% 45% 40% 40% / 90% 90% 10% 10%";
var HAND_BORDER_RADIUS = "40% / 80% 80% 20% 20%";

var HOURS_FORMAT = 12;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_MINUTE = 60;

// расчет угла для смены часа минуты и секунды
var HOUR_STEP_ANGLE = 360 / HOURS_FORMAT;
var MINUTE_STEP_ANGLE = 360 / MINUTES_IN_HOUR;
var SECOND_STEP_ANGLE = 360 / SECONDS_IN_MINUTE;

// добавляем метод перевода градусы в радианы
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

// метод округления до одного разряда после точки
Number.prototype.round3 = function() {
  return Math.round(this * 10) / 10;
}

var clockFrame = document.createElement("div");
clockFrame.id = "clockFrame";
clockFrame.style.cssText =
  "position: relative;" +
  "width: 100%;" +
  "height: 100%;" +
  "background-color: #fcca66;" +
  "border-style: solid;" + 
  "border-radius: 50%;" ;
clockFrame.style.borderWidth = CLOCK_FRAME_WIDTH + "px";
clockFrame.style.borderColor = CLOCK_FRAME_COLOR;

var clockHourHand = document.createElement("div");
clockHourHand.style.position = "absolute";
clockHourHand.style.top = HOUR_HAND_TOP;
clockHourHand.style.bottom = (parseInt("100%") / 2 - parseInt(HANDS_BOTTOM_OFFSET_FROM_ORIGIN)) + "%";
clockHourHand.style.left = (parseInt("50%") - parseInt(HOUR_HAND_WIDTH)/2) + "%";
clockHourHand.style.width = HOUR_HAND_WIDTH;
clockHourHand.style.borderRadius = HAND_BORDER_RADIUS;
clockHourHand.style.backgroundColor = HOUR_HAND_COLOR;
clockHourHand.style.transformOrigin = HANDS_X_ORIGIN + " " + HANDS_Y_ORIGIN;
clockHourHand.style.transform = "rotateZ(0deg)";
clockHourHand.style.zIndex = "11";

var clockMinuteHand = clockHourHand.cloneNode();
// перепишем необходимые свойства
clockMinuteHand.id = "minuteHand";
clockMinuteHand.style.width = MINUTE_HAND_WIDTH;
clockMinuteHand.style.top = MINUTE_HAND_TOP;
clockMinuteHand.style.left = (parseInt("50%") - parseInt(MINUTE_HAND_WIDTH)/2) + "%";
clockMinuteHand.style.backgroundColor = MINUTE_HAND_COLOR;
clockMinuteHand.style.transform = "rotateZ(0deg)";
clockMinuteHand.style.zIndex = "10";

// присоединим стрелки к часам
clockFrame.appendChild(clockHourHand);
clockFrame.appendChild(clockMinuteHand);
container.appendChild(clockFrame);

// настройка шрифта для номеров
var inlineStyleSheet = document.styleSheets[0];
inlineStyleSheet.insertRule('.clockHour { font-family: Consolas, monospace; font-size: 5vmin; }', 0)

var clockHour = document.createElement("div");
clockHour.className = "clockHour";
clockHour.style.position = "absolute";
clockHour.style.width = NUMBER_PLACE_HEIGHT;
clockHour.style.height = NUMBER_PLACE_WIDTH;
clockHour.style.backgroundColor = "#48b382";
clockHour.style.borderRadius = "50%";
clockHour.style.color = "#2b2a29";
var clockHourLineHeight = NUMBER_PLACE_HEIGHT;
for (var i=1; i<=4; i++) {
  var currHour = clockHour.cloneNode();
  currHour.innerHTML = "<span>" + i + "</span>";
  var topLeftCoordinates = calcClockHourPosition(i, HOUR_STEP_ANGLE, CLOCK_RADIUS);
  currHour.style.left = CLOCK_RADIUS + topLeftCoordinates.x.round3() + "px"; // round3() добавленный прототипу Number метод
  currHour.style.top = topLeftCoordinates.y.round3() + "px";
  currHour.style.textAlign = "center";
  currHour.style.lineHeight = clockHourLineHeight;
  clockFrame.appendChild(currHour);
  currHour.style.transform = "translateX(-50%)";

}

function calcClockHourPosition(hourNumber, oneHourAngle, rad) {
  // угол между начальным (0 или 12) часом и i-тым часом
  var alpha = hourNumber * oneHourAngle; // угол поворота стрелки в градусах

  // x-координата
  var x = rad * Math.sin(alpha.toRad()); // toRad() добавленный прототипу Number метод

  // y-координата 
  var y = rad - Math.sqrt(rad*rad - x*x);

  // корректировка Y для углов от 45 до 90
  if ( 90 < alpha && alpha <= 180 ) {
    y = rad + rad - y; // жуть
  
  }

  return {x: x, y: y};
}




//container.appendChild(clockFrame);



// var tmr = setInterval(function() {
//   angle += 20 % 360;
//   arrow.style.transform = "rotateZ(" + angle + "deg)";
// }, 500);

// setTimeout(function() { clearInterval(tmr) }, 5000);