"use strict";

// добавляем метод перевода градусы в радианы
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

// метод округления до одного разряда после точки
Number.prototype.round1 = function() {
  return Math.round(this * 10) / 10;
}

window.addEventListener("DOMContentLoaded", makeDomWatch);

function makeDomWatch(){

  // инлайн стили контейнера
  var CONTAINER_WIDTH = 100; // vmin, НЕ ПРЕДУСМАТРИВАЕТСЯ ИЗМЕНЕНИЕ!
  var CONTAINER_MARGIN = 2; // vmin

  // ширина "рамки" часов и цвет
  var CLOCK_FRAME_WIDTH = 10; // vmin
  var CLOCK_FRAME_COLOR = "#faa805";

  /*
  * ВРЕМЕННЫЕ КОНСТАНТЫ *
  */

  var HOURS_FORMAT = 12; // (12 | 24)
  var HOURS_IN_TURN = 12;
  var MINUTES_IN_HOUR = 60;
  var SECONDS_IN_MINUTE = 60;

  /*
  * Парамтры "цифрового" табло часов *
  */

  var LCD_WIDTH = 26; // vmin 
  var LCD_HEIGHT = 7; // vmin

  /*
  * ПАРАМЕТРЫ ЦИФЕРБЛАТА *
  */

  // расстояние от рамки часов до центра отметки с часом
  var NUMBERS_OFFSET = 9; // vmin

  // соотношение размера шрифта к размеру отметки с часом
  var NUMBERS_FONT_RATIO = 0.6

  /*
  * ПАРАМЕТРЫ СТРЕЛОК *
  */

  // одинаковая для всех длина "хвоста" стрелки (вылет за ось вращения)
  var TALE_LENGTH = 8; // vmin

  // одинаковая для всех X-координата оси вращения стрелки внутри координат стрелки
  var HANDS_ORIGIN_X = "50%" ;

  // одинаковые для всех радиусы границ стрелок
  var HANDS_BORDER_RADIUS = "40% 40% 30% 30% / 70% 70% 30% 30%";

  // цвета стрелок
  var HOUR_HAND_COLOR = "red";
  var MINUTE_HAND_COLOR = "black";
  var SECOND_HAND_COLOR = "green";

  // ширина стрелок
  var HOUR_HAND_WIDTH = 4; // vmin
  var MINUTE_HAND_WIDTH = 4; // vmin
  var SECOND_HAND_WIDTH = 2; // vmin

  // длина стрелок (в процентах от максимально возможной)
  var HOUR_HAND_LENGTH = .7;
  var MINUTE_HAND_LENGTH = .8;
  var SECOND_HAND_LENGTH = .9;

  // вычислим внутренний радиус часов по рамке
  var innerRadius = CONTAINER_WIDTH / 2 - CONTAINER_MARGIN - CLOCK_FRAME_WIDTH; // vmin

  // длина стрелок в vmin
  var hHandLen = HOUR_HAND_LENGTH * innerRadius; // vmin
  var mHandLen = MINUTE_HAND_LENGTH * innerRadius; // vmin
  var sHandLen = SECOND_HAND_LENGTH * innerRadius; // vmin

  // расстояние от вернего края стрелки до рамки часов
  var hourHandTop = innerRadius - (hHandLen - TALE_LENGTH) ; // vmin
  var minuteHandTop = innerRadius - (mHandLen - TALE_LENGTH) ; // vmin
  var secondHandTop = innerRadius - (sHandLen - TALE_LENGTH) ; // vmin

  // вычислим расстояние от нижнего края любой из стрелок до рамки часов
  var hourHandBottom = innerRadius - TALE_LENGTH ; // vmin
  var minuteHandBottom = innerRadius - TALE_LENGTH ; // vmin
  var secondHandBottom = innerRadius - TALE_LENGTH ; // vmin

  // вычислим Y-координату оси вращения стрелки внутри координат стрелки
  var hourHandOriginY = hHandLen - TALE_LENGTH + "vmin";
  var minuteHandOriginY = mHandLen - TALE_LENGTH + "vmin";
  var secondHandOriginY = sHandLen - TALE_LENGTH + "vmin";

  // размер отметок часов
  // экспериментально найдено соотношение 2/7 с внутренним диаметром часов
  var numbersPlaceWidth = (2 * innerRadius / 7).round1() + "vmin";

  // вычислим расстояние от центра часов до центра отметки с часом
  var numbersRadius = innerRadius - NUMBERS_OFFSET; // vmin

  // расчет угла для смены часа, минуты, секунды
  var hourStepAngle = 360 / HOURS_IN_TURN;
  var minuteStepAngle = 360 / MINUTES_IN_HOUR;
  var secondStepAngle = 360 / SECONDS_IN_MINUTE;

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
  clockHourHand.style.top = hourHandTop + "vmin";
  clockHourHand.style.bottom = hourHandBottom + "vmin";
  // поместить по центру родителя и сместить в обратном направлении на половину ширины стрелки
  clockHourHand.style.left = innerRadius - HOUR_HAND_WIDTH / 2 + "vmin";
  clockHourHand.style.width = HOUR_HAND_WIDTH + "vmin";
  clockHourHand.style.borderRadius = HANDS_BORDER_RADIUS;
  clockHourHand.style.backgroundColor = HOUR_HAND_COLOR;
  clockHourHand.style.transformOrigin = HANDS_ORIGIN_X + " " + hourHandOriginY;
  clockHourHand.style.transform = "rotateZ(90deg)";
  clockHourHand.style.zIndex = "12";
  clockHourHand.style.opacity = ".7";

  // создание минутной стрелки
  var clockMinuteHand = document.createElement("div");
  clockMinuteHand.id = "minuteHand";
  clockMinuteHand.style.position = "absolute";
  clockMinuteHand.style.top = minuteHandTop + "vmin";
  clockMinuteHand.style.bottom = minuteHandBottom + "vmin";
  clockMinuteHand.style.left = innerRadius - MINUTE_HAND_WIDTH / 2 + "vmin";
  clockMinuteHand.style.width = MINUTE_HAND_WIDTH + "vmin";
  clockMinuteHand.style.borderRadius = HANDS_BORDER_RADIUS;
  clockMinuteHand.style.backgroundColor = MINUTE_HAND_COLOR;
  clockMinuteHand.style.transformOrigin = HANDS_ORIGIN_X + " " + minuteHandOriginY;
  clockMinuteHand.style.transform = "rotateZ(90deg)";
  clockMinuteHand.style.zIndex = "10";
  clockMinuteHand.style.opacity = ".7";

  // создание секундной стрелки
  var clockSecondHand = document.createElement("div");
  clockSecondHand.id = "secondHand";
  clockSecondHand.style.position = "absolute";
  clockSecondHand.style.top = secondHandTop + "vmin";
  clockSecondHand.style.bottom = secondHandBottom + "vmin";
  clockSecondHand.style.left = innerRadius - SECOND_HAND_WIDTH / 2 + "vmin";
  clockSecondHand.style.width = SECOND_HAND_WIDTH + "vmin";;
  clockSecondHand.style.borderRadius = HANDS_BORDER_RADIUS;
  clockSecondHand.style.backgroundColor = SECOND_HAND_COLOR;
  clockSecondHand.style.transformOrigin = HANDS_ORIGIN_X + " " + secondHandOriginY;
  clockSecondHand.style.transform = "rotateZ(90deg)";
  clockSecondHand.style.zIndex = "11";
  clockSecondHand.style.opacity = ".7";

  // присоединим стрелки к часам
  clockFrame.appendChild(clockHourHand);
  clockFrame.appendChild(clockMinuteHand);
  clockFrame.appendChild(clockSecondHand);

  // создание отметок с номером часа
  var clockHour = document.createElement("div");
  clockHour.className = "clockHour";
  clockHour.style.position = "absolute";
  clockHour.style.boxSizing = "content-box";
  clockHour.style.width = numbersPlaceWidth;
  clockHour.style.height = numbersPlaceWidth;
  clockHour.style.fontSize = ( parseInt(numbersPlaceWidth) * NUMBERS_FONT_RATIO  ) + "vmin";
  clockHour.style.backgroundColor = "#48b382";
  clockHour.style.borderRadius = "50%";
  clockHour.style.borderTop = ".8vmin solid #bfa269";
  clockHour.style.borderLeft = ".8vmin solid #bfa269";
  clockHour.style.borderBottom = ".8vmin solid #fddb98";
  clockHour.style.borderRight = ".8vmin solid #fddb98";
  clockHour.style.color = "#2b2a29";
  clockHour.style.textAlign = "center";
  clockHour.style.lineHeight = numbersPlaceWidth;

  // массив с порядковывми номерами часов
  var hourNumbers = [];
  for (var i=1; i<=HOURS_IN_TURN; i++) {
    hourNumbers.push(i);
  }

  var angle = 0,
    xCoord,
    yCoord;
  hourNumbers.forEach(function(hour){
    var currHour = clockHour.cloneNode();
    currHour.innerHTML = "<span>" + hour + "</span>";
    // чтобы номера часов соответствовали углам тригонометрической окружности,
    // [1 ,2 ,3,  4,  5,  6,   7,   8,   9,  10,  11,  12]
    // [60,30,0,-30,-60,-90,-120,-150,-180,-210,-240,-270]
    // вычисляем углы по такой формуле
    angle = (HOURS_IN_TURN / 4 - hour) * hourStepAngle ;
    xCoord = Math.cos(angle.toRad())*(numbersRadius);
    yCoord = Math.sin(angle.toRad())*(numbersRadius);
    currHour.style.left = innerRadius + xCoord.round1() + "vmin";
    currHour.style.top = innerRadius - yCoord.round1() + "vmin";
    // в эти координаты будут помещены верхние левые углы div-ов,
    // а необходимо поместить туда их центры
    currHour.style.transform = "translate(-50%,-50%)";
    clockFrame.appendChild(currHour)
  })

    /* А здесь были 58 экстра-строк "тригонометрического велосипеда" */

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
  lcd.style.borderTop = ".8vmin solid #bfa269";
  lcd.style.borderLeft = ".8vmin solid #bfa269";
  lcd.style.borderBottom = ".8vmin solid #fddb98";
  lcd.style.borderRight = ".8vmin solid #fddb98";
  // так верхняя граница не портит центровку
  lcd.style.boxSizing = "content-box";
  lcd.style.left = innerRadius - LCD_WIDTH / 2 + "vmin" ;
  // табло "примерно посередине" между центром часов и числами
  lcd.style.top = (innerRadius / 1.7).round1() + "vmin";
  lcd.style.textAlign = "center"; 
  lcd.style.lineHeight = LCD_HEIGHT + "vmin";
  lcd.style.fontSize = LCD_HEIGHT * NUMBERS_FONT_RATIO + "vmin";
  lcd.innerHTML = "";

  clockFrame.appendChild(lcd);
  var container = document.getElementById("container");
  container.appendChild(clockFrame);

  /*
  * ФУНКЦИИ, ЗАПУСКАЕМЫЕ ПО ТАЙМЕРУ *
  */

  // обновляет содержимое LCD экранчика часов
  function setLCDclock(t) {
    if ( HOURS_FORMAT === 12 ) {
      lcd.innerHTML = t.timeString12;
      console.log("tik-lcd");
    } else if ( HOURS_FORMAT === 24 )
      lcd.innerHTML = t.timeString24;
  }

  // разворачивает стрелки согласно рассчитанным углам
  function setHandsPosition(t) {
    var targetAngles = getAnglesFromTime(t.current);
    clockMinuteHand.style.transform = "rotateZ(" + targetAngles.ma + "deg)";
    // часовую стрелку немного сдвигаем после смены каждой минуты
    var hourMiniStep = (targetAngles.ma / 360) * hourStepAngle;
    clockHourHand.style.transform = "rotateZ(" + (targetAngles.ha + hourMiniStep.round1()) + "deg)";
    clockSecondHand.style.transform = "rotateZ(" + targetAngles.sa + "deg)";
    console.log("tik-hands");
  }

  // вспомогательная, вызывается из setHandsPosition
  // осуществляет "перевод" значений часов, минут и секунд текущего тика в углы в градусах 
  function getAnglesFromTime(tm) {
    // вычитаю 
    var hourAngle = tm.getHours() * hourStepAngle;
    var minuteAngle = tm.getMinutes() * minuteStepAngle ;
    var secondAngle = tm.getSeconds() * secondStepAngle ;
    return {
      ha: hourAngle % 360,
      ma: minuteAngle % 360,
      sa: secondAngle % 360
    }
  }


  /*
  *   ОСНОВНОЙ "МОДУЛЬ"
  *   Принимает список функций для запуска по таймеру
  *   каждой функции из аргументов передается объект класса Date.
  * 
  *   createClockTimer возвращает хэш с функциями по управлению таймером.
  */
  function createClockTimer() {
    var operations = arguments;

    // хэш (длинноватый) с методами управления таймером
    var timerObj = {
      id: 0, // идедтификатор таймера

      time: {
        current: null, // экземпляр даты для извлечения времени
        timeString12: "", // атрибут для хранения отображаемого времени в 12ч формате
        timeString24: "", // атрибут для хранения отображаемого времени в 24ч формате
      },
      
      start: function() { //
        if (this.id) {
          console.log("Already started");
          return;
        }
        this.id = setTimeout(this.setTimerProperties.bind(this), 0);
        console.log("I'm started. Press '0' key for stop and '1' key for resume");
      },

      setTimerProperties: function() {
          var beforeTime = new Date(),
              hours = beforeTime.getHours(),
              minutes = beforeTime.getMinutes(),
              seconds = beforeTime.getSeconds();
              // минуты и секунды при необходимости дополнить слева ноликом
          var timeArray = Array.prototype.map.call([minutes, seconds], function(item) {
            if ( item < 10 )
              return "0".concat(item.toString());
            else
              return item.toString();
          });
          timeArray.unshift(hours.toString()); // добавим номер часа в начало
          // заполним данными атрибут-хэш time для передачи в функции
          this.time.timeString24 = timeArray.join(":");
          // модифицируем для 12-часового формата
          timeArray[0] = (hours < 12) ?
              "AM " + (hours % 12)
              :
              "PM " + (hours % 12);
          this.time.timeString12 = timeArray.join(":");
          this.time.current = new Date();
          // откорректируем время для отложенного вызова setTimerProperties
          var delta = this.time.current.getMilliseconds();
          // если таймер еще не был запущен - начинаем работу
          if ( this.id !== null ) {
            for (var i=0; i<operations.length; i++) {
              operations[i](this.time); // выполняем все функции
            }
            // отложенный вызов setTimerProperties
            setTimeout(this.setTimerProperties.bind(this), 1000 - delta + 10);
          }
      },

      stop: function() {
        if (this.id) {
          clearTimeout(this.id);
          this.id = null;
          console.log("I'm stopped");
          return;
        }
        console.log("Already stopped");
      }
    }
    return timerObj;
  } // createClockTimer

  // создаем таймер
  var domTimer = createClockTimer(setLCDclock, setHandsPosition);
  // запуск часов
  domTimer.start();

  // для выключения/включения таймера
  window.onkeyup = function(EO){
    EO = EO || window.event;
    switch ( EO.keyCode ) {
      case 48: // клавиша 0 останавливает таймер
      domTimer.stop()
      break;

      case 49: // клавиша 1 запускает таймер
      domTimer.start()
      break;
    }
  }

}; // makeDomWatch