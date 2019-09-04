"use strict";

window.addEventListener('DOMContentLoaded', start);

function start() {
    window.onresize = draw;

    var canvas = document.querySelector("#canvasWrapper canvas");
    var ctx = canvas.getContext("2d");

    var canvasSize = { height: null, width: null, context: ctx };
    
    var updateSize = getCanvasSize.bind(canvasSize);
    function getCanvasSize() {
        this.height = ctx.canvas.clientWidth;
        this.width = ctx.canvas.clientHeight;
    }
    
    var getRectAbsValues = fr2Rect.bind(canvasSize)
    function fr2Rect() {
        var rect = [];
        var maxWidth = this.height;
        var maxHeight = this.width;
        for ( var i=0; i<arguments.length; i++ ) {
            var param = arguments[i];
            if ( Number(param) )
                rect.push(param);
            else {
                rect.push(parseParam(param));
            }
        }

        return rect ;

        function parseParam(str) {
            var widthType = "w";
            var heightType = "h";
            var value = 0;
            if (str.trim().charAt(0) === widthType) {
                value = str.split(widthType)[1];
                return Math.floor( maxWidth * parseFloat(value/100) );
            } else if ( str.trim().charAt(0) === heightType) {
                value = str.split(heightType)[1];
                return Math.floor( maxHeight * parseFloat(value/100) );
            }
        }
    }

    var draw = (function() {
        updateSize();
        ctx.canvas.setAttribute("width", canvasSize.width);
        ctx.canvas.setAttribute("height", canvasSize.height);
        var myRect;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "red";
        myRect = getRectAbsValues("w10", "h10", "w40", "h80");
        console.log(myRect);
        ctx.fillRect( myRect[0], myRect[1], myRect[2], myRect[3] );
        myRect = getRectAbsValues( 10, 10, "w20", "h20" )
        ctx.strokeRect(myRect[0], myRect[1], myRect[2], myRect[3] );
    })();
           
}






