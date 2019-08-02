"use strict";

var INNER_HEIGHT = window.innerHeight;
var INNER_WIDTH = window.innerWidth;

var positionIndicator = document.getElementById('position-indicator');
var style = getComputedStyle(positionIndicator);
const isMobile = style.display === 'none';

setRowHeights();

function orientationChanged() {
  const timeout = 120;
  return new window.Promise(function(resolve) {
    const go = (i, height0) => {
      window.innerHeight != height0 || i >= timeout ?
        resolve() :
        window.requestAnimationFrame(() => go(i + 1, height0));
    };
    go(0, window.innerHeight);
  });
}

if(isMobile) {
	window.addEventListener('orientationchange', function () {
    orientationChanged().then(function() {
			const height = INNER_HEIGHT;
			INNER_HEIGHT = INNER_WIDTH;
			INNER_WIDTH = height;
			setRowHeights();
    });
	});	
}

function setRowHeights() {
	var rows = Array.from(document.getElementsByClassName('row'));
	rows.forEach(function(row) {
		row.style.height = INNER_HEIGHT + "px";
	});
}

const idToAnimationClass = {
	'coup': 'slide-in-left',
	'lemon': 'slide-in-left',
	'bottle': 'slide-in-right',
	'highball-tonic': 'slide-in-left',
	'bottle-spritz': 'slide-in-right'
};

var numRows = document.querySelectorAll('.row').length,
	scdir, hold = false;

var slength, plength, pan, step = INNER_HEIGHT,
	vh = INNER_HEIGHT / 100,
	vmin = Math.min(window.innerHeight, window.innerWidth) / 100;

function _scrollY(obj) {
	if ((this !== undefined && this.id === 'content-container') || (obj !== undefined && obj.id === 'content-container')) {
		pan = this || obj;
		plength = parseInt(pan.offsetHeight);
	}
	
	if (pan === undefined) {
		return;
	}

	scrollToPanel(pan);
	
	// plength = plength || parseInt(pan.offsetHeight / vmin);
	// slength = parseInt(pan.style.transform.replace('translateY(', ''));
	
	// if (scdir === 'up' && Math.abs(slength) < (plength - plength / numRows)) {
	// 	slength = slength - step;
	// } else if (scdir === 'down' && slength < 0) {
	// 	slength = slength + step;
	// } else if (scdir === 'top') {
	// 	slength = 0;
	// }

	// const panelNumber = 1 + (Math.abs(slength) / step);
	// animatePanel(panelNumber);
	// animatePositionIndicator(panelNumber);

	// pan.style.transform = 'translateY(' + slength + 'px)';
	// pan.removeEventListener('wheel', _scrollY);

	// setTimeout(function() {
	// 	pan.addEventListener('wheel', _scrollY);
	// 	hold = false;
	// }, 1500);
}

var animatedElements = [];

function animatePanel(panelNumber) {
	// remove animation classes to repeat animations
	animatedElements.forEach(function(element) {
		element.className = "animated rotated";
	})

	animatedElements = [];

	var panel = document.getElementById('panel-' + panelNumber);
	var animationItems = document.getElementById('panel-' + panelNumber + '-animation-items');
	if(animationItems !== undefined && animationItems !== null) {
		animationItems.className = "animation-items visible";
	}
	if (panel !== undefined && panel !== null) {
		var animatedDivs = Array.from(panel.getElementsByClassName("animated"));
		animatedElements = animatedDivs
		if (animatedDivs !== undefined && animatedDivs !== null && animatedDivs.length > 0) {
			animatedDivs.forEach(function(div) {
				var animationClassName = idToAnimationClass[div.id];
				if(isMobile) {
					animationClassName += "-mobile";
				}
				div.className += " " + animationClassName;
			})
		}
	}
}

const panelNumberToPositionIndicatorClassMap = {
	1: 'visible',
	2: 'hidden',
	3: 'visible',
	4: 'hidden',
	5: 'hidden',
	6: 'visible',
	7: 'visible',
	8: 'hidden'
}

const panelNumberToPositionIndicatorBGImageMap = {
	1: 'assets/PNG/2x/position-indicator-1@2x.png',
	2: 'hidden',
	3: 'assets/PNG/2x/position-indicator-2@2x.png',
	4: 'hidden',
	5: 'hidden',
	6: 'assets/PNG/2x/position-indicator-3@2x.png',
	7: 'assets/PNG/2x/position-indicator-4@2x.png',
	9: 'hidden'
}

function animatePositionIndicator(panelNumber) {
	positionIndicator.className = "position-indicator";
	positionIndicator.className += " " +  panelNumberToPositionIndicatorClassMap[panelNumber];
	const image = panelNumberToPositionIndicatorBGImageMap[panelNumber];
	if(image !== 'hidden') {
		const url = 'url(' + image + ')';
		positionIndicator.style.backgroundImage = url;
	}
}

function isInViewport(element) {
	var rect = element.getBoundingClientRect();
	return ((rect.top - window.innerHeight) <= 0)
}

var isPanel3Visible = false;
var isPanel6Visible = false;

var panel3 = document.getElementById('panel-3-animation-items');
var panel6 = document.getElementById('panel-6-animation-items');

function animatePanelsIfVisible() {
	if(isInViewport(panel3)) {
		if(!isPanel3Visible) {
			isPanel3Visible = true;
			animatePanel(3);
		}
	}
	if(isInViewport(panel6)) {
		if(!isPanel6Visible) {
			isPanel6Visible = true;
			animatePanel(6);
		}
	}
}

function _swipe(obj) {
	obj.addEventListener('touchstart', function(e) {
		animatePanelsIfVisible();
	}, false);

	obj.addEventListener('touchmove', function(e) {
		animatePanelsIfVisible();
	}, false);

	obj.addEventListener('touchend', function(e) {
		animatePanelsIfVisible();
	}, false);
}

var container = document.getElementById('content-container');
container.style.transform = 'translateY(0)';

container.addEventListener('wheel', function(e) {
	if (e.deltaY < 0) {
		scdir = 'down';
	}
	if (e.deltaY > 0) {
		scdir = 'up';
	}
	e.stopPropagation();
});

container.addEventListener('wheel', _scrollY);
_swipe(container);

window.onload = () => {
	setTimeout(() => {
		if(document.body.scrollTop > 0) {
			animatePanelsIfVisible();
		}
	}, 100);
}

function scrollToPanel(obj) {
	if ((this !== undefined && this.id === 'content-container') || (obj !== undefined && obj.id === 'content-container')) {
		pan = this || obj;
		plength = parseInt(pan.offsetHeight);
	}
	
	if (pan === undefined) {
		return;
	}

	plength = plength || parseInt(pan.offsetHeight / vmin);
	slength = parseInt(pan.style.transform.replace('translateY(', ''));
	
	if (scdir === 'up' && Math.abs(slength) < (plength - plength / numRows)) {
		slength = slength - step;
	} else if (scdir === 'down' && slength < 0) {
		slength = slength + step;
	} else if (scdir === 'top') {
		slength = 0;
	}

	const panelNumber = 1 + (Math.abs(slength) / step);
	animatePanel(panelNumber);
	animatePositionIndicator(panelNumber);

	pan.style.transform = 'translateY(' + slength + 'px)';
	pan.removeEventListener('wheel', _scrollY);

	setTimeout(function() {
		pan.addEventListener('wheel', _scrollY);
		hold = false;
	}, 1500);
}

document.onkeydown = checkKey;

function checkKey(e) {

		e = e || window.event;
		var container = document.getElementById('content-container');

    if (e.keyCode == '38') {
			// up arrow
			scdir = 'down';
			scrollToPanel(container);
    }
    else if (e.keyCode == '40') {
			// down arrow
			scdir = 'up';
			scrollToPanel(container);
		}
}