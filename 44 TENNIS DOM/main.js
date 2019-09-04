function tennisDOM() {
    "use strict";
    var scoreBar = document.getElementById("scoreBar"); // табло
    var container = document.getElementById("container"); // контейнер для поля
    var startButton = document.getElementById("start").children[0]; // контейнер для кнопки
    startButton.focus(); // удобно запускать
    startButton.onclick = loop;

    var PLAYER1_FLAG = "player1";
    var PLAYER2_FLAG = "player2";

    // параметры для поля
    var stageH = {
        width: 300,
        height: 160,
        fill: "yellow",
        borderColor: "black",
        borderWidth: 2,
        x: 30, // смещение от краев родительского контейнера
        y: 10
    };

    // параметры для мяча
    var ballH = {
        diameter: 10,
        // скорость
        vx: getRandomInt(2, 3) * (1 - 2 * Math.round(Math.random())), // -3, -2, 2, 3 
        vy: getRandomInt(1, 3) * (1 - 2 * Math.round(Math.random())), // -3, -2, -1, 1, 2, 3
    };

    // параметры для ракеток
    var racketH = {
        isLeft: null,
        width: 10,
        length: 30,
        offset: null, // отступ от края поля
        color: ""
    };

    // настройка контейнера для теннисного поля 
    container.style.width = (stageH.x + stageH.borderWidth)*2 + stageH.width + "px";
    container.style.height = (stageH.y + stageH.borderWidth)*2 + stageH.height + "px";
    container.style.backgroundColor = "green";
    // табло и контейнер кнопки "старт" выравниваю по ширине с контейнером поля
    scoreBar.style.cssText = "width: " + ((stageH.x + stageH.borderWidth)*2 + stageH.width) + "px; " +
                            "height: 2em; color: white; text-align: center; font: 1em/2em serif;";
    var buttonDiv = startButton.parentNode;
    buttonDiv.style.width = (stageH.x + stageH.borderWidth)*2 + stageH.width + "px";
    buttonDiv.style.paddingTop = "0.5em";
    buttonDiv.style.textAlign = "center";

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function DomStage(paramsH) {
        this.width = paramsH.width; // ширина и высота
        this.height = paramsH.height;
        this.left = 0; // координаты верхнего левого угла поля
        this.top = 0;
        this.posX = paramsH.x; // положение внутри контейнера для теннисного поля
        this.posY = paramsH.y;
        this.domElem = null;
        this.childrenHash = {ball: null, rackets: [], scoreBar: null };
        this.scoreHash = {};
        this.updateStage = function(){
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
        this.render = function(doc,container) {
            var stageElem = doc.createElement("div");
            this.domElem = stageElem;
            stageElem.style.position = "relative";
            stageElem.style.width = this.width + "px";
            stageElem.style.height = this.height + "px";
            stageElem.style.left = this.posX + "px";
            stageElem.style.top = this.posY + "px";
            stageElem.style.backgroundColor = paramsH.fill;
            stageElem.style.border = paramsH.borderWidth + "px solid " + paramsH.borderColor;
            container.appendChild(stageElem);
        };
    }


    function DomBall(paramsH) {
        this.diameter = paramsH.diameter;
        this.x = this.diameter; // 
        this.y = this.diameter; // 
        this.startX = 0; // координаты начальной точки контейнера мяча
        this.startY = 0;
        this.vx = paramsH.vx;
        this.vy = paramsH.vy;
        this.domElem = null;
        this.isStopped = true; // на старте и в момент гола мяч неподвижен
        this.render = function(doc,pObj) {
            var ballElem = doc.createElement("div");
            this.domElem = ballElem;
            ballElem.style.width = this.diameter + "px";
            ballElem.style.height = this.diameter + "px";
            ballElem.style.position = "absolute";
            ballElem.style.borderRadius = "50%";
            var startX = (pObj.width - this.diameter)/2;
            var startY = (pObj.height - this.diameter)/2;
            this.startX = startX;
            this.startY = startY;
            this.x = startX;
            this.y = startY;
            ballElem.style.left = startX + "px";
            ballElem.style.top = startY + "px";
            ballElem.style.backgroundColor = "red";
            pObj.domElem.appendChild(ballElem); // присоединили мяч в дереве DOM к родительскому ЭЛЕМЕНТУ
            pObj.childrenHash.ball = this;      // и занесли мяч в хэш дочерних объектов родительскому ОБЪЕКТУ
        };
        this.calcPosition = function() {
            this.x += this.vx;
            this.y += this.vy;
        };
        this.toStart = function(direct) {
            // direct = 1: подает первый игрок
            // direct = -1: подает второй игрок
            if (!direct) { // если забившего нет, направление выбирается случайным образом
                direct = 1 - 2 * Math.round(Math.random()); // 1 или -1
            }
            this.isStopped = false;
            this.x = this.startX;
            this.y = this.startY;
            this.vy = getRandomInt(1, 2) * direct;
            this.domElem.style.left = this.startX + "px";
            this.domElem.style.top = this.startY + "px";

        };
        this.update = function() {
            this.domElem.style.left = Math.round(this.x) + "px";
            this.domElem.style.top = Math.round(this.y) + "px";
        };
    }


    function Score() {
        this.p1 = 0;
        this.p2 = 0;
        this.domElem = null;
        this.render = function(doc,elemRef) {
            var scoreSpan = doc.createElement("span");
            var player1Span = doc.createElement("span");
            player1Span.style.cssText = "display: inline-block; width: calc(50% - 5ex)";
            var player2Span = player1Span.cloneNode();
            scoreSpan.textContent = this.p1 + " : " + this.p2;
            player1Span.textContent = "Игрок 1";
            player2Span.textContent = "Игрок 2";
            elemRef.appendChild(player1Span);
            elemRef.appendChild(scoreSpan);
            elemRef.appendChild(player2Span);
            this.domElem = scoreSpan;
            // поскольку dom-элемент
        };
        this.setScore = function(scorer) {
            if (scorer === PLAYER1_FLAG)
                this.p1 += 1;
            else if (scorer === PLAYER2_FLAG)
                this.p2 += 1;
        };
        this.update = function() {
            this.domElem.innerHTML = this.p1 + " : " + this.p2;
        };
    }

    
    function Racket(paramsH) {
        this.isLeft = paramsH.isLeft;
        this.width = paramsH.width;
        this.height = paramsH.length;
        this.baseVy = 2; // скорость движения ракетки
        this.vy = 0; // актуальная скорость движения ракетки
        this.color = paramsH.color;
        this.offset = paramsH.offset; // отступ от края поля (в долях от ширины поля)
        this.x = 0;
        this.y = 0;
        this.stepValue = 5;
        this.domElem = null;
        this.upStop = null;
        this.downStop = null;
    }

    Racket.prototype.render = function(doc,parentObj) {
        var racketElem = doc.createElement("div");
        this.domElem = racketElem;
        racketElem.style.position = "absolute";
        racketElem.style.borderRadius = "10%/20%";
        racketElem.style.width = this.width + "px";
        racketElem.style.height = this.height + "px";
        var posX = Math.floor(parentObj.width * this.offset - this.width/2);
        var posY = Math.floor((parentObj.height - this.height)/2);
        this.x = posX;
        this.y = posY;
        this.upStop = parentObj.top;
        this.downStop = parentObj.height - this.height;
        racketElem.style.left = posX + "px";
        racketElem.style.top = posY + "px";
        racketElem.style.backgroundColor = this.color;
        parentObj.domElem.appendChild(racketElem); // присоединили ракетку в дереве DOM к родительскому ЭЛЕМЕНТУ
        parentObj.childrenHash.rackets.push(this);  // и занесли ракетку в список дочерних объектов родительскому ОБЪЕКТУ
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
        
            this.domElem.style.top = this.y + "px";
            return; // не выходить за пределы поля
        }
        this.y += this.vy;
        this.domElem.style.top = this.y + "px";
    };

    var tStage = new DomStage(stageH);    // создадим поле
    tStage.render(document, container);   // и отобразим

    var tBall = new DomBall(ballH);       // мяч
    tBall.render(document, tStage);

    var tRacketLeft = new Racket(racketH);    // ракетка 1
    tRacketLeft.isLeft = true;
    tRacketLeft.offset = 5/100; // отступ ракетки 5% от ширины поля
    tRacketLeft.color = "black";
    tRacketLeft.render(document, tStage);
    
    var tRacketRight = new Racket(racketH);   // ракетка 2
    tRacketRight.isLeft = false;
    tRacketRight.offset = 95/100; // отступ ракетки 5% от ширины поля
    tRacketRight.color = "blue";

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
            return theBall.y <= theStage.top;
        }

        function isBottomBounce(theBall, theStage) {
            return theBall.y + theBall.diameter >= theStage.height;
        }

        function isRacketBounce(theBall, theRacket) { // ссылки на мяч и ракетку
            return  Math.abs(theBall.x - theRacket.x) <= theRacket.width &&
                (theBall.y + theBall.diameter >= theRacket.y) &&
                (theBall.y <= theRacket.y + theRacket.height) ; 
        }

        function isLeftBounce(theBall, theStage) {
            return theBall.x <= theStage.left; // мяч у левой стенки
        }

        function isRightBounce(theBall, theStage) {
            return theBall.x + theBall.diameter >= theStage.width; // мяч у правой стенки
        }

        var ball = stage.childrenHash.ball;
        var racketsArr = stage.childrenHash.rackets;
        
        if ( isTopBounce(ball, stage) ) {
            ball.vy = -ball.vy;
            ball.y = stage.top;
        } else if ( isBottomBounce(ball, stage) ) { // else if так как события несовместные
            ball.vy = -ball.vy;
            ball.y = stage.height - ball.diameter;
        }

        // практически мяч может находиться в углу между ракеткой и горизонтальной стороной поля,
        // касаясь при этом обеих
        for (var i=0; i<racketsArr.length; i++) {
            if ( isRacketBounce(ball, racketsArr[i]) ) {
                ball.vx = -ball.vx; // для любой ракетки вектор по оси Х меняется на противоположный
                if (!racketsArr[i].isLeft) // мяч отбивает правая ракетка
                    ball.x = racketsArr[i].x - ball.diameter;
                else
                    ball.x = racketsArr[i].x + tRacketLeft.width;
                break; // только одна ракетка может отбивать мяч в конкретный момент
            }
        }

        if ( isRightBounce(ball, stage) ) {
            ball.x = stage.width - ball.diameter;
            // вектор скорости не меняется 
            stage.scoreHash[PLAYER1_FLAG] = true;
        } else if ( isLeftBounce(ball, stage)) {
            ball.x = stage.left;
            // вектор скорости не меняется
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