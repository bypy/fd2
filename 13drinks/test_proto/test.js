function Room(ln,wd,hg) {
    // private method
    function setParams() {
        return {
            length: ln,
            width: wd,
            heigth: hg
        };
    }
    // private variable
    var params = setParams();
    // add defaults
    params.windowsCount = 1;
    params.doorsCount = 1;
    params.square = function() {
        return this.width * this.length;
    }.call(params);

    this.setWindows = function(winC) { params.windowsCount = winC; };
    this.setDoors = function(drC) { params.doorsCount = drC; };
    this.getAllProps = function() { return params; };
}


Room.prototype.getWidth = function() { return this.getAllProps().width; };
Room.prototype.getLength = function() { return this.getAllProps().length; };
Room.prototype.getHeight = function() { return this.getAllProps().height; };
Room.prototype.getWindows = function() { return this.getAllProps().windowsCount; };
Room.prototype.getDoors = function() { return this.getAllProps().doorsCount; };


function Kitchen(ln,wd,hg) {
    Room.call(this, ln,wd,hg);
    var params = this.getAllProps();
    params.sink = true;
    params.freezer = true;
}

Kitchen.prototype = Object.create(Room.prototype);
Kitchen.prototype.constructor = Kitchen;

var kitchen = new Kitchen(4, 2, 3);
console.log (kitchen.getAllProps());
kitchen.setWindows(3);
kitchen.setDoors(2);
console.log(kitchen.getWindows());
console.log(kitchen.getDoors());
console.log (kitchen.getAllProps());