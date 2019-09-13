function tennisSVG() {
    "use strict";
    var scoreBar = document.getElementById("scoreBar"); // табло
    var container = document.getElementById("container"); // контейнер для поля

    var startButton = document.getElementById("start").children[0]; // контейнер для кнопки
    startButton.focus(); // удобно запускать
    startButton.onclick = loop;

    var SVGNS = "http://www.w3.org/2000/svg";
    var params; // хэш с атрибутами для передачи в функцию создания SVG элемента
    // Признак забившего игрока. Будет использоваться как ключ в хэше информации о голе
    var PLAYER1_FLAG = "player1";
    var PLAYER2_FLAG = "player2";
    var CONTAINER_COLOR = "green";
    var BALL_COLOR = "red";
    var DEFAULT_RACKET_COLOR = "white";
    var PLAYER1_RACKET_COLOR = "black";
    var PLAYER2_RACKET_COLOR = "blue";

    // параметры для поля
    var stageH = {
        width: 300,
        height: 160,
        color: "yellow",
        borderColor: "black",
        borderWidth: 2,
        x: 30, // смещение от краев родительского контейнера
        y: 10
    };

    // параметры для мяча
    var ballH = {
        radius: 5,
        color: BALL_COLOR
    };

    // параметры для ракеток
    var racketH = {
        isLeft: null,
        width: 10,
        length: 30,
        cornerRadius: 5,
        offset: 0, // отступ от края поля
        color: DEFAULT_RACKET_COLOR
    };

    // настройка контейнера для теннисного поля
    var contWidth = (stageH.x + stageH.borderWidth)*2 + stageH.width;
    var contHeight = (stageH.y + stageH.borderWidth)*2 + stageH.height;
    container.setAttribute("width", contWidth);
    container.setAttribute("height", contHeight);
    container.style.backgroundColor = CONTAINER_COLOR;

    // табло и контейнер кнопки "старт" выравниваю по ширине с контейнером поля
    scoreBar.style.cssText = "width: " + ((stageH.x + stageH.borderWidth)*2 + stageH.width) + "px; " +
                            "height: 2em; color: white; text-align: center; font: 1em/2em serif;";
    var buttonDiv = startButton.parentNode;
    buttonDiv.style.width = (stageH.x + stageH.borderWidth)*2 + stageH.width + "px";
    buttonDiv.style.paddingTop = "0.5em";
    buttonDiv.style.textAlign = "center";

    function getRandomSpeed(absMin, absMax) {
        // возвращает случайное число со случайно определенным знаком
        function getRandomInt(min, max) {
            // возвращает случайное число
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var speedValue = getRandomInt(absMin, absMax);
        return speedValue * (1 - 2 * Math.round(Math.random())) 
    }

    function createSvgElem(doc, ns, elemName, params) {
        var newElem = doc.createElementNS(ns, elemName);
        params = params || {};
        for (var k in params) {
            newElem.setAttribute(k, params[k]);
        }
        return newElem;
    }
    
    function DomStage(paramsH) {
        this.left = paramsH.x; // координаты верхнего левого угла теннисного поля относительно svg#container
        this.top = paramsH.y;
        this.right = this.left + paramsH.width; // координаты нижнего правого угла теннисного поля относительно svg#container
        this.bottom = this.top + paramsH.height;
        this.domElem = null; // ссылка на DOM-элемент, представляющий объект "теннисное поле"
        // this.fill = paramsH.color;
        // this.stroke = paramsH.borderWidth
        this.childrenHash = { ball: null, rackets: [], scoreBar: null }; // хэш дочерних объектов
        this.parentElem = null; // ссылка на родительский элемент (svg#container)
        this.scoreHash = {}; // сюда будет записываться игрок, забивший гол
        this.getStageStyle = function() {
            return {
                fill: paramsH.color,
                strokeColor: paramsH.borderColor,
                strokeWidth: paramsH.borderWidth
            }
        }
        this.updateStage = function(){
            // вызывает метод "update" (при наличии) у всех объектов из хэша дочерних объектов
            for (var key in this.childrenHash) {
                var currentTennisObject = this.childrenHash[key];
                if ( Array.isArray(currentTennisObject) ) {     
                    Array.prototype.forEach.call(currentTennisObject, function(item){
                        if (item.update) item.update(); 
                    });
                } else if ( this.childrenHash.hasOwnProperty(key) && currentTennisObject.update) {
                    currentTennisObject.update();
                }
            }
        };
        this.render = function(doc,container) { // ссылки на document и внутри чего рендерить объект
            this.parentElem = container;
            var stageStyle = this.getStageStyle();
            var stageX = this.left - stageStyle.strokeWidth/2;
            var stageY = this.top - stageStyle.strokeWidth/2;
            var stageWidth = this.right - this.left + stageStyle.strokeWidth;
            var stageHeight = this.bottom - this.top + stageStyle.strokeWidth;
            // создание svg-поля
            params = {
                x: stageX, y: stageY,
                width: stageWidth, height: stageHeight,
                fill: stageStyle.fill,
                stroke: stageStyle.strokeColor, "stroke-width": stageStyle.strokeWidth
            };
            var stageElem = createSvgElem(doc, SVGNS, "rect", params);
            this.domElem = stageElem;
            // добавляем на страницу svg-поле
            container.appendChild(stageElem);
        };
    }


    function DomBall(paramsH) {
        this.radius = paramsH.radius;
        this.x = null; // текущие координаты центра мяча _относительно поля_
        this.y = null;
        this.startX = null; // начальные координаты любого вбрасывания
        this.startY = null;
        this.vx = getRandomSpeed(2, 3); // генерируются случайные значения (в пределах разумных) при запуске 
        this.vy = 2;
        this.fill = paramsH.color;
        this.domElem = null; // ссылка на DOM-элемент, представляющий данный объект "мяч"
        this.isStopped = true; // на старте (как и в момент гола) мяч будет неподвижен
/* ?        this.parentObj = null; // ссылка на родительский объект(поле), */
        // нужна для доступа к координатам поля относительно #container
        // и доступа к его ссылке на общий родительский элемент (svg#container)

        this.render = function(doc,stageObj) {
/* ?            this.parentObj = stageObj; */
            this.startX = Math.round( (stageObj.left + stageObj.right) / 2) ; // координаты центра поля
            this.startY = Math.round( (stageObj.top + stageObj.bottom) / 2) ;
            this.x = this.startX; // актуализируем координаты мяча
            this.y = this.startY;
            // создание svg-мяча
            params = {
                cx: this.startX, cy: this.startY, r: this.radius,
                fill: this.fill
            };
            var ballElem = createSvgElem(doc, SVGNS, "circle", params);
            this.domElem = ballElem;
            stageObj.parentElem.appendChild(ballElem); // присоединили мяч к родителю stageObj -- DOM-элементу svg#container
            stageObj.childrenHash.ball = this; // и занесли мяч в хэш дочерних объектов родительскому объекту stageObj
        };
        this.calcPosition = function() {
            this.x += this.vx;
            this.y += this.vy;
        };
        this.toStart = function() { // функция отвечает за "вбрасывание" мяча в центре поля
            // при первом вбрасывании направление выбирается случайным образом
            // при создании объекта мяч
            // в дальнейшем, направление всегда в сторону последнего пропустившего
            this.isStopped = false; // мяч меняет состояние на "движущийся"
            this.x = this.startX;
            this.y = this.startY;
            // случайно изменим вертикальное направление мяча
            this.vy = getRandomSpeed(1, 3);
            this.domElem.setAttribute("cx", this.startX);
            this.domElem.setAttribute("cy", this.startY);

        };
        this.update = function() {
            this.domElem.setAttribute("cx", Math.round(this.x));
            this.domElem.setAttribute("cy", Math.round(this.y));
        };
    }


    function Score() {
        this.p1 = 0; // состояние очков по каждому игроку
        this.p2 = 0;
        this.domElem = null;
        this.render = function(doc,elemRef) {
            var scoreSpan = doc.createElement("span");
            var player1Span = doc.createElement("span");
            player1Span.style.cssText = "display: inline-block; width: calc(50% - 5ex)";
            var player2Span = player1Span.cloneNode();
            scoreSpan.textContent = this.p1 + " : " + this.p2; // текст начального счета
            player1Span.textContent = "Игрок 1";
            player2Span.textContent = "Игрок 2";
            elemRef.appendChild(player1Span); // показываем счет
            elemRef.appendChild(scoreSpan);
            elemRef.appendChild(player2Span);
            this.domElem = scoreSpan; // ссылка на элемент в DOM, представляющий данный объект
        };
        this.setScore = function(scorer) { // начисление балла за забитый мяч
            if (scorer === PLAYER1_FLAG)
                this.p1 += 1;
            else if (scorer === PLAYER2_FLAG)
                this.p2 += 1;
        };
        this.update = function() { // отобразить текущий счет на табло
            this.domElem.innerHTML = this.p1 + " : " + this.p2;
        };
    }

    
    function Racket(paramsH) {
        this.isLeft = paramsH.isLeft;
        this.width = paramsH.width;
        this.height = paramsH.length;
        this.cornerRad = paramsH.cornerRadius;
        this.baseVy = 2; // скорость движения ракетки
        this.vy = 0; // актуальная скорость движения ракетки
        this.fill = paramsH.color;
        this.offset = paramsH.offset; // отступ от края поля (в долях от ширины поля)
        this.x = 0; // координаты ракетки 
        this.y = 0;
        this.stepValue = 5;
        this.domElem = null;
        this.upStop = null;
        this.downStop = null;
    }

    Racket.prototype.render = function(doc,stageObj) {
        // отступ поля от левого края svg#container (+) доля от ширины поля (-) половина ширины ракетки
        var posX = stageObj.left + Math.floor( (stageObj.right - stageObj.left) * this.offset - this.width/2 );
        // вертикальный отступ поля от контейнера (+) отступ ракетки от края поля (-) половина ширины ракетки
        var posY = stageObj.top + Math.floor((stageObj.bottom -stageObj.top - this.height)/2);
        // устанавливаем координаты ракетки в стартовые
        this.x = posX;
        this.y = posY;
        // вычисляем гараницы перемещения ракетки
        this.upStop = stageObj.top;
        this.downStop = stageObj.bottom - this.height;

        // создание svg-ракетки
        params = {
            x: this.x, y: this.y,
            width: this.width, height: this.height,
            fill: this.fill,
        };
        if (this.cornerRad) { // закругленные углы
            params.rx = this.cornerRad;
            params.ry = this.cornerRad;
        }
        var racketElem = createSvgElem(doc, SVGNS, "rect", params);
        this.domElem = racketElem;
        // присоединияем мяч к родителю stageObj -- DOM-элементу svg#container
        stageObj.parentElem.appendChild(racketElem);
        // и заносим ракетку в хэш дочерних объектов в список ракеток (у объекта "поле")
        stageObj.childrenHash.rackets.push(this);
    };

    Racket.prototype.setSpeed = function(direction) {
        this.vy = this.baseVy * direction;
    };

    Racket.prototype.isOutOfBounds = function() {
        var newYpos = this.y + this.vy;
        return newYpos < this.upStop || newYpos > this.downStop;
    };

    Racket.prototype.update = function() {
        if (this.isOutOfBounds()) {
            if (this.y > this.height) // ракетка не у верхнего края поля
                this.y = this.downStop; // прибиваю вплотную к низу
            else
                this.y = this.upStop; // прибиваю вплотную к верху
        
            this.domElem.setAttribute("y", this.y);
                //this.domElem.style.top = this.y + "px";
            return; // не выходить за пределы поля
        }
        this.y += this.vy;
        this.domElem.setAttribute("y", this.y);
    };

    var tStage = new DomStage(stageH);    // создадим поле
    tStage.render(document, container);   // и отобразим

    var tBall = new DomBall(ballH);       // мяч
    tBall.render(document, tStage);

    var tRacketLeft = new Racket(racketH);    // ракетка 1
    tRacketLeft.isLeft = true;
    tRacketLeft.offset = 5/100; // отступ ракетки 5% от ширины поля
    tRacketLeft.fill = PLAYER1_RACKET_COLOR;
    tRacketLeft.render(document, tStage);
    
    var tRacketRight = new Racket(racketH);   // ракетка 2
    tRacketRight.isLeft = false;
    tRacketRight.offset = 95/100; // отступ ракетки 5% от ширины поля
    tRacketRight.fill = PLAYER2_RACKET_COLOR;;

    tRacketRight.render(document, tStage);

    /*
    * УПРАВЛЕНИЕ РАКЕТКАМИ
    */
    window.addEventListener("keydown", keyPressed, false); // слушаем нажатие клавиш управления
    window.addEventListener("keyup", keyReleased, false); // слушаем отпускание клавиш управления
    var rightIsMoving = false; // инициализация признаков движения ракеток
    var leftIsMoving = false; 

    function keyPressed(EO) {
        EO=EO||window.event;
        var pressedChar=getKeyboardChar(EO);
        if (leftIsMoving && rightIsMoving)
            return;
        if ( !rightIsMoving ) {             // если ракетка не движется
            if ( pressedChar === 40 ) {        // downArrow
                EO.preventDefault();
                tRacketRight.setSpeed(1);       // 1 или -1 определяет вектор движения согласно клавише
            } else if ( pressedChar === 38 ) {    // upArrow
                EO.preventDefault();
                tRacketRight.setSpeed(-1);
            }
        }
        // без else - ракетки двигаются незваисимо
        if ( !leftIsMoving ) { 
            if ( pressedChar === 17 )  {       // ctrl
                EO.preventDefault();
                tRacketLeft.setSpeed(1);
            } else if ( pressedChar === 16 ) {   // shift
                EO.preventDefault();
                tRacketLeft.setSpeed(-1);
            }
        }
    } // end keyPressed()
    
    function getKeyboardChar(EO) {
        if ( EO.which==null ) // IE
            return EO.keyCode;
        if ( EO.which!=0 && EO.keyCode!=0 )  // остальные браузеры
            return EO.which;
    }

    function keyReleased(EO) {
        EO=EO||window.event;
        var releasedChar=getKeyboardChar(EO);
        if ( releasedChar === 40 || releasedChar === 38 ) {
            EO.preventDefault();
            tRacketRight.setSpeed(0); // останавливаем ракетку
            rightIsMoving = false; // выставляем флаг
        }
        // без else - ракетки двигаются незваисимо
        if ( releasedChar === 17 || releasedChar === 16 ) {
            EO.preventDefault();
            tRacketLeft.setSpeed(0); // останавливаем ракетку
            leftIsMoving = false; // выставляем флаг
        }
    }


    // ОБЪЕКТ ТАБЛО СО СЧЕТОМ
    var tScore = new Score();             
    tScore.render(document, scoreBar);

    // так как табло не рендирилось внутри контейнера,
    // отдельно добавляю в связанные объекты для "теннисного поля" объект "табло"
    tStage.childrenHash.scoreBar = tScore;

    
    function checkBounces(stage) {
        // на каждом шаге цикла функция проверяет координаты
        // мяча и границ поля и обновляет атрибут "объект столкновений" у объекта "поле"

        function isTopBounce(theBall, theStage) {
            return theBall.y - theBall.radius <= theStage.top;
        }

        function isBottomBounce(theBall, theStage) {
            return theBall.y + theBall.radius >= theStage.bottom;
        }

        function isRacketAxisCrossing(theBall, theRacket) {
            return  Math.abs(theBall.x - theBall.radius - theRacket.x) <= theRacket.width;
        }

        function isFrontRacketBounce(theBall, theRacket) { // ссылки на мяч и ракетку
            return  theBall.y + theBall.radius >= theRacket.y + theRacket.cornerRad &&
                    theBall.y - theBall.radius <= theRacket.y + theRacket.height - theRacket.cornerRad ; 
        }

        function isRacketCornerBounce(theBall, theRacket) {
            // разница x-координат центра мяча и вертикальной оси ракетки
            var deltaX = Math.abs(theBall.x - ( theRacket.x + theRacket.width/2));
            // разница y-координаты центра мяча и y-координаты центра закругления края ракетки
            var deltaY = (theBall.y < theRacket.y) ?
                        Math.abs(theBall.y - (theRacket.y + theRacket.cornerRad)) // мяч над ракеткой
                        :
                        Math.abs(theBall.y - (theRacket.y + theRacket.height - theRacket.cornerRad)) // мяч под ракеткой;
            // корень из суммы квадратов deltaX и deltaY это расстояние, равное
            // сумме радиусов мяча и закругленного края ракетки, когда мяч прилегает к ракетке
            var currentCentersDistance = Math.round(Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2)));
            var minCentersDistance = theBall.radius + theRacket.cornerRad;
            return minCentersDistance >= currentCentersDistance;
        }

        function isLeftBounce(theBall, theStage) {
            return theBall.x - theBall.radius <= theStage.left; // мяч у левой стенки
        }

        function isRightBounce(theBall, theStage) {
            return theBall.x + theBall.radius >= theStage.right; // мяч у правой стенки
        }

        // Начало проверок на столкновение мяча с объектами тениса
        var racketBounce = false; // не проверять столкновение с голевой стеной если true

        var ball = stage.childrenHash.ball;
        var racketsArr = stage.childrenHash.rackets;
        
        if ( isTopBounce(ball, stage) ) {
            ball.vy = -ball.vy;
            ball.y = stage.top + ball.radius;
        } else if ( isBottomBounce(ball, stage) ) { // else if так как события несовместные
            ball.vy = -ball.vy;
            ball.y = stage.bottom - ball.radius;
        }

        // практически мяч может находиться в углу между ракеткой и горизонтальной стороной поля,
        // касаясь при этом обеих
        for (var i=0; i<racketsArr.length; i++) {
            if ( isRacketAxisCrossing(ball, racketsArr[i]) ) {
                // возможен отскок от ракетки, начинаем сложные проверки
                if ( isFrontRacketBounce(ball, racketsArr[i]) ) {
                    ball.vx = -ball.vx; // для любой ракетки вектор по оси Х меняется на противоположный
                    racketBounce = true;
                    if (!racketsArr[i].isLeft) // мяч отбивает правая ракетка
                        ball.x = racketsArr[i].x - ball.radius;
                    else // мяч отбивает левая ракетка
                        ball.x = racketsArr[i].x + tRacketLeft.width + ball.radius;
                    break; // только одна ракетка может отбивать мяч в конкретный момент
                } else if ( isRacketCornerBounce(ball, racketsArr[i]) ) {
                    // оба вектора меняются на противоположный
                    ball.vx = -ball.vx;
                    ball.vy = -ball.vy;
                    // TODO позиционировать!
                    break; // только одна ракетка может отбивать мяч в конкретный момент
                }

            }
        }

        // надо ли проверять забитый гол
        if (racketBounce)
            return;

        // проверяем на касание стенки за ракеткой
        if ( isRightBounce(ball, stage) ) {
            ball.x = stage.right - ball.radius;
            // вектор скорости не меняется
            // после зачисления балла мяч будет разводиться в сторону проигравшего
            stage.scoreHash[PLAYER1_FLAG] = true;
        } else if ( isLeftBounce(ball, stage)) {
            ball.x = stage.left + ball.radius;
            // вектор скорости не меняется
            // после зачисления балла мяч будет разводиться в сторону проигравшего
            stage.scoreHash[PLAYER2_FLAG] = true;
        }

    } // end checkBounce()


    function getScorer(hash){
        // для определения были ли добавлены ключи в голевой хэш
        // голевой хэш обнуляется
        var scorer;
        for (var key in hash) {
            if (hash.hasOwnProperty(key)) {
                scorer = key;
                delete hash[key];
                return scorer;
            }   
        }
        return null;
    }

    function loop() {
        var startButton = this;
        startButton.focus(); // удобно перезапускать
        var stageObj = tStage;
        var ball = stageObj.childrenHash.ball;
        if (!ball.isStopped) // не применять к движущемуся мячу
            return; 
        // приводим мяч в движение из стартовой точки
        // в направлении от последнего забившего
        ball.toStart();
        startButton.disabled = true; // деактивировал кнопку старт
        startButton.blur(); // без клика второй раз еще где-либо кроме кнопки "start"
        // в Firefox не было реакции на нажатие клавиш управления   
        calcFrame(); // запуск
        function calcFrame() {
            requestAnimationFrame(function(){
                ball.calcPosition();
                checkBounces(stageObj);
                var scorer = getScorer(stageObj.scoreHash);
                if ( scorer ) {
                    tStage.childrenHash.scoreBar.setScore(scorer);
                    stageObj.updateStage();
                    ball.isStopped = true; // гол, мяч остановить
                    startButton.disabled = false; // кнопка старт "активна"
                    startButton.focus(); // удобно перезапускать с клавиатуры
                    return;
                }
                stageObj.updateStage(); // вызывает метод update (при наличии) у всех дочерних элементов поля
                calcFrame(); // зацикливаем анимацию
            });
        }
    }
}