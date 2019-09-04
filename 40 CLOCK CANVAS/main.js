"use strict";

window.addEventListener('DOMContentLoaded', eventDOMLoaded, false);


function eventDOMLoaded() {
    // domClockBuilder();
    // svgClockBuilder();
    canvasClockBuilder();
}


function setClockParams() {
    // передача параметров для построения часов
    // ДИАМЕТР ЧАСОВ - БАЗОВЫЙ РАЗМЕР для остальных элементов.
    // Также, варьируя значение CLOCK_DIAMETER в пределах 0..1 
    // можно масштабировать часы внутри холста
    var CLOCK_DIAMETER = 0.9;
    // При вычислении абсолютных величин параметров будет вычисляться
    // произведение возвращаемых функцией дробных коэффициентов и реальной ширины холста 
    var CLOCK_FRAME_RADIUS = CLOCK_DIAMETER / 2;
    var CLOCK_FRAME_WIDTH = CLOCK_FRAME_RADIUS * 0.1;
    var CLOCK_RADIUS = CLOCK_FRAME_RADIUS - CLOCK_FRAME_WIDTH;
    var HOURS = 12;
    var TIME_FORMAT = 24;
    var LCD_HEIGHT = CLOCK_RADIUS * 0.15;
    var LABEL_RADIUS = CLOCK_RADIUS * 0.1;
    var LABEL_OFFSET = CLOCK_RADIUS * 0.1;

    return {
        /* РАДИУСЫ */
        clock: {
            CLOCK_DIAMETER: CLOCK_DIAMETER,
            CLOCK_FRAME_RADIUS: CLOCK_FRAME_RADIUS,
            CLOCK_RADIUS: CLOCK_RADIUS,
            CLOCK_COLOR_FRAME: "orange",
            CLOCK_COLOR: "#fcca66"
        },
        /* "ЦИФРОВОЕ" ТАБЛО */
        lcd: {
            LCD_WIDTH: CLOCK_RADIUS * 0.6,
            LCD_HEIGHT: LCD_HEIGHT,
            LCD_FRAME_WIDTH: CLOCK_RADIUS * 0.05,
            LCD_BOTTOM: CLOCK_RADIUS * 0.5,
            LCD_TIME_FORMAT: TIME_FORMAT,
            LCD_FONT_SIZE: LCD_HEIGHT * 0.8, // 80% от LCD_HEIGHT
            LCD_FONT_COLOR: "#2b2a29",
            LCD_COLOR: "white"
        },
        /* ЦИФЕРБЛАТ */
        label: {
            LABEL_COUNT: HOURS,
            LABEL_STEP: 360/HOURS,
            LABEL_RADIUS: LABEL_RADIUS, // радиус отметки часа
            LABELS_OFFSET_RADIUS: CLOCK_RADIUS - LABEL_OFFSET - LABEL_RADIUS, // радиус циферблата
            LABEL_FONT_SIZE: LABEL_RADIUS * 1.4, // 60% от LABELS_RADIUS
            LABEL_COLOR: "#48b382",
            LABEL_FONT_COLOR: "#2b2a29"
        },
        /* ПАРАМЕТРЫ СТРЕЛОК */
        hands: {
            HAND_HOUR_WIDTH: CLOCK_RADIUS * 0.08,
            HAND_MINUTE_WIDTH: CLOCK_RADIUS * 0.06,
            HAND_SECOND_WIDTH: CLOCK_RADIUS * 0.03,
            HAND_HOUR_LENGTH: CLOCK_RADIUS * 0.6,
            HAND_MINUTE_LENGTH: CLOCK_RADIUS * 0.7,
            HAND_SECOND_LENGTH: CLOCK_RADIUS * 0.8,
            HAND_TALE_LENGTH: CLOCK_RADIUS * 0.15,  // "хвост" стрелки (вылет за ось вращения)
            HAND_HOUR_COLOR: "rgba(0,10,30,0.8)",
            HAND_MINUTE_COLOR: "rgba(0,10,30,0.8)",
            HAND_SECOND_COLOR: "rgba(0,10,30,0.8)",
            HAND_ROUND_LINECAP: true // закругленный край стрелок
        }
    }
};


function canvasClockBuilder() {

    var theCanvas = document.querySelector("#canvasWrapper canvas");
    if (!theCanvas || !theCanvas.getContext) {
        return;
    }

    var context = theCanvas.getContext("2d");
    var bgColor = window.getComputedStyle(document.body).getPropertyValue("background-color");

    // установка у элемента canvas атрибутов с размерами
    setCanvasRect(theCanvas);
    // "оживляем" часы
    clockTicTimer();
    

    function setCanvasRect(canvas) {
        canvas.setAttribute("width", canvas.clientWidth);
        canvas.setAttribute("height", canvas.clientHeight);
    }


    function clockTicTimer() {
        var dispalyTimeMSec = new Date().getMilliseconds();
        drawCanvasClock(context);  
        setTimeout(clockTicTimer, 1000 - dispalyTimeMSec + 10); // +10 мсек на калибровку    
    };


    function drawCanvasClock(ctx) {
        var params = setClockParams();
        var canvasWidth = ctx.canvas.width; // ! Базовый размер для вычисления всего остального
        var canvasHeight = ctx.canvas.height; // можно было обойтись только шириной, но оставил для ясности 
        var center = canvasWidth/2;
        var x, y, radius, width, height, x2, y2;

        ctx.resetTransform();
        ctx.fillStyle = bgColor; // фон родительского элемента холста
        // "очистка" холста
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        /* ==================   "МОДЕЛЬ" часов   ===================== */
        var hour, min, sec;
        var secAngle, minuteAngle, hourAngle;
        // для прорисовки стрелок вычислим углы по текущему времени
        var currTime = new Date();
        hour = currTime.getHours();
        hour = (hour < 12) ? "AM " + (hour % 12) : "PM " + (hour % 12);
        min = currTime.getMinutes();
        min = (min < 10) ? "0" + min : min;
        sec = currTime.getSeconds();
        sec = (sec < 10) ? "0" + sec : sec;

        var timeInSeconds = currTime.getMilliseconds() / 1000 +
                            currTime.getSeconds() +
                            currTime.getMinutes() * 60 +
                            currTime.getHours() * 60 * 60;

        var secPerMinute = 60;
        var secPerHour = 60 * 60;
        var secPer12Hours = 60 * 60 * 12;
        secAngle = (360 * (timeInSeconds % secPerMinute) / secPerMinute);
        minuteAngle = (360 * (timeInSeconds % secPerHour) / secPerHour);
        hourAngle = (360 * (timeInSeconds % secPer12Hours) / secPer12Hours);

        // хэш с параметрами обогатим данными о времени и углах стрелок
        params.lcd.timeString24 = currTime.toLocaleTimeString();
        params.lcd.timeString12 = [hour, min, sec].join(":");
        params.hands.angles = {
            hourAngle: hourAngle,
            minuteAngle: minuteAngle,
            secAngle: secAngle
        };

        /* ================================================================= */

        // обводка для рамки часов и циферблата
        var strokeWidth = 2;
        if ( parseInt(theCanvas.getAttribute("width")) < 400 ) {
            strokeWidth = 1;
        }
        ctx.strokeStyle = "black";
        ctx.lineWidth = strokeWidth;

        // вызываем функции, рисующие элементы часов
        clockFrame(params.clock); // внешний круг (рамка часов)
        clockFace(params.clock); // внутренний круг (циферблат)
        hourLabels(params.label); // круги с часовыми отметками
        lcd(params.lcd); // цифровое табло с временем
        hands(params.hands); // стрелки


        // функции для отрисовки элементов часов
        function clockFrame(p) {
            // arc, внешняя окружность
            x = Math.round(center);
            y = Math.round(center);
            radius = Math.round(p.CLOCK_FRAME_RADIUS * canvasWidth - ctx.lineWidth/2);
            ctx.fillStyle = p.CLOCK_COLOR_FRAME;
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
        }


        function clockFace(p) {
            // arc, внутренняя окружность
            x = Math.round(center);
            y = Math.round(center);
            radius = Math.round(p.CLOCK_RADIUS * canvasWidth);
            ctx.fillStyle = p.CLOCK_COLOR;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);       
            ctx.fill();
            ctx.stroke();
        }


        function lcd(p) {
            // rectangle, электронный дисплей
            width = Math.round(p.LCD_WIDTH * canvasWidth);
            height = Math.round(p.LCD_HEIGHT * canvasHeight);
            x = Math.round(center - width/2);
            y = Math.round(center - p.LCD_BOTTOM * canvasHeight);
            ctx.fillStyle = p.LCD_COLOR;
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            // покажем время
            // координаты центра 
            x += width/2;
            y += height/2 + strokeWidth/2;
            ctx.fillStyle = p.LCD_FONT_COLOR;
            ctx.font = Math.round(p.LCD_FONT_SIZE * canvasWidth) + "px Calibri";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var timeString = (p.LCD_TIME_FORMAT === 24) ? p.timeString24 : p.timeString12;
            ctx.fillText(timeString, x, y);
        }


        function hourLabels(p) {
            // метка для часа
            ctx.font = Math.round(p.LABEL_FONT_SIZE * canvasWidth) + "px Calibri";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // радиус метки 
            radius = Math.round(p.LABEL_RADIUS * canvasWidth);

            var rotateOrigin = center; // центр будем менять отдельно от глобального центра холста
            ctx.translate(rotateOrigin, rotateOrigin);
            // центр вращения теперь в начале координат
            rotateOrigin = 0;
            var labelAngle = p.LABEL_STEP * Math.PI / 180; // в радианах;
            for (var i=1; i <= p.LABEL_COUNT; i++ ) {
                // задаем координаты центра очередной отметки часа
                x = Math.round(rotateOrigin);
                y = Math.round(rotateOrigin - p.LABELS_OFFSET_RADIUS * canvasWidth);
                // поворачиваем контекст на одну и ту же 1/12 от 360 град
                ctx.rotate(labelAngle); 
                // цвет отметок
                ctx.fillStyle = p.LABEL_COLOR;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.stroke();
                // запоминаем повернутый контекст с началом координат в центре часов
                ctx.save();
                // смещаем контекст в координаты центра метки (там же будет центр числа)
                ctx.translate(x,y);
                // Поворотом вокруг центра метки против часовой
                // компенсируем поворот по часовой всей метки вокруг центра часов
                // ЧТОБЫ ТЕКСТ В МЕТКЕ БЫЛ ВЫРОВНЕН ВЕРТИКАЛЬНО
                ctx.rotate(-labelAngle * i);
                // добавляем текст
                ctx.fillStyle = p.LABEL_FONT_COLOR;
                // rotateOrigin = 0 актуален для координат текста (0, 0)
                ctx.fillText(i, rotateOrigin, rotateOrigin);
                // восстанавливаем ПОВЕРНУТЫЙ контекст с центром в начала координат
                ctx.restore();
            }
            // сброс матрицы трансформаций контекста
            ctx.setTransform(1,0,0,1,0,0);
        }
        

        function hands(p) {
            // line, стрелка часов
            var rotateOrigin = center; // центр будем менять отдельно от глобального центра холста
            // форма конца линии 
            ctx.lineCap = (p.HAND_ROUND_LINECAP) ? "round" : "square";
            
            // // координаты начала стрелок
            // x = Math.round(center);
            // y = Math.round(center + p.HAND_TALE_LENGTH * canvasHeight);
            
            // ставим начало координат контекста в центр
            ctx.translate(rotateOrigin, rotateOrigin);
            // центр вращения теперь в начале координат
            rotateOrigin = 0;
            // сейчас можно задать координаты для построения всех стрелок
            // координаты начала стрелок
            x = Math.round(rotateOrigin);
            y = Math.round(rotateOrigin + p.HAND_TALE_LENGTH * canvasHeight);

            // координаты часовой стрелки ()
            var xH = Math.round(rotateOrigin);
            var yH = Math.round(rotateOrigin - p.HAND_HOUR_LENGTH * canvasWidth);
            // координаты минутной стрелки
            var xM = Math.round(rotateOrigin);
            var yM = Math.round(rotateOrigin - p.HAND_MINUTE_LENGTH * canvasWidth);
            // координаты секундной стрелки
            var xS = Math.round(rotateOrigin);
            var yS = Math.round(rotateOrigin - p.HAND_SECOND_LENGTH * canvasWidth);

            // углы для позиционирования стрелок (в радианах)
            // часовая
            var radAngleH = (p.angles.hourAngle * Math.PI / 180);
            // минутная
            var radAngleM = (p.angles.minuteAngle * Math.PI / 180);
            // секундная
            var radAngleS = (p.angles.secAngle * Math.PI / 180);
            
            // !
            ctx.save();

            // добавляю часовую стрелку
            ctx.lineWidth = p.HAND_HOUR_WIDTH * canvasWidth;
            ctx.strokeStyle = p.HAND_HOUR_COLOR;
            ctx.rotate(radAngleH);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xH, yH);
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
            ctx.save(); // ! без этой строчки было нечего восстанавливать при следующем restore
            
            // добавляю минутную стрелку
            ctx.lineWidth = p.HAND_MINUTE_WIDTH * canvasWidth;
            ctx.strokeStyle = p.HAND_MINUTE_COLOR;
            ctx.rotate(radAngleM);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xM, yM);
            ctx.stroke();
            ctx.closePath();

            ctx.restore();

            // добавляю секундную стрелку
            ctx.lineWidth = p.HAND_SECOND_WIDTH * canvasWidth;
            ctx.strokeStyle = p.HAND_SECOND_COLOR;
            ctx.rotate(radAngleS);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xS, yS);
            ctx.stroke();
            ctx.closePath();

            // сброс матрицы
            ctx.setTransform(1,0,0,1,0,0);
        }
    }
    
    var redraw = function() {
        setCanvasRect(this.canvas);
        drawCanvasClock(this);
    }.bind(context);

    window.onresize = redraw;

};