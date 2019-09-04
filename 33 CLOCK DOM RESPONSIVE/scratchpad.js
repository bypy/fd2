"use strict";

var container = document.getElementById("container");
// инлайн стили у элемента id="container"
var CONTAINER_WIDTH = 100; // vmin
var CONTAINER_MARGIN = 2; // vmin

// ширина "рамки" часов и цвет
var CLOCK_FRAME_WIDTH = 10; // vmin
var CLOCK_FRAME_COLOR = "#faa805";

// внутренний радиус часов по рамке(38)
var INNER_RADIUS = CONTAINER_WIDTH / 2 - CONTAINER_MARGIN - CLOCK_FRAME_WIDTH; // vmin

/*
* ПАРАМЕТРЫ СТРЕЛОК *
*/

// одинаковая для всех длина "хвоста" стрелки (вылет за ось вращения)
var TALE_LENGTH = 8; // vmin

// одинаковая для всех X-координата оси вращения стрелки внутри координат стрелки
var HANDS_ORIGIN_X = "50%" ;

// одинаковые для всех радиусы границ стрелок
var HANDS_BORDER_RADIUS = "40% 40% 30% 30% / 70% 70% 30% 30%";

// ширина стрелок
var HOUR_HAND_WIDTH = 4; // vmin
var MINUTE_HAND_WIDTH = 4; // vmin
var SECOND_HAND_WIDTH = 2; // vmin

// длина стрелок
var HOUR_HAND_LENGTH = 28; // vmin
var MINUTE_HAND_LENGTH = 32; // vmin
var SECOND_HAND_LENGTH = 36; // vmin

// расстояние от вернего края стрелки до рамки часов
var HOUR_HAND_TOP = INNER_RADIUS - (HOUR_HAND_LENGTH - TALE_LENGTH) ; // vmin
var MINUTE_HAND_TOP = INNER_RADIUS - (MINUTE_HAND_LENGTH - TALE_LENGTH) ; // vmin
var SECOND_HAND_TOP = INNER_RADIUS - (SECOND_HAND_LENGTH - TALE_LENGTH) ; // vmin

// вычислим расстояние от нижнего края любой из стрелок до рамки часов
var HOUR_HAND_BOTTOM = INNER_RADIUS - TALE_LENGTH ; // vmin
var MINUTE_HAND_BOTTOM = INNER_RADIUS - TALE_LENGTH ; // vmin
var SECOND_HAND_BOTTOM = INNER_RADIUS - TALE_LENGTH ; // vmin

// вычислим Y-координату оси вращения стрелки внутри координат стрелки
var HOUR_HAND_ORIGIN_Y = HOUR_HAND_LENGTH - TALE_LENGTH + "vmin";
var MINUTE_HAND_ORIGIN_Y = MINUTE_HAND_LENGTH - TALE_LENGTH + "vmin";
var SECOND_HAND_ORIGIN_Y = SECOND_HAND_LENGTH - TALE_LENGTH + "vmin";

// цвета стрелок
var HOUR_HAND_COLOR = "red";
var MINUTE_HAND_COLOR = "black";
var SECOND_HAND_COLOR = "green";

/*
* ПАРАМЕТРЫ ЦИФЕРБЛАТА *
*/

// расстояние от рамки часов до центра отметки с часом
var NUMBERS_OFFSET = 7; // vmin
// диаметр отметок часов
var NUMBERS_PLACE_WIDTH = "9vmin";
 // соотношение размера шрифта к размеру отметки с часом
var NUMBERS_FONT_RATIO = 0.6

// вычислим расстояние от центра часов до центра отметки с часом
var NUMBERS_RADIUS = INNER_RADIUS - NUMBERS_OFFSET; // vmin

// ВРЕМЕННЫЕ КОНСТАНТЫ
var HOURS_FORMAT = 12;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_MINUTE = 60;

// расчет угла для смены часа, минуты, секунды
var HOUR_STEP_ANGLE = 360 / HOURS_FORMAT;
var MINUTE_STEP_ANGLE = 360 / MINUTES_IN_HOUR;
var SECOND_STEP_ANGLE = 360 / SECONDS_IN_MINUTE;

// Парамтры "цифрового" табло часов
var LCD_WIDTH = 24; // vmin 
var LCD_HEIGHT = 7; // vmin

// добавляем метод перевода градусы в радианы
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

// метод округления до одного разряда после точки
Number.prototype.round3 = function() {
  return Math.round(this * 1000) / 1000;
}

var clockFrame = document.createElement("div");
clockFrame.id = "clockFrame";
clockFrame.style.cssText =
  "position: relative;" +
  "width: 100%;" +
  "height: 100%;" +
  "background-color: #fcca66;" +
  "border-style: solid;" + 
  "border-radius: 50%;" +
  "font-family: Consolas, monospace;";
clockFrame.style.borderWidth = CLOCK_FRAME_WIDTH + "vmin";
clockFrame.style.borderColor = CLOCK_FRAME_COLOR;

// создание часовой стрелки 
var clockHourHand = document.createElement("div");
clockHourHand.id = "hourdHand";
clockHourHand.style.position = "absolute";
clockHourHand.style.top = HOUR_HAND_TOP + "vmin";
clockHourHand.style.bottom = HOUR_HAND_BOTTOM + "vmin";
// поместить по центру родителя и сместить в обратном направлении на половину ширины стрелки
clockHourHand.style.left = INNER_RADIUS - HOUR_HAND_WIDTH / 2 + "vmin";
clockHourHand.style.width = HOUR_HAND_WIDTH + "vmin";
clockHourHand.style.borderRadius = HANDS_BORDER_RADIUS;
clockHourHand.style.backgroundColor = HOUR_HAND_COLOR;
clockHourHand.style.transformOrigin = HANDS_ORIGIN_X + " " + HOUR_HAND_ORIGIN_Y;
clockHourHand.style.transform = "rotateZ(90deg)";
clockHourHand.style.zIndex = "12";

// создание минутной стрелки
var clockMinuteHand = document.createElement("div");
clockMinuteHand.id = "minuteHand";
clockMinuteHand.style.position = "absolute";
clockMinuteHand.style.top = MINUTE_HAND_TOP + "vmin";
clockMinuteHand.style.bottom = MINUTE_HAND_BOTTOM + "vmin";
clockMinuteHand.style.left = INNER_RADIUS - MINUTE_HAND_WIDTH / 2 + "vmin";
clockMinuteHand.style.width = MINUTE_HAND_WIDTH + "vmin";
clockMinuteHand.style.borderRadius = HANDS_BORDER_RADIUS;
clockMinuteHand.style.backgroundColor = MINUTE_HAND_COLOR;
clockMinuteHand.style.transformOrigin = HANDS_ORIGIN_X + " " + MINUTE_HAND_ORIGIN_Y;
clockMinuteHand.style.transform = "rotateZ(180deg)";
clockMinuteHand.style.zIndex = "10";

// создание секундной стрелки
var clockSecondHand = document.createElement("div");
clockSecondHand.id = "secondHand";
clockSecondHand.style.position = "absolute";
clockSecondHand.style.top = SECOND_HAND_TOP + "vmin";
clockSecondHand.style.bottom = SECOND_HAND_BOTTOM + "vmin";
clockSecondHand.style.left = INNER_RADIUS - SECOND_HAND_WIDTH / 2 + "vmin";
clockSecondHand.style.width = SECOND_HAND_WIDTH + "vmin";;
clockSecondHand.style.borderRadius = HANDS_BORDER_RADIUS;
clockSecondHand.style.backgroundColor = SECOND_HAND_COLOR;
clockSecondHand.style.transformOrigin = HANDS_ORIGIN_X + " " + SECOND_HAND_ORIGIN_Y;
clockSecondHand.style.transform = "rotateZ(45deg)";
clockSecondHand.style.zIndex = "11";


// присоединим стрелки к часам
clockFrame.appendChild(clockHourHand);
clockFrame.appendChild(clockMinuteHand);
clockFrame.appendChild(clockSecondHand);

var clockHour = document.createElement("div");
clockHour.className = "clockHour";
clockHour.style.position = "absolute";
clockHour.style.width = NUMBERS_PLACE_WIDTH;
clockHour.style.height = NUMBERS_PLACE_WIDTH;
clockHour.style.fontSize = ( parseInt(NUMBERS_PLACE_WIDTH) * NUMBERS_FONT_RATIO  ) + "vmin";
clockHour.style.backgroundColor = "#48b382";
clockHour.style.borderRadius = "50%";
clockHour.style.color = "#2b2a29";
clockHour.style.textAlign = "center";
clockHour.style.lineHeight = NUMBERS_PLACE_WIDTH;
for (var i=1; i<=HOURS_FORMAT; i++) {
  var currHour = clockHour.cloneNode();
  currHour.innerHTML = "<span>" + i + "</span>";
  // число часа перевожу в угол в градусах
  var angle = i * HOUR_STEP_ANGLE;
  // в зависимости от величины угла между начальным (0 или 12) часом и i-тым часом
  // фактически передаваемый функции угол расчета и использование результатов
  // будут отличаться
  // для первой четверти окружности меняем свойства top и right
  // для второй четверти окружности меняем свойства bottom и right
  // для третьей четверти окружности меняем свойства bottom и left
  // для четвертой четверти окружности меняем свойства top и left
  var xProp,
      yProp;
  // для работы с формулами прямоугольного треугольника
  // величина угла для расчета его синуса должна быть в пределах (0-90]
  if ( 0 < angle && angle <= 90 ) {
    angle = angle; // 
    xProp = "right";
    yProp = "top";
    // сейчас на месте центров чисел верхние левые углы div-ов
    // необходимо смещение
    currHour.style.transform = "translate(50%,-50%)"
  } else if ( 90 < angle && angle <= 180 ) {
    // функция, вычисляющая координаты, оперирует только синусом - поэтому:
    // раз cosA = sin(180 - A) или синусу смежного угла, то
    angle = 180 - angle; 
    xProp = "right";
    yProp = "bottom";
    currHour.style.transform = "translate(50%, 50%)"
  } else if ( 180 < angle && angle <= 270 ) {
    angle = 360 - angle; // выглядит как подгон
    xProp = "left";
    yProp = "bottom";
    currHour.style.transform = "translate(-50%,50%)" ;
  } else if ( 270 < angle && angle <= 360 ) {
    angle = 0 - angle; // но будет работать
    xProp = "left";
    yProp = "top";
    currHour.style.transform = "translate(-50%,-50%)" ;
  }
  // xy координаты от центра часов до центра часовой отметки
  var centerOffset = calcClockHourPosition(angle, NUMBERS_RADIUS);
  currHour.style[xProp] = (NUMBERS_RADIUS + NUMBERS_OFFSET - 
      centerOffset.x.round3()) + "vmin";
  currHour.style[yProp] = (NUMBERS_RADIUS + NUMBERS_OFFSET -
      centerOffset.y.round3()) + "vmin";

  clockFrame.appendChild(currHour);
}//for

function calcClockHourPosition(alpha, rad) {
   // x-координата
  var x = rad * Math.sin(alpha.toRad()); // toRad() добавленный прототипу Number метод
  // y-координата 
  var y = Math.sqrt(rad*rad - x*x);
  return {x: x, y: y}; // vmin
}

/*
* LCD дисплей *
*/
var lcd = document.createElement("div");
lcd.style.id = "lcd";
lcd.style.position = "absolute";
lcd.style.width = LCD_WIDTH + "vmin";
lcd.style.height = LCD_HEIGHT + "vmin";
lcd.style.background = "#48b382";
lcd.style.color = "#2b2a29";
lcd.style.borderTop = ".2em solid #716f6c";
// так верхняя граница не портит центровку
lcd.style.boxSizing = "content-box";
lcd.style.left = INNER_RADIUS - LCD_WIDTH / 2 + "vmin" ;
// табло посередине между центром и числами
lcd.style.top = INNER_RADIUS / 2 + "vmin";
lcd.style.textAlign = "center"; 
lcd.style.lineHeight = LCD_HEIGHT + "vmin";
lcd.style.fontSize = LCD_HEIGHT * NUMBERS_FONT_RATIO + "vmin";
lcd.innerHTML = "00:00:00";




clockFrame.appendChild(lcd);
container.appendChild(clockFrame);



// var tmr = setInterval(function() {
//   angle += 20 % 360;
//   arrow.style.transform = "rotateZ(" + angle + "deg)";
// }, 500);

// setTimeout(function() { clearInterval(tmr) }, 5000);