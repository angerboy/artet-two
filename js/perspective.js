var container = document.getElementById('panel-3-animation-items');
var inner = document.getElementById('bottle-and-peel');

const scaleMap = {
  'bottle': '0.8',
  'peel': '2',
  'juniper': '3',
  'coup': '1.5',
  'lemon': '1'
}

// Mouse 
var mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function(event) {
      var e = event || window.event;
      this.x = e.clientX - this._x;
      this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function(e) {
      this._x = e.offsetLeft + Math.floor(e.offsetWidth/2);
      this._y = e.offsetTop + Math.floor(e.offsetHeight/2);
    },
    show: function() { return '(' + this.x + ', ' + this.y + ')'; }
  }
  // Track the mouse position relative to the center of the container.
  mouse.setOrigin(container);

  var update = function(event) {
    mouse.updatePosition(event);
    updateTransformStyle(
      (mouse.y / inner.offsetHeight/2).toFixed(2),
      (mouse.x / inner.offsetWidth/2).toFixed(2)
    );
  };
  
  var updateTransformStyle = function(x, y) {

    var rotatedDivs = Array.from(container.getElementsByClassName("rotated"));

    var scale, scaledX, scaledY, style;

    rotatedDivs.forEach(function(div) {

      console.log("rotate div: ", div.id);

      scale = scaleMap[div.id];
      if(scale === null || scale === undefined) {
        scale = 1;
      }

      scaledX = x * scale;
      scaledY = y * scale;

      // console.log("scaledX: ", scaledX);
      // console.log("scaledY: ", scaledY);

      style = "rotateX(" + scaledX + "deg) rotateY(" + scaledY + "deg)";
      console.log("style: ", style);
      div.style.transform = style;
      div.style.webkitTransform = style;
      div.style.mozTransform = style;
      div.style.msTransform = style;
      div.style.oTransform = style;
    });

    // var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    // inner.style.transform = style;
    // inner.style.webkitTransform = style;
    // inner.style.mozTransform = style;
    // inner.style.msTransform = style;
    // inner.style.oTransform = style;
  };



var onMouseEnterHandler = function(event) {
    update(event);  
  };
var onMouseLeaveHandler = function() {
};
var onMouseMoveHandler = function(event) {
if (isTimeToUpdate()) {
    update(event);
}
};
  
container.onmouseenter = onMouseEnterHandler;
container.onmouseleave = onMouseLeaveHandler;
container.onmousemove = onMouseMoveHandler;

var counter = 0;
var updateRate = 10;
var isTimeToUpdate = function() {
    return counter++ % updateRate === 0;
};