"use strict";
window.onload = (function(){

    var ground = document.getElementById("playground");

    // так вылечил отсуп слева у третьей картинки
    // var allChildren = ground.childNodes;
    // Array.prototype.forEach.call(allChildren, function(el) {
    //     if ( el.nodeType === 3 )
    //         ground.removeChild(el);
    // }); 

    if ( ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ) {
        ground.addEventListener("touchstart", touchStartHandler, false);
        ground.addEventListener("touchend", touchEndHandler, false);
    }

    function touchStartHandler(EO) {
        EO = EO || window.event;
        EO.preventDefault();
        var touchingEl = EO.target;
        ground.appendChild(touchingEl);
        if ( touchingEl.tagName !== "IMG" ) return;
        var touchInfo = EO.targetTouches[0];
        var deltaX = touchInfo.pageX - touchingEl.offsetLeft;
        var deltaY = touchInfo.pageY - touchingEl.offsetTop;
        // при тачстарт начинаем слушать тачмув
        touchingEl.addEventListener("touchmove", function(EO){
            EO = EO || window.event;
            EO.preventDefault();
            var touchInfo = EO.targetTouches[0];
            this.style.left = (touchInfo.pageX - deltaX) + "px";
            this.style.top = (touchInfo.pageY - deltaY) + "px";
        }, false);
    }

    function touchEndHandler(EO) {
        EO = EO || window.event;
        EO.preventDefault();
        this.ontouchmove = null;
    }


    var images = ground.getElementsByTagName("img");
    if ( images.length === 0 )
        return;

    for ( var i=images.length-1; i>=0 ; i--) {
        var currImg = images[i];
        currImg.style.position = "absolute";
        currImg.style.left = currImg.offsetLeft + "px";
        currImg.style.top = currImg.offsetTop + "px";
        currImg.onmousedown = mouseDownHandler;
    }

    function mouseDownHandler(EO) { // img
        EO = EO || window.event;
        EO.preventDefault();
        var pressedImg = this;
        pressedImg.style.cursor = "move";
        ground.appendChild(pressedImg);
        var pressedImgPos = getElementPos(pressedImg);
        // координаты клика относительно избражения 
        var clickX=Math.round(EO.pageX-pressedImgPos.left);
        var clickY=Math.round(EO.pageY-pressedImgPos.top);

        ground.onmousemove = function(EO) {
            EO = EO || window.event;
            EO.preventDefault();
            pressedImg.style.top = EO.pageY - clickY + "px";
            pressedImg.style.left = EO.pageX - clickX + "px";
        };

        ground.onmouseup = function() {
            this.onmousemove = null;
        };
    }

    function getElementPos(elem) {
        var bbox=elem.getBoundingClientRect();
        return {
            left: bbox.left+window.pageXOffset,
            top: bbox.top+window.pageYOffset
        };
    }

}());