/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;

		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();

function IScroll (el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;		// cache style for better performance

	this.options = {

		resizeScrollbars: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,

// INSERT POINT: OPTIONS 

		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

	if ( this.options.shrinkScrollbars == 'scale' ) {
		this.options.useTransition = false;
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

// INSERT POINT: NORMALIZATION

	// Some defaults	
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

IScroll.prototype = {
	version: '5.1.3',

	_init: function () {
		this._initEvents();

		if ( this.options.scrollbars || this.options.indicators ) {
			this._initIndicators();
		}

		if ( this.options.mouseWheel ) {
			this._initWheel();
		}

		if ( this.options.snap ) {
			this._initSnap();
		}

		if ( this.options.keyBindings ) {
			this._initKeys();
		}

// INSERT POINT: _init

	},

	destroy: function () {
		this._initEvents(true);

		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}

		this._transitionTime();
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();

		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if ( !this.moved ) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

/* REPLACE START: _move */

		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

/* REPLACE END: _move */

	},

	_end: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}


		if ( this.options.snap ) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

// INSERT POINT: _end

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow

		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;

/* REPLACE START: refresh */

		this.scrollerWidth	= this.scroller.offsetWidth;
		this.scrollerHeight	= this.scroller.offsetHeight;

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

/* REPLACE END: refresh */

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

// INSERT POINT: _refresh

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {
			this._transitionTimingFunction(easing.style);
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;

		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTime(time);
			}
		}


// INSERT POINT: _transitionTime

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTimingFunction(easing);
			}
		}


// INSERT POINT: _transitionTimingFunction

	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

/* REPLACE START: _translate */

			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

/* REPLACE END: _translate */

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;


	if ( this.indicators ) {
		for ( var i = this.indicators.length; i--; ) {
			this.indicators[i].updatePosition();
		}
	}


// INSERT POINT: _translate

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	_initIndicators: function () {
		var interactive = this.options.interactiveScrollbars,
			customStyle = typeof this.options.scrollbars != 'string',
			indicators = [],
			indicator;

		var that = this;

		this.indicators = [];

		if ( this.options.scrollbars ) {
			// Vertical scrollbar
			if ( this.options.scrollY ) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if ( this.options.scrollX ) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if ( this.options.indicators ) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.options.indicators);
		}

		for ( var i = indicators.length; i--; ) {
			this.indicators.push( new Indicator(this, indicators[i]) );
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap (fn) {
			for ( var i = that.indicators.length; i--; ) {
				fn.call(that.indicators[i]);
			}
		}

		if ( this.options.fadeScrollbars ) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}


		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
	},

	_initWheel: function () {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		if ( this.wheelTimeout === undefined ) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('scrollEnd');
			that.wheelTimeout = undefined;
		}, 400);

		if ( 'deltaX' in e ) {
			if (e.deltaMode === 1) {
				wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
				wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
			} else {
				wheelDeltaX = -e.deltaX;
				wheelDeltaY = -e.deltaY;
			}
		} else if ( 'wheelDeltaX' in e ) {
			wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
			wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
		} else if ( 'wheelDelta' in e ) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
		} else if ( 'detail' in e ) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
		} else {
			return;
		}

		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

// INSERT POINT: _wheel
	},

	_initSnap: function () {
		this.currentPage = {};

		if ( typeof this.options.snap == 'string' ) {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0, l,
				m = 0, n,
				cx, cy,
				x = 0, y,
				stepX = this.options.snapStepX || this.wrapperWidth,
				stepY = this.options.snapStepY || this.wrapperHeight,
				el;

			this.pages = [];

			if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
				return;
			}

			if ( this.options.snap === true ) {
				cx = Math.round( stepX / 2 );
				cy = Math.round( stepY / 2 );

				while ( x > -this.scrollerWidth ) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while ( y > -this.scrollerHeight ) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for ( ; i < l; i++ ) {
					if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
						m = 0;
						n++;
					}

					if ( !this.pages[m] ) {
						this.pages[m] = [];
					}

					x = Math.max(-el[i].offsetLeft, this.maxScrollX);
					y = Math.max(-el[i].offsetTop, this.maxScrollY);
					cx = x - Math.round(el[i].offsetWidth / 2);
					cy = y - Math.round(el[i].offsetHeight / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: el[i].offsetWidth,
						height: el[i].offsetHeight,
						cx: cx,
						cy: cy
					};

					if ( x > this.maxScrollX ) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if ( this.options.snapThreshold % 1 === 0 ) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

			this.goToPage(
				this.currentPage.pageX + this.directionX,
				this.currentPage.pageY + this.directionY,
				time
			);
		});
	},

	_nearestSnap: function (x, y) {
		if ( !this.pages.length ) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
			l = this.pages.length,
			m = 0;

		// Check if we exceeded the snap threshold
		if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY ) {
			return this.currentPage;
		}

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		for ( ; i < l; i++ ) {
			if ( x >= this.pages[i][0].cx ) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for ( ; m < l; m++ ) {
			if ( y >= this.pages[0][m].cy ) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if ( i == this.currentPage.pageX ) {
			i += this.directionX;

			if ( i < 0 ) {
				i = 0;
			} else if ( i >= this.pages.length ) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if ( m == this.currentPage.pageY ) {
			m += this.directionY;

			if ( m < 0 ) {
				m = 0;
			} else if ( m >= this.pages[0].length ) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function (x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if ( x >= this.pages.length ) {
			x = this.pages.length - 1;
		} else if ( x < 0 ) {
			x = 0;
		}

		if ( y >= this.pages[x].length ) {
			y = this.pages[x].length - 1;
		} else if ( y < 0 ) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x++;

		if ( x >= this.pages.length && this.hasVerticalScroll ) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x--;

		if ( x < 0 && this.hasVerticalScroll ) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function (e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if ( typeof this.options.keyBindings == 'object' ) {
			for ( i in this.options.keyBindings ) {
				if ( typeof this.options.keyBindings[i] == 'string' ) {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for ( i in keys ) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var snap = this.options.snap,	// we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			newY = snap ? this.currentPage.pageY : this.y,
			now = utils.getTime(),
			prevTime = this.keyTime || 0,
			acceleration = 0.250,
			pos;

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch ( e.keyCode ) {
			case this.options.keyBindings.pageUp:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length-1 : this.maxScrollX;
				newY = snap ? this.pages[0].length-1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			default:
				return;
		}

		if ( snap ) {
			this.goToPage(newX, newY);
			return;
		}

		if ( newX > 0 ) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if ( newY > 0 ) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
};
function createDefaultScrollbar (direction, interactive, type) {
	var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

	if ( type === true ) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
	}

	indicator.className = 'iScrollIndicator';

	if ( direction == 'h' ) {
		if ( type === true ) {
			scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if ( type === true ) {
			scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	scrollbar.style.cssText += ';overflow:hidden';

	if ( !interactive ) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator (scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.wrapperStyle = this.wrapper.style;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		shrink: false,
		fade: false,
		speedRatioX: 0,
		speedRatioY: 0
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if ( this.options.interactive ) {
		if ( !this.options.disableTouch ) {
			utils.addEvent(this.indicator, 'touchstart', this);
			utils.addEvent(window, 'touchend', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(this.indicator, 'mousedown', this);
			utils.addEvent(window, 'mouseup', this);
		}
	}

	if ( this.options.fade ) {
		this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
		this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
		this.wrapperStyle.opacity = '0';
	}
}

Indicator.prototype = {
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function () {
		if ( this.options.interactive ) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if ( this.options.defaultScrollbars ) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function (e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime();

		this.initiated = true;
		this.moved = false;
		this.lastPointX	= point.pageX;
		this.lastPointY	= point.pageY;

		this.startTime	= utils.getTime();

		if ( !this.options.disableTouch ) {
			utils.addEvent(window, 'touchmove', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(window, 'mousemove', this);
		}

		this.scroller._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = utils.getTime();

		if ( !this.moved ) {
			this.scroller._execEvent('scrollStart');
		}

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		this._pos(newX, newY);

// INSERT POINT: indicator._move

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function (e) {
		if ( !this.initiated ) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
		utils.removeEvent(window, 'mousemove', this);

		if ( this.scroller.options.snap ) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

			if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if ( this.moved ) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function (time) {
		time = time || 0;
		this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
		}
	},

	transitionTimingFunction: function (easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function () {
		this.transitionTime();

		if ( this.options.listenX && !this.options.listenY ) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if ( this.options.listenY && !this.options.listenX ) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		var r = this.wrapper.offsetHeight;	// force refresh

		if ( this.options.listenX ) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if ( this.options.resize ) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}

			this.maxPosX = this.wrapperWidth - this.indicatorWidth;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryX = -this.indicatorWidth + 8;
				this.maxBoundaryX = this.wrapperWidth - 8;
			} else {
				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;
			}

			this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));	
		}

		if ( this.options.listenY ) {
			this.wrapperHeight = this.wrapper.clientHeight;
			if ( this.options.resize ) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryY = -this.indicatorHeight + 8;
				this.maxBoundaryY = this.wrapperHeight - 8;
			} else {
				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
		}

		this.updatePosition();
	},

	updatePosition: function () {
		var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if ( !this.options.ignoreBoundaries ) {
			if ( x < this.minBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth + x, 8);
					this.indicatorStyle.width = this.width + 'px';
				}
				x = this.minBoundaryX;
			} else if ( x > this.maxBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
					this.indicatorStyle.width = this.width + 'px';
					x = this.maxPosX + this.indicatorWidth - this.width;
				} else {
					x = this.maxBoundaryX;
				}
			} else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if ( y < this.minBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight + y * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
				}
				y = this.minBoundaryY;
			} else if ( y > this.maxBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
					y = this.maxPosY + this.indicatorHeight - this.height;
				} else {
					y = this.maxBoundaryY;
				}
			} else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}
		}

		this.x = x;
		this.y = y;

		if ( this.scroller.options.useTransform ) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function (x, y) {
		if ( x < 0 ) {
			x = 0;
		} else if ( x > this.maxPosX ) {
			x = this.maxPosX;
		}

		if ( y < 0 ) {
			y = 0;
		} else if ( y > this.maxPosY ) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	},

	fade: function (val, hold) {
		if ( hold && !this.visible ) {
			return;
		}

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

		var time = val ? 250 : 500,
			delay = val ? 0 : 300;

		val = val ? '1' : '0';

		this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

		this.fadeTimeout = setTimeout((function (val) {
			this.wrapperStyle.opacity = val;
			this.visible = +val;
		}).bind(this, val), delay);
	}
};

IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = IScroll;
} else {
	window.IScroll = IScroll;
}

})(window, document, Math);






/**
 * fullPage 2.5.4
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(b) {
    b.fn.fullpage = function(c) {
        function pa(a) {
            a.find(".fp-slides").after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>');
            "#fff" != c.controlArrowColor && (a.find(".fp-controlArrow.fp-next").css("border-color", "transparent transparent transparent " + c.controlArrowColor), a.find(".fp-controlArrow.fp-prev").css("border-color", "transparent " + c.controlArrowColor + " transparent transparent"));
            c.loopHorizontal || a.find(".fp-controlArrow.fp-prev").hide()
        }
        function qa() {
            b("body").append('<div id="fp-nav"><ul></ul></div>');
            k = b("#fp-nav");
            k.css("color", c.navigationColor);
            k.addClass(c.navigationPosition);
            for (var a = 0; a < b(".fp-section").length; a++) {
                var d = "";
                c.anchors.length && (d = c.anchors[a]);
                var d = '<li><a href="#' + d + '"><span></span></a>',
                    e = c.navigationTooltips[a];
                void 0 != e && "" != e && (d += '<div class="fp-tooltip ' + c.navigationPosition + '">' + e + "</div>");
                d += "</li>";
                k.find("ul").append(d)
            }
        }
        function R() {
            b(".fp-section").each(function() {
                var a = b(this).find(".fp-slide");
                a.length ? a.each(function() {
                    y(b(this))
                }) : y(b(this))
            });
            b.isFunction(c.afterRender) && c.afterRender.call(this)
        }
        function S() {
            if (!c.autoScrolling || c.scrollBar) {
                var a = b(window).scrollTop(),
                    d = 0,
                    e = Math.abs(a - b(".fp-section").first().offset().top);
                b(".fp-section").each(function(c) {
                    var f = Math.abs(a - b(this).offset().top);
                    f < e && (d = c, e = f)
                });
                var f = b(".fp-section").eq(d)
            }
            if (!c.autoScrolling && !f.hasClass("active")) {
                F = !0;
                var ra = b(".fp-section.active").index(".fp-section") + 1,
                    g = G(f),
                    h = f.data("anchor"),
                    k = f.index(".fp-section") + 1,
                    l = f.find(".fp-slide.active");
                if (l.length) var n = l.data("anchor"),
                    t = l.index();
                f.addClass("active").siblings().removeClass("active");
                m || (b.isFunction(c.onLeave) && c.onLeave.call(this, ra, k, g), b.isFunction(c.afterLoad) && c.afterLoad.call(this, h, k));
                H(h, 0);
                c.anchors.length && !m && (p = h, I(t, n, h, k));
                clearTimeout(T);
                T = setTimeout(function() {
                        F = !1
                    },
                    100)
            }
            c.scrollBar && (clearTimeout(U), U = setTimeout(function() {
                    m || q(f)
                },
                1E3))
        }
        function V(a) {
            return scrollable = a.find(".fp-slides").length ? a.find(".fp-slide.active").find(".fp-scrollable") : a.find(".fp-scrollable")
        }
        function z(a, d) {
            if (l[a]) {
                if ("down" == a) var c = "bottom",
                    f = b.fn.fullpage.moveSectionDown;
                else c = "top",
                    f = b.fn.fullpage.moveSectionUp;
                if (0 < d.length) if (c = "top" === c ? !d.scrollTop() : "bottom" === c ? d.scrollTop() + 1 + d.innerHeight() >= d[0].scrollHeight: void 0, c) f();
                else return ! 0;
                else f()
            }
        }
        function sa(a) {
            var d = a.originalEvent;
            if (!W(a.target)) {
                c.autoScrolling && !c.scrollBar && a.preventDefault();
                a = b(".fp-section.active");
                var e = V(a);
                m || t || (d = X(d), u = d.y, A = d.x, a.find(".fp-slides").length && Math.abs(B - A) > Math.abs(v - u) ? Math.abs(B - A) > b(window).width() / 100 * c.touchSensitivity && (B > A ? l.right && b.fn.fullpage.moveSlideRight() : l.left && b.fn.fullpage.moveSlideLeft()) : c.autoScrolling && !c.scrollBar && Math.abs(v - u) > b(window).height() / 100 * c.touchSensitivity && (v > u ? z("down", e) : u > v && z("up", e)))
            }
        }
        function W(a, d) {
            d = d || 0;
            var e = b(a).parent();
            return d < c.normalScrollElementTouchThreshold && e.is(c.normalScrollElements) ? !0 : d == c.normalScrollElementTouchThreshold ? !1 : W(e, ++d)
        }
        function ta(a) {
            a = X(a.originalEvent);
            v = a.y;
            B = a.x
        }
        function r(a) {
            if (c.autoScrolling) {
                a = window.event || a;
                var d = Math.max( - 1, Math.min(1, a.wheelDelta || -a.deltaY || -a.detail));
                c.scrollBar && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
                a = b(".fp-section.active");
                a = V(a);
                m || (0 > d ? z("down", a) : z("up", a));
                return ! 1
            }
        }
        function Y(a) {
            var d = b(".fp-section.active").find(".fp-slides");
            if (d.length && !t) {
                var e = d.find(".fp-slide.active"),
                    f = null,
                    f = "prev" === a ? e.prev(".fp-slide") : e.next(".fp-slide");
                if (!f.length) {
                    if (!c.loopHorizontal) return;
                    f = "prev" === a ? e.siblings(":last") : e.siblings(":first")
                }
                t = !0;
                w(d, f)
            }
        }
        function Z() {
            b(".fp-slide.active").each(function() {
                J(b(this))
            })
        }
        function q(a, d, e) {
            var f = a.position();
            if ("undefined" !== typeof f && (d = {
                    element: a,
                    callback: d,
                    isMovementUp: e,
                    dest: f,
                    dtop: f.top,
                    yMovement: G(a),
                    anchorLink: a.data("anchor"),
                    sectionIndex: a.index(".fp-section"),
                    activeSlide: a.find(".fp-slide.active"),
                    activeSection: b(".fp-section.active"),
                    leavingSection: b(".fp-section.active").index(".fp-section") + 1,
                    localIsResizing: x
                },
                    !(d.activeSection.is(a) && !x || c.scrollBar && b(window).scrollTop() === d.dtop))) {
                if (d.activeSlide.length) var g = d.activeSlide.data("anchor"),
                    h = d.activeSlide.index();
                c.autoScrolling && c.continuousVertical && "undefined" !== typeof d.isMovementUp && (!d.isMovementUp && "up" == d.yMovement || d.isMovementUp && "down" == d.yMovement) && (d.isMovementUp ? b(".fp-section.active").before(d.activeSection.nextAll(".fp-section")) : b(".fp-section.active").after(d.activeSection.prevAll(".fp-section").get().reverse()), n(b(".fp-section.active").position().top), Z(), d.wrapAroundElements = d.activeSection, d.dest = d.element.position(), d.dtop = d.dest.top, d.yMovement = G(d.element));
                a.addClass("active").siblings().removeClass("active");
                m = !0;
                I(h, g, d.anchorLink, d.sectionIndex);
                b.isFunction(c.onLeave) && !d.localIsResizing && c.onLeave.call(this, d.leavingSection, d.sectionIndex + 1, d.yMovement);
                ua(d);
                p = d.anchorLink;
                c.autoScrolling && H(d.anchorLink, d.sectionIndex)
            }
        }
        function ua(a) {
            if (c.css3 && c.autoScrolling && !c.scrollBar) aa("translate3d(0px, -" + a.dtop + "px, 0px)", !0),
                setTimeout(function() {
                        ba(a)
                    },
                    c.scrollingSpeed);
            else {
                var d = va(a);
                b(d.element).animate(d.options, c.scrollingSpeed, c.easing).promise().done(function() {
                    ba(a)
                })
            }
        }
        function va(a) {
            var b = {};
            c.autoScrolling && !c.scrollBar ? (b.options = {
                top: -a.dtop
            },
                b.element = "." + ca) : (b.options = {
                scrollTop: a.dtop
            },
                b.element = "html, body");
            return b
        }
        function wa(a) {
            a.wrapAroundElements && a.wrapAroundElements.length && (a.isMovementUp ? b(".fp-section:first").before(a.wrapAroundElements) : b(".fp-section:last").after(a.wrapAroundElements), n(b(".fp-section.active").position().top), Z())
        }
        function ba(a) {
            wa(a);
            b.isFunction(c.afterLoad) && !a.localIsResizing && c.afterLoad.call(this, a.anchorLink, a.sectionIndex + 1);
            setTimeout(function() {
                    m = !1;
                    b.isFunction(a.callback) && a.callback.call(this)
                },
                600)
        }
        function da() {
            if (!F) {
                var a = window.location.hash.replace("#", "").split("/"),
                    b = a[0],
                    a = a[1];
                if (b.length) {
                    var c = "undefined" === typeof p,
                        f = "undefined" === typeof p && "undefined" === typeof a && !t; (b && b !== p && !c || f || !t && K != a) && L(b, a)
                }
            }
        }
        function w(a, d) {
            var e = d.position(),
                f = a.find(".fp-slidesContainer").parent(),
                g = d.index(),
                h = a.closest(".fp-section"),
                k = h.index(".fp-section"),
                l = h.data("anchor"),
                n = h.find(".fp-slidesNav"),
                m = d.data("anchor"),
                q = x;
            if (c.onSlideLeave) {
                var p = h.find(".fp-slide.active").index(),
                    r;
                r = p == g ? "none": p > g ? "left": "right";
                q || "none" === r || b.isFunction(c.onSlideLeave) && c.onSlideLeave.call(this, l, k + 1, p, r)
            }
            d.addClass("active").siblings().removeClass("active");
            "undefined" === typeof m && (m = g); ! c.loopHorizontal && c.controlArrows && (h.find(".fp-controlArrow.fp-prev").toggle(0 != g), h.find(".fp-controlArrow.fp-next").toggle(!d.is(":last-child")));
            h.hasClass("active") && I(g, m, l, k);
            var u = function() {
                q || b.isFunction(c.afterSlideLoad) && c.afterSlideLoad.call(this, l, k + 1, m, g);
                t = !1
            };
            c.css3 ? (e = "translate3d(-" + e.left + "px, 0px, 0px)", ea(a.find(".fp-slidesContainer"), 0 < c.scrollingSpeed).css(fa(e)), setTimeout(function() {
                    u()
                },
                c.scrollingSpeed, c.easing)) : f.animate({
                    scrollLeft: e.left
                },
                c.scrollingSpeed, c.easing,
                function() {
                    u()
                });
            n.find(".active").removeClass("active");
            n.find("li").eq(g).find("a").addClass("active")
        }
        function ga() {
            ha();
            if (C) {
                if ("text" !== b(document.activeElement).attr("type")) {
                    var a = b(window).height();
                    Math.abs(a - M) > 20 * Math.max(M, a) / 100 && (b.fn.fullpage.reBuild(!0), M = a)
                }
            } else clearTimeout(ia),
                ia = setTimeout(function() {
                        b.fn.fullpage.reBuild(!0)
                    },
                    500)
        }
        function ha() {
            if (c.responsive) {
                var a = g.hasClass("fp-responsive");
                b(window).width() < c.responsive ? a || (b.fn.fullpage.setAutoScrolling(!1, "internal"), b("#fp-nav").hide(), g.addClass("fp-responsive")) : a && (b.fn.fullpage.setAutoScrolling(N.autoScrolling, "internal"), b("#fp-nav").show(), g.removeClass("fp-responsive"))
            }
        }
        function ea(a) {
            var b = "all " + c.scrollingSpeed + "ms " + c.easingcss3;
            a.removeClass("fp-notransition");
            return a.css({
                "-webkit-transition": b,
                transition: b
            })
        }
        function O(a) {
            return a.addClass("fp-notransition")
        }
        function xa(a, d) {
            if (825 > a || 900 > d) {
                var c = Math.min(100 * a / 825, 100 * d / 900).toFixed(2);
                b("body").css("font-size", c + "%")
            } else b("body").css("font-size", "100%")
        }
        function H(a, d) {
            c.menu && (b(c.menu).find(".active").removeClass("active"), b(c.menu).find('[data-menuanchor="' + a + '"]').addClass("active"));
            c.navigation && (b("#fp-nav").find(".active").removeClass("active"), a ? b("#fp-nav").find('a[href="#' + a + '"]').addClass("active") : b("#fp-nav").find("li").eq(d).find("a").addClass("active"))
        }
        function G(a) {
            var d = b(".fp-section.active").index(".fp-section");
            a = a.index(".fp-section");
            return d == a ? "none": d > a ? "up": "down"
        }
        function y(a) {
            a.css("overflow", "hidden");
            var b = a.closest(".fp-section"),
                e = a.find(".fp-scrollable");
            if (e.length) var f = e.get(0).scrollHeight;
            else f = a.get(0).scrollHeight,
            c.verticalCentered && (f = a.find(".fp-tableCell").get(0).scrollHeight);
            b = h - parseInt(b.css("padding-bottom")) - parseInt(b.css("padding-top"));
            f > b ? e.length ? e.css("height", b + "px").parent().css("height", b + "px") : (c.verticalCentered ? a.find(".fp-tableCell").wrapInner('<div class="fp-scrollable" />') : a.wrapInner('<div class="fp-scrollable" />'), a.find(".fp-scrollable").slimScroll({
                allowPageScroll: !0,
                height: b + "px",
                size: "10px",
                alwaysVisible: !0
            })) : ja(a);
            a.css("overflow", "")
        }
        function ja(a) {
            a.find(".fp-scrollable").children().first().unwrap().unwrap();
            a.find(".slimScrollBar").remove();
            a.find(".slimScrollRail").remove()
        }
        function ka(a) {
            a.addClass("fp-table").wrapInner('<div class="fp-tableCell" style="height:' + la(a) + 'px;" />')
        }
        function la(a) {
            var b = h;
            if (c.paddingTop || c.paddingBottom) b = a,
            b.hasClass("fp-section") || (b = a.closest(".fp-section")),
                a = parseInt(b.css("padding-top")) + parseInt(b.css("padding-bottom")),
                b = h - a;
            return b
        }
        function aa(a, b) {
            b ? ea(g) : O(g);
            g.css(fa(a));
            setTimeout(function() {
                    g.removeClass("fp-notransition")
                },
                10)
        }
        function L(a, d) {
            "undefined" === typeof d && (d = 0);
            var c = isNaN(a) ? b('[data-anchor="' + a + '"]') : b(".fp-section").eq(a - 1);
            a === p || c.hasClass("active") ? ma(c, d) : q(c,
                function() {
                    ma(c, d)
                })
        }
        function ma(a, b) {
            if ("undefined" != typeof b) {
                var c = a.find(".fp-slides"),
                    f = c.find('[data-anchor="' + b + '"]');
                f.length || (f = c.find(".fp-slide").eq(b));
                f.length && w(c, f)
            }
        }
        function ya(a, b) {
            a.append('<div class="fp-slidesNav"><ul></ul></div>');
            var e = a.find(".fp-slidesNav");
            e.addClass(c.slidesNavPosition);
            for (var f = 0; f < b; f++) e.find("ul").append('<li><a href="#"><span></span></a></li>');
            e.css("margin-left", "-" + e.width() / 2 + "px");
            e.find("li").first().find("a").addClass("active")
        }
        function I(a, b, e, f) {
            var g = "";
            c.anchors.length ? (a ? ("undefined" !== typeof e && (g = e), "undefined" === typeof b && (b = a), K = b, na(g + "/" + b)) : ("undefined" !== typeof a && (K = b), na(e)), D(location.hash)) : "undefined" !== typeof a ? D(f + "-" + a) : D(String(f))
        }
        function na(a) {
            if (c.recordHistory) location.hash = a;
            else if (C || P) history.replaceState(void 0, void 0, "#" + a);
            else {
                var b = window.location.href.split("#")[0];
                window.location.replace(b + "#" + a)
            }
        }
        function D(a) {
            a = a.replace("/", "-").replace("#", "");
            b("body")[0].className = b("body")[0].className.replace(/\b\s?fp-viewing-[^\s]+\b/g, "");
            b("body").addClass("fp-viewing-" + a)
        }
        function za() {
            var a = document.createElement("p"),
                b,
                c = {
                    webkitTransform: "-webkit-transform",
                    OTransform: "-o-transform",
                    msTransform: "-ms-transform",
                    MozTransform: "-moz-transform",
                    transform: "transform"
                };
            document.body.insertBefore(a, null);
            for (var f in c) void 0 !== a.style[f] && (a.style[f] = "translate3d(1px,1px,1px)", b = window.getComputedStyle(a).getPropertyValue(c[f]));
            document.body.removeChild(a);
            return void 0 !== b && 0 < b.length && "none" !== b
        }
        function oa() {
            return window.PointerEvent ? {
                down: "pointerdown",
                move: "pointermove"
            }: {
                down: "MSPointerDown",
                move: "MSPointerMove"
            }
        }
        function X(a) {
            var b = [];
            b.y = "undefined" !== typeof a.pageY && (a.pageY || a.pageX) ? a.pageY: a.touches[0].pageY;
            b.x = "undefined" !== typeof a.pageX && (a.pageY || a.pageX) ? a.pageX: a.touches[0].pageX;
            return b
        }
        function J(a) {
            b.fn.fullpage.setScrollingSpeed(0, "internal");
            w(a.closest(".fp-slides"), a);
            b.fn.fullpage.setScrollingSpeed(N.scrollingSpeed, "internal")
        }
        function n(a) {
            c.scrollBar ? g.scrollTop(a) : c.css3 ? aa("translate3d(0px, -" + a + "px, 0px)", !1) : g.css("top", -a)
        }
        function fa(a) {
            return {
                "-webkit-transform": a,
                "-moz-transform": a,
                "-ms-transform": a,
                transform: a
            }
        }
        function Aa() {
            n(0);
            b("#fp-nav, .fp-slidesNav, .fp-controlArrow").remove();
            b(".fp-section").css({
                height: "",
                "background-color": "",
                padding: ""
            });
            b(".fp-slide").css({
                width: ""
            });
            g.css({
                height: "",
                position: "",
                "-ms-touch-action": "",
                "touch-action": ""
            });
            b(".fp-section, .fp-slide").each(function() {
                ja(b(this));
                b(this).removeClass("fp-table active")
            });
            O(g);
            O(g.find(".fp-easing"));
            g.find(".fp-tableCell, .fp-slidesContainer, .fp-slides").each(function() {
                b(this).replaceWith(this.childNodes)
            });
            b("html, body").scrollTop(0)
        }
        function Q(a, b, e) {
            c[a] = b;
            "internal" !== e && (N[a] = b)
        }
        function E(a, b) {
            console && console[a] && console[a]("fullPage: " + b)
        }
        c = b.extend({
                menu: !1,
                anchors: [],
                navigation: !1,
                navigationPosition: "right",
                navigationColor: "#000",
                navigationTooltips: [],
                slidesNavigation: !1,
                slidesNavPosition: "bottom",
                scrollBar: !1,
                css3: !0,
                scrollingSpeed: 700,
                autoScrolling: !0,
                easing: "easeInQuart",
                easingcss3: "ease",
                loopBottom: !1,
                loopTop: !1,
                loopHorizontal: !0,
                continuousVertical: !1,
                normalScrollElements: null,
                scrollOverflow: !1,
                touchSensitivity: 5,
                normalScrollElementTouchThreshold: 5,
                keyboardScrolling: !0,
                animateAnchor: !0,
                recordHistory: !0,
                controlArrows: !0,
                controlArrowColor: "#fff",
                verticalCentered: !0,
                resize: !0,
                sectionsColor: [],
                paddingTop: 0,
                paddingBottom: 0,
                fixedElements: null,
                responsive: 0,
                sectionSelector: ".section",
                slideSelector: ".slide",
                afterLoad: null,
                onLeave: null,
                afterRender: null,
                afterResize: null,
                afterReBuild: null,
                afterSlideLoad: null,
                onSlideLeave: null
            },
            c); (function() {
            c.continuousVertical && (c.loopTop || c.loopBottom) && (c.continuousVertical = !1, E("warn", "Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled"));
            c.continuousVertical && c.scrollBar && (c.continuousVertical = !1, E("warn", "Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled"));
            b.each(c.anchors,
                function(a, c) { (b("#" + c).length || b('[name="' + c + '"]').length) && E("error", "data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).")
                })
        })();
        b.extend(b.easing, {
            easeInQuart: function(a, b, c, f, g) {
                return f * (b /= g) * b * b * b + c
            }
        });
        b.fn.fullpage.setAutoScrolling = function(a, d) {
            Q("autoScrolling", a, d);
            var e = b(".fp-section.active");
            c.autoScrolling && !c.scrollBar ? (b("html, body").css({
                overflow: "hidden",
                height: "100%"
            }), b.fn.fullpage.setRecordHistory(c.recordHistory, "internal"), g.css({
                "-ms-touch-action": "none",
                "touch-action": "none"
            }), e.length && n(e.position().top)) : (b("html, body").css({
                overflow: "visible",
                height: "initial"
            }), b.fn.fullpage.setRecordHistory(!1, "internal"), g.css({
                "-ms-touch-action": "",
                "touch-action": ""
            }), n(0), b("html, body").scrollTop(e.position().top))
        };
        b.fn.fullpage.setRecordHistory = function(a, b) {
            Q("recordHistory", a, b)
        };
        b.fn.fullpage.setScrollingSpeed = function(a, b) {
            Q("scrollingSpeed", a, b)
        };
        b.fn.fullpage.setMouseWheelScrolling = function(a) {
            a ? document.addEventListener ? (document.addEventListener("mousewheel", r, !1), document.addEventListener("wheel", r, !1)) : document.attachEvent("onmousewheel", r) : document.addEventListener ? (document.removeEventListener("mousewheel", r, !1), document.removeEventListener("wheel", r, !1)) : document.detachEvent("onmousewheel", r)
        };
        b.fn.fullpage.setAllowScrolling = function(a, c) {
            if ("undefined" != typeof c) c = c.replace(" ", "").split(","),
                b.each(c,
                    function(c, d) {
                        switch (d) {
                            case "up":
                                l.up = a;
                                break;
                            case "down":
                                l.down = a;
                                break;
                            case "left":
                                l.left = a;
                                break;
                            case "right":
                                l.right = a;
                                break;
                            case "all":
                                b.fn.fullpage.setAllowScrolling(a)
                        }
                    });
            else if (a) {
                if (b.fn.fullpage.setMouseWheelScrolling(!0), C || P) MSPointer = oa(),
                    b(document).off("touchstart " + MSPointer.down).on("touchstart " + MSPointer.down, ta),
                    b(document).off("touchmove " + MSPointer.move).on("touchmove " + MSPointer.move, sa)
            } else if (b.fn.fullpage.setMouseWheelScrolling(!1), C || P) MSPointer = oa(),
                b(document).off("touchstart " + MSPointer.down),
                b(document).off("touchmove " + MSPointer.move)
        };
        b.fn.fullpage.setKeyboardScrolling = function(a) {
            c.keyboardScrolling = a
        };
        b.fn.fullpage.moveSectionUp = function() {
            var a = b(".fp-section.active").prev(".fp-section");
            a.length || !c.loopTop && !c.continuousVertical || (a = b(".fp-section").last());
            a.length && q(a, null, !0)
        };
        b.fn.fullpage.moveSectionDown = function() {
            var a = b(".fp-section.active").next(".fp-section");
            a.length || !c.loopBottom && !c.continuousVertical || (a = b(".fp-section").first());
            a.length && q(a, null, !1)
        };
        b.fn.fullpage.moveTo = function(a, c) {
            var e = "",
                e = isNaN(a) ? b('[data-anchor="' + a + '"]') : b(".fp-section").eq(a - 1);
            "undefined" !== typeof c ? L(a, c) : 0 < e.length && q(e)
        };
        b.fn.fullpage.moveSlideRight = function() {
            Y("next")
        };
        b.fn.fullpage.moveSlideLeft = function() {
            Y("prev")
        };
        b.fn.fullpage.reBuild = function(a) {
            x = !0;
            var d = b(window).width();
            h = b(window).height();
            c.resize && xa(h, d);
            b(".fp-section").each(function() {
                parseInt(b(this).css("padding-bottom"));
                parseInt(b(this).css("padding-top"));
                c.verticalCentered && b(this).find(".fp-tableCell").css("height", la(b(this)) + "px");
                b(this).css("height", h + "px");
                if (c.scrollOverflow) {
                    var a = b(this).find(".fp-slide");
                    a.length ? a.each(function() {
                        y(b(this))
                    }) : y(b(this))
                }
                a = b(this).find(".fp-slides");
                a.length && w(a, a.find(".fp-slide.active"))
            });
            b(".fp-section.active").position();
            d = b(".fp-section.active");
            d.index(".fp-section") && q(d);
            x = !1;
            b.isFunction(c.afterResize) && a && c.afterResize.call(this);
            b.isFunction(c.afterReBuild) && !a && c.afterReBuild.call(this)
        };
        var t = !1,
            C = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/),
            P = "ontouchstart" in window || 0 < navigator.msMaxTouchPoints || navigator.maxTouchPoints,
            g = b(this),
            h = b(window).height(),
            m = !1,
            x = !1,
            p,
            K,
            k,
            ca = "fullpage-wrapper",
            l = {
                up: !0,
                down: !0,
                left: !0,
                right: !0
            },
            N = jQuery.extend(!0, {},
                c);
        b.fn.fullpage.setAllowScrolling(!0);
        c.css3 && (c.css3 = za());
        b(this).length ? (g.css({
            height: "100%",
            position: "relative"
        }), g.addClass(ca)) : E("error", "Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();");
        b(c.sectionSelector).each(function() {
            b(this).addClass("fp-section")
        });
        b(c.slideSelector).each(function() {
            b(this).addClass("fp-slide")
        });
        c.navigation && qa();
        b(".fp-section").each(function(a) {
            var d = b(this),
                e = b(this).find(".fp-slide"),
                f = e.length;
            a || 0 !== b(".fp-section.active").length || b(this).addClass("active");
            b(this).css("height", h + "px"); (c.paddingTop || c.paddingBottom) && b(this).css("padding", c.paddingTop + " 0 " + c.paddingBottom + " 0");
            "undefined" !== typeof c.sectionsColor[a] && b(this).css("background-color", c.sectionsColor[a]);
            "undefined" !== typeof c.anchors[a] && b(this).attr("data-anchor", c.anchors[a]);
            if (1 < f) {
                a = 100 * f;
                var g = 100 / f;
                e.wrapAll('<div class="fp-slidesContainer" />');
                e.parent().wrap('<div class="fp-slides" />');
                b(this).find(".fp-slidesContainer").css("width", a + "%");
                c.controlArrows && pa(b(this));
                c.slidesNavigation && ya(b(this), f);
                e.each(function(a) {
                    b(this).css("width", g + "%");
                    c.verticalCentered && ka(b(this))
                });
                d = d.find(".fp-slide.active");
                0 == d.length ? e.eq(0).addClass("active") : J(d)
            } else c.verticalCentered && ka(b(this))
        }).promise().done(function() {
            b.fn.fullpage.setAutoScrolling(c.autoScrolling, "internal");
            var a = b(".fp-section.active").find(".fp-slide.active");
            a.length && (0 != b(".fp-section.active").index(".fp-section") || 0 == b(".fp-section.active").index(".fp-section") && 0 != a.index()) && J(a);
            c.fixedElements && c.css3 && b(c.fixedElements).appendTo("body");
            c.navigation && (k.css("margin-top", "-" + k.height() / 2 + "px"), k.find("li").eq(b(".fp-section.active").index(".fp-section")).find("a").addClass("active"));
            c.menu && c.css3 && b(c.menu).closest(".fullpage-wrapper").length && b(c.menu).appendTo("body");
            c.scrollOverflow ? ("complete" === document.readyState && R(), b(window).on("load", R)) : b.isFunction(c.afterRender) && c.afterRender.call(this);
            ha();
            a = window.location.hash.replace("#", "").split("/")[0];
            if (a.length) {
                var d = b('[data-anchor="' + a + '"]'); ! c.animateAnchor && d.length && (c.autoScrolling ? n(d.position().top) : (n(0), D(a), b("html, body").scrollTop(d.position().top)), H(a, null), b.isFunction(c.afterLoad) && c.afterLoad.call(this, a, d.index(".fp-section") + 1), d.addClass("active").siblings().removeClass("active"))
            }
            b(window).on("load",
                function() {
                    var a = window.location.hash.replace("#", "").split("/"),
                        b = a[0],
                        a = a[1];
                    b && L(b, a)
                })
        });
        var T, U, F = !1;
        b(window).on("scroll", S);
        var v = 0,
            B = 0,
            u = 0,
            A = 0;
        b(window).on("hashchange", da);
        b(document).keydown(function(a) {
            if (c.keyboardScrolling && c.autoScrolling && (40 != a.which && 38 != a.which || a.preventDefault(), !m)) switch (a.which) {
                case 38:
                case 33:
                    b.fn.fullpage.moveSectionUp();
                    break;
                case 40:
                case 34:
                    b.fn.fullpage.moveSectionDown();
                    break;
                case 36:
                    b.fn.fullpage.moveTo(1);
                    break;
                case 35:
                    b.fn.fullpage.moveTo(b(".fp-section").length);
                    break;
                case 37:
                    b.fn.fullpage.moveSlideLeft();
                    break;
                case 39:
                    b.fn.fullpage.moveSlideRight()
            }
        });
        b(document).on("click touchstart", "#fp-nav a",
            function(a) {
                a.preventDefault();
                a = b(this).parent().index();
                q(b(".fp-section").eq(a))
            });
        b(document).on("click touchstart", ".fp-slidesNav a",
            function(a) {
                a.preventDefault();
                a = b(this).closest(".fp-section").find(".fp-slides");
                var c = a.find(".fp-slide").eq(b(this).closest("li").index());
                w(a, c)
            });
        c.normalScrollElements && (b(document).on("mouseenter", c.normalScrollElements,
            function() {
                b.fn.fullpage.setMouseWheelScrolling(!1)
            }), b(document).on("mouseleave", c.normalScrollElements,
            function() {
                b.fn.fullpage.setMouseWheelScrolling(!0)
            }));
        b(".fp-section").on("click touchstart", ".fp-controlArrow",
            function() {
                b(this).hasClass("fp-prev") ? b.fn.fullpage.moveSlideLeft() : b.fn.fullpage.moveSlideRight()
            });
        b(window).resize(ga);
        var M = h,
            ia;
        b.fn.fullpage.destroy = function(a) {
            b.fn.fullpage.setAutoScrolling(!1, "internal");
            b.fn.fullpage.setAllowScrolling(!1);
            b.fn.fullpage.setKeyboardScrolling(!1);
            b(window).off("scroll", S).off("hashchange", da).off("resize", ga);
            b(document).off("click", "#fp-nav a").off("mouseenter", "#fp-nav li").off("mouseleave", "#fp-nav li").off("click", ".fp-slidesNav a").off("mouseover", c.normalScrollElements).off("mouseout", c.normalScrollElements);
            b(".fp-section").off("click", ".fp-controlArrow");
            a && Aa()
        }
    }
})(jQuery);


/*!
 * SuperSlide v2.1 
 * 轻松解决网站大部分特效展示问题
 * 详尽信息请看官网：http://www.SuperSlide2.com/
 *
 * Copyright 2011-2013, 大话主席
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 */
(function(a){a.fn.slide=function(b){return a.fn.slide.defaults={type:"slide",effect:"fade",autoPlay:!1,delayTime:500,interTime:2500,triggerTime:150,defaultIndex:0,titCell:".hd li",mainCell:".bd",targetCell:null,trigger:"mouseover",scroll:1,vis:1,titOnClassName:"on",autoPage:!1,prevCell:".prev",nextCell:".next",pageStateCell:".pageState",opp:!1,pnLoop:!0,easing:"swing",startFun:null,endFun:null,switchLoad:null,playStateCell:".playState",mouseOverStop:!0,defaultPlay:!0,returnDefault:!1},this.each(function(){var c=a.extend({},a.fn.slide.defaults,b),d=a(this),e=c.effect,f=a(c.prevCell,d),g=a(c.nextCell,d),h=a(c.pageStateCell,d),i=a(c.playStateCell,d),j=a(c.titCell,d),k=j.size(),l=a(c.mainCell,d),m=l.children().size(),n=c.switchLoad,o=a(c.targetCell,d),p=parseInt(c.defaultIndex),q=parseInt(c.delayTime),r=parseInt(c.interTime);parseInt(c.triggerTime);var P,t=parseInt(c.scroll),u=parseInt(c.vis),v="false"==c.autoPlay||0==c.autoPlay?!1:!0,w="false"==c.opp||0==c.opp?!1:!0,x="false"==c.autoPage||0==c.autoPage?!1:!0,y="false"==c.pnLoop||0==c.pnLoop?!1:!0,z="false"==c.mouseOverStop||0==c.mouseOverStop?!1:!0,A="false"==c.defaultPlay||0==c.defaultPlay?!1:!0,B="false"==c.returnDefault||0==c.returnDefault?!1:!0,C=0,D=0,E=0,F=0,G=c.easing,H=null,I=null,J=null,K=c.titOnClassName,L=j.index(d.find("."+K)),M=p=defaultIndex=-1==L?p:L,N=p,O=m>=u?0!=m%t?m%t:t:0,Q="leftMarquee"==e||"topMarquee"==e?!0:!1,R=function(){a.isFunction(c.startFun)&&c.startFun(p,k,d,a(c.titCell,d),l,o,f,g)},S=function(){a.isFunction(c.endFun)&&c.endFun(p,k,d,a(c.titCell,d),l,o,f,g)},T=function(){j.removeClass(K),A&&j.eq(defaultIndex).addClass(K)};if("menu"==c.type)return A&&j.removeClass(K).eq(p).addClass(K),j.hover(function(){P=a(this).find(c.targetCell);var b=j.index(a(this));I=setTimeout(function(){switch(p=b,j.removeClass(K).eq(p).addClass(K),R(),e){case"fade":P.stop(!0,!0).animate({opacity:"show"},q,G,S);break;case"slideDown":P.stop(!0,!0).animate({height:"show"},q,G,S)}},c.triggerTime)},function(){switch(clearTimeout(I),e){case"fade":P.animate({opacity:"hide"},q,G);break;case"slideDown":P.animate({height:"hide"},q,G)}}),B&&d.hover(function(){clearTimeout(J)},function(){J=setTimeout(T,q)}),void 0;if(0==k&&(k=m),Q&&(k=2),x){if(m>=u)if("leftLoop"==e||"topLoop"==e)k=0!=m%t?(0^m/t)+1:m/t;else{var U=m-u;k=1+parseInt(0!=U%t?U/t+1:U/t),0>=k&&(k=1)}else k=1;j.html("");var V="";if(1==c.autoPage||"true"==c.autoPage)for(var W=0;k>W;W++)V+="<li>"+(W+1)+"</li>";else for(var W=0;k>W;W++)V+=c.autoPage.replace("$",W+1);j.html(V);var j=j.children()}if(m>=u){l.children().each(function(){a(this).width()>E&&(E=a(this).width(),D=a(this).outerWidth(!0)),a(this).height()>F&&(F=a(this).height(),C=a(this).outerHeight(!0))});var X=l.children(),Y=function(){for(var a=0;u>a;a++)X.eq(a).clone().addClass("clone").appendTo(l);for(var a=0;O>a;a++)X.eq(m-a-1).clone().addClass("clone").prependTo(l)};switch(e){case"fold":l.css({position:"relative",width:D,height:C}).children().css({position:"absolute",width:E,left:0,top:0,display:"none"});break;case"top":l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+u*C+'px"></div>').css({top:-(p*t)*C,position:"relative",padding:"0",margin:"0"}).children().css({height:F});break;case"left":l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+u*D+'px"></div>').css({width:m*D,left:-(p*t)*D,position:"relative",overflow:"hidden",padding:"0",margin:"0"}).children().css({"float":"left",width:E});break;case"leftLoop":case"leftMarquee":Y(),l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+u*D+'px"></div>').css({width:(m+u+O)*D,position:"relative",overflow:"hidden",padding:"0",margin:"0",left:-(O+p*t)*D}).children().css({"float":"left",width:E});break;case"topLoop":case"topMarquee":Y(),l.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+u*C+'px"></div>').css({height:(m+u+O)*C,position:"relative",padding:"0",margin:"0",top:-(O+p*t)*C}).children().css({height:F})}}var Z=function(a){var b=a*t;return a==k?b=m:-1==a&&0!=m%t&&(b=-m%t),b},$=function(b){var c=function(c){for(var d=c;u+c>d;d++)b.eq(d).find("img["+n+"]").each(function(){var b=a(this);if(b.attr("src",b.attr(n)).removeAttr(n),l.find(".clone")[0])for(var c=l.children(),d=0;c.size()>d;d++)c.eq(d).find("img["+n+"]").each(function(){a(this).attr(n)==b.attr("src")&&a(this).attr("src",a(this).attr(n)).removeAttr(n)})})};switch(e){case"fade":case"fold":case"top":case"left":case"slideDown":c(p*t);break;case"leftLoop":case"topLoop":c(O+Z(N));break;case"leftMarquee":case"topMarquee":var d="leftMarquee"==e?l.css("left").replace("px",""):l.css("top").replace("px",""),f="leftMarquee"==e?D:C,g=O;if(0!=d%f){var h=Math.abs(0^d/f);g=1==p?O+h:O+h-1}c(g)}},_=function(a){if(!A||M!=p||a||Q){if(Q?p>=1?p=1:0>=p&&(p=0):(N=p,p>=k?p=0:0>p&&(p=k-1)),R(),null!=n&&$(l.children()),o[0]&&(P=o.eq(p),null!=n&&$(o),"slideDown"==e?(o.not(P).stop(!0,!0).slideUp(q),P.slideDown(q,G,function(){l[0]||S()})):(o.not(P).stop(!0,!0).hide(),P.animate({opacity:"show"},q,function(){l[0]||S()}))),m>=u)switch(e){case"fade":l.children().stop(!0,!0).eq(p).animate({opacity:"show"},q,G,function(){S()}).siblings().hide();break;case"fold":l.children().stop(!0,!0).eq(p).animate({opacity:"show"},q,G,function(){S()}).siblings().animate({opacity:"hide"},q,G);break;case"top":l.stop(!0,!1).animate({top:-p*t*C},q,G,function(){S()});break;case"left":l.stop(!0,!1).animate({left:-p*t*D},q,G,function(){S()});break;case"leftLoop":var b=N;l.stop(!0,!0).animate({left:-(Z(N)+O)*D},q,G,function(){-1>=b?l.css("left",-(O+(k-1)*t)*D):b>=k&&l.css("left",-O*D),S()});break;case"topLoop":var b=N;l.stop(!0,!0).animate({top:-(Z(N)+O)*C},q,G,function(){-1>=b?l.css("top",-(O+(k-1)*t)*C):b>=k&&l.css("top",-O*C),S()});break;case"leftMarquee":var c=l.css("left").replace("px","");0==p?l.animate({left:++c},0,function(){l.css("left").replace("px","")>=0&&l.css("left",-m*D)}):l.animate({left:--c},0,function(){-(m+O)*D>=l.css("left").replace("px","")&&l.css("left",-O*D)});break;case"topMarquee":var d=l.css("top").replace("px","");0==p?l.animate({top:++d},0,function(){l.css("top").replace("px","")>=0&&l.css("top",-m*C)}):l.animate({top:--d},0,function(){-(m+O)*C>=l.css("top").replace("px","")&&l.css("top",-O*C)})}j.removeClass(K).eq(p).addClass(K),M=p,y||(g.removeClass("nextStop"),f.removeClass("prevStop"),0==p&&f.addClass("prevStop"),p==k-1&&g.addClass("nextStop")),h.html("<span>"+(p+1)+"</span>/"+k)}};A&&_(!0),B&&d.hover(function(){clearTimeout(J)},function(){J=setTimeout(function(){p=defaultIndex,A?_():"slideDown"==e?P.slideUp(q,T):P.animate({opacity:"hide"},q,T),M=p},300)});var ab=function(a){H=setInterval(function(){w?p--:p++,_()},a?a:r)},bb=function(a){H=setInterval(_,a?a:r)},cb=function(){z||(clearInterval(H),ab())},db=function(){(y||p!=k-1)&&(p++,_(),Q||cb())},eb=function(){(y||0!=p)&&(p--,_(),Q||cb())},fb=function(){clearInterval(H),Q?bb():ab(),i.removeClass("pauseState")},gb=function(){clearInterval(H),i.addClass("pauseState")};if(v?Q?(w?p--:p++,bb(),z&&l.hover(gb,fb)):(ab(),z&&d.hover(gb,fb)):(Q&&(w?p--:p++),i.addClass("pauseState")),i.click(function(){i.hasClass("pauseState")?fb():gb()}),"mouseover"==c.trigger?j.hover(function(){var a=j.index(this);I=setTimeout(function(){p=a,_(),cb()},c.triggerTime)},function(){clearTimeout(I)}):j.click(function(){p=j.index(this),_(),cb()}),Q){if(g.mousedown(db),f.mousedown(eb),y){var hb,ib=function(){hb=setTimeout(function(){clearInterval(H),bb(0^r/10)},150)},jb=function(){clearTimeout(hb),clearInterval(H),bb()};g.mousedown(ib),g.mouseup(jb),f.mousedown(ib),f.mouseup(jb)}"mouseover"==c.trigger&&(g.hover(db,function(){}),f.hover(eb,function(){}))}else g.click(db),f.click(eb)})}})(jQuery),jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return 1>(b/=e/2)?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return 1>(b/=e/2)?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return 1>(b/=e/2)?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return 1>(b/=e/2)?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return 0==b?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return 0==b?c:b==e?c+d:1>(b/=e/2)?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return 1>(b/=e/2)?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),Math.abs(d)>h){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(1==(b/=e))return c+d;if(g||(g=.3*e),Math.abs(d)>h){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(0==b)return c;if(2==(b/=e/2))return c+d;if(g||(g=e*.3*1.5),Math.abs(d)>h){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return 1>b?-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:.5*h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){return void 0==f&&(f=1.70158),1>(b/=e/2)?d/2*b*b*(((f*=1.525)+1)*b-f)+c:d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){return 1/2.75>(b/=e)?d*7.5625*b*b+c:2/2.75>b?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:2.5/2.75>b?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(a,b,c,d,e){return e/2>b?.5*jQuery.easing.easeInBounce(a,2*b,0,d,e)+c:.5*jQuery.easing.easeOutBounce(a,2*b-e,0,d,e)+.5*d+c}});

/*!
 * TouchSlide v1.1
 * javascript触屏滑动特效插件，移动端滑动特效，触屏焦点图，触屏Tab切换，触屏多图切换等
 * 详尽信息请看官网：http://www.SuperSlide2.com/TouchSlide/
 *
 * Copyright 2013 大话主席
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途

 * 1.1 宽度自适应（修复安卓横屏时滑动范围不变的bug）
 */
var TouchSlide = function(a){

    a = a||{};
    var opts = {
        slideCell:a.slideCell || "#touchSlide", //运行效果主对象，必须用id！，例如 slideCell:"#touchSlide"
        titCell:a.titCell || ".hd li", // 导航对象，当自动分页设为true时为“导航对象包裹层”
        mainCell:a.mainCell || ".bd", // 切换对象包裹层
        effect:a.effect || "left", // 效果，支持 left、leftLoop
        autoPlay:a.autoPlay || false, // 自动播放
        delayTime:a.delayTime || 500, // 效果持续时间
        interTime:a.interTime ||5000, // 自动运行间隔
        defaultIndex:a.defaultIndex ||0, // 默认的当前位置索引。0是第一个； defaultIndex:1 时，相当于从第2个开始执行
        titOnClassName:a.titOnClassName ||"on", // 当前导航对象添加的className
        autoPage:a.autoPage || false, // 自动分页，当为true时titCell为“导航对象包裹层”
        prevCell:a.prevCell ||".prev", // 前一页按钮
        nextCell:a.nextCell ||".next", // 后一页按钮
        pageStateCell:a.pageStateCell ||".pageState", // 分页状态对象，用于显示分页状态，例如：2/3
        pnLoop:a.pnLoop=='undefined '?true:a.pnLoop , // 前后按钮点击是否继续执行效果，当为最前/后页是会自动添加“prevStop”/“nextStop”控制样色
        startFun:a.startFun || null, // 每次切换效果开始时执行函数，用于处理特殊情况或创建更多效果。用法 satrtFun:function(i,c){ }； 其中i为当前分页，c为总页数
        endFun:a.endFun || null, // 每次切换效果结束时执行函数，用于处理特殊情况或创建更多效果。用法 endFun:function(i,c){ }； 其中i为当前分页，c为总页数
        switchLoad:a.switchLoad || null //每次切换效果结束时执行函数，用于处理特殊情况或创建更多效果。用法 endFun:function(i,c){ }； 其中i为当前分页，c为总页数
    }

    var slideCell = document.getElementById(opts.slideCell.replace("#",""));
    if( !slideCell ) return false;


    //简单模拟jquery选择器
    var obj = function(str,parEle){
        str = str.split(" ");
        var par = [];
        parEle = parEle||document;
        var retn = [ parEle ] ;
        for( var i in str ){ if(str[i].length!=0) par.push(str[i]) } //去掉重复空格
        for( var i in par ){
            if( retn.length==0 ) return false;
            var _retn = [];
            for ( var r in retn )
            {
                if( par[i][0] =="#" ) _retn.push( document.getElementById( par[i].replace("#","") ) );
                else if( par[i][0] =="." ){
                    var tag = retn[r].getElementsByTagName('*');
                    for( var j=0; j<tag.length; j++ ){
                        var cln = tag[j].className;
                        if( cln && cln.search(new RegExp("\\b" + par[i].replace(".","") + "\\b"))!=-1 ){ _retn.push( tag[j] ); }
                    }
                }
                else { var tag = retn[r].getElementsByTagName( par[i] ); for( var j=0; j<tag.length; j++ ){ _retn.push( tag[j] ) } }
            }
            retn =_retn;
        }

        return retn.length==0 || retn[0] == parEle ? false:retn;
    }// obj E

    // 创建包裹层
    var wrap = function(el, v){
        var tmp = document.createElement('div');
        tmp.innerHTML = v;
        tmp = tmp.children[0];
        var _el = el.cloneNode(true);
        tmp.appendChild(_el);
        el.parentNode.replaceChild(tmp, el);
        conBox = _el; // 重置conBox
        return tmp;
    };

    // 获取样色数值
    var getStyleVal =function(el, attr){ var v=0; if(el.currentStyle){ v= el.currentStyle[attr] } else { v= getComputedStyle(el,false)[attr]; } return parseInt(v.replace("px","")) }

    // class处理
    var addClass =function(ele, className){
        if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) != -1)) return;
        ele.className += (ele.className ? " " : "") + className;
    }

    var removeClass = function(ele, className){
        if (!ele || !className || (ele.className && ele.className.search(new RegExp("\\b" + className + "\\b")) == -1)) return;
        ele.className = ele.className.replace(new RegExp("\\s*\\b" + className + "\\b", "g"), "");
    }

    //全局对象
    var effect = opts.effect;
    var prevBtn = obj( opts.prevCell,slideCell )[0];
    var nextBtn = obj( opts.nextCell,slideCell )[0];
    var pageState = obj( opts.pageStateCell )[0];
    var conBox = obj( opts.mainCell,slideCell )[0];//内容元素父层对象
    if( !conBox ) return false;
    var conBoxSize= conBox.children.length;
    var navObj = obj( opts.titCell,slideCell );//导航子元素结合
    var navObjSize = navObj?navObj.length:conBoxSize;
    var sLoad=opts.switchLoad;

    /*字符串转换*/
    var index=parseInt(opts.defaultIndex);
    var delayTime=parseInt(opts.delayTime);
    var interTime=parseInt(opts.interTime);
    var autoPlay = (opts.autoPlay=="false"||opts.autoPlay==false)?false:true;
    var autoPage = (opts.autoPage=="false"||opts.autoPage==false)?false:true;
    var loop = (opts.pnLoop=="false"||opts.pnLoop==false)?false:true;
    var oldIndex = index;
    var inter=null;// autoPlay的setInterval
    var timeout = null; // leftLoop的setTimeout
    var endTimeout = null;  //translate的setTimeout

    var startX = 0;
    var startY = 0;
    var distX = 0;
    var distY = 0;
    var dist = 0; //手指滑动距离
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var hasTouch = 'ontouchstart' in window && !isTouchPad;
    var touchStart = hasTouch ? 'touchstart' : 'mousedown';
    //var touchMove = hasTouch ? 'touchmove' : 'mousemove';
    var touchMove = hasTouch ? 'touchmove' : '';
    var touchEnd = hasTouch ? 'touchend' : 'mouseup';
    var slideH=0;
    var slideW= conBox.parentNode.clientWidth;// mainCell滑动距离
    var twCell;
    var scrollY ;
    var tempSize = conBoxSize;

    //处理分页
    if( navObjSize==0 )navObjSize=conBoxSize;
    if( autoPage ){
        navObjSize=conBoxSize;
        navObj=navObj[0];
        navObj.innerHTML="";
        var str="";

        if( opts.autoPage==true|| opts.autoPage=="true" ){ for( var i=0; i<navObjSize; i++ ){ str+="<li>"+(i+1)+"</li>" } }
        else{ for( var i=0; i<navObjSize; i++ ){ str+=opts.autoPage.replace("$",(i+1))  } }

        navObj.innerHTML=str;
        navObj = navObj.children;//重置navObj
    }



    if( effect == "leftLoop" ){
        tempSize +=2;
        conBox.appendChild( conBox.children[0].cloneNode(true) );
        conBox.insertBefore( conBox.children[conBoxSize-1].cloneNode(true),conBox.children[0] );
    }
    twCell = wrap(conBox,'<div class="tempWrap" style="overflow:hidden; position:relative;"></div>');
    conBox.style.cssText="width:"+tempSize*slideW+"px;"+"position:relative;overflow:hidden;padding:0;margin:0;";
    for ( var i =0; i<tempSize; i++ ){  conBox.children[i].style.cssText="display:table-cell;vertical-align:top;width:"+slideW+"px"  }


    var doStartFun=function(){ if ( typeof opts.startFun =='function' ){ opts.startFun( index,navObjSize ) } }
    var doEndFun=function(){ if (  typeof opts.endFun =='function' ){ opts.endFun( index,navObjSize ) } }
    var doSwitchLoad=function( moving ){
        var curIndex = ( effect=="leftLoop"?index+1:index ) + moving;
        var changeImg = function( ind ){
            var img = conBox.children[ind].getElementsByTagName("img");
            for ( var i=0; i<img.length ; i++ )
            {
                if ( img[i].getAttribute(sLoad) ){
                    img[i].setAttribute("src", img[i].getAttribute(sLoad) );
                    img[i].removeAttribute( sLoad );
                }
            }
        }// changeImg E
        changeImg( curIndex );
        if( effect=="leftLoop" ){
            switch ( curIndex )
            {
                case 0: changeImg( conBoxSize );break;
                case 1: changeImg( conBoxSize+1 );break;
                case conBoxSize: changeImg( 0 );break;
                case conBoxSize+1: changeImg( 1 );break;
            }
        }
    }// doSwitchLoad E

    //动态设置滑动宽度
    var orientationChange = function(){
        slideW = twCell.clientWidth;
        conBox.style.width = tempSize*slideW +"px";
        for ( var i =0; i<tempSize; i++ ){  conBox.children[i].style.width=slideW+"px";  }
        var ind = effect == "leftLoop"? index+1:index;
        translate(  -ind*slideW ,0 );
    }
    window.addEventListener("resize", orientationChange, false);


    //滑动效果
    var translate = function( dist, speed, ele ) {
        if( !!ele ){ ele=ele.style; }else{ ele=conBox.style; }
        ele.webkitTransitionDuration =  ele.MozTransitionDuration = ele.msTransitionDuration = ele.OTransitionDuration = ele.transitionDuration =  speed + 'ms';
        ele.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        ele.msTransform = ele.MozTransform = ele.OTransform = 'translateX(' + dist + 'px)';
    }

    //效果函数
    var doPlay=function(isTouch){

        switch (effect)
        {
            case "left":
                if ( index >= navObjSize) { index = isTouch?index-1:0; } else if( index < 0) { index = isTouch?0:navObjSize-1; }
                if( sLoad!=null ){ doSwitchLoad(0) }
                translate(  (-index*slideW),delayTime ); oldIndex=index; break;


            case "leftLoop":
                if( sLoad!=null ){ doSwitchLoad(0) }
                translate(  -(index+1)*slideW ,delayTime );
                if ( index==-1){
                    timeout= setTimeout( function(){ translate( -navObjSize*slideW ,0 ); }, delayTime );
                    index = navObjSize-1;
                }
                else if( index==navObjSize ){ timeout= setTimeout( function(){ translate( -slideW ,0 ); }, delayTime );
                    index = 0;
                }
                oldIndex=index;
                break;// leftLoop end

        }//switch end
        doStartFun();
        endTimeout= setTimeout( function(){ doEndFun() }, delayTime );

        //设置className
        for ( var i=0; i<navObjSize; i++ )
        {
            removeClass(navObj[i],opts.titOnClassName);
            if( i == index ){ addClass(navObj[i],opts.titOnClassName) }
        }

        if( loop==false ){ //loop控制是否继续循环
            removeClass( nextBtn,"nextStop" );removeClass( prevBtn,"prevStop" );
            if (index==0 ){ addClass( prevBtn,"prevStop" ) }
            else if (index==navObjSize-1 ){ addClass( nextBtn,"nextStop" ) }
        }
        if(pageState){ pageState.innerHTML= "<span>"+(index+1)+"</span>/"+navObjSize; }

    };// doPlay end

    //初始化执行
    doPlay();

    //自动播放
    if (autoPlay) {
        inter=setInterval(function(){ index++; doPlay();}, interTime);

    }

    //
    //document.getElementById('hdul').onmousemove=function(){
    //    clearInterval(inter);
    //};
    //
    //document.getElementById('hdul').onmouseleave=function(){
    //    if (autoPlay) {
    //        inter=setInterval(function(){ index++; doPlay();}, interTime);
    //    }
    //
    //};




    //点击事件
    if( navObj ){
        for ( var i=0; i<navObjSize; i++ )
        {
            (function(){
                var j = i;
                navObj[j].addEventListener('click', function(e){ clearTimeout( timeout ); clearTimeout( endTimeout );  index=j; doPlay();  })
            })()

        }
    }
    if(nextBtn){ nextBtn.addEventListener('click', function(e){ if ( loop==true || index!=navObjSize-1 ){ clearTimeout( timeout ); clearTimeout( endTimeout ); index++; doPlay(); } }) }
    if(prevBtn){ prevBtn.addEventListener('click', function(e){ if ( loop==true || index!=0 ){ clearTimeout( timeout ); clearTimeout( endTimeout ); index--; doPlay(); } }) }



    //触摸开始函数
    var tStart = function(e){
        clearTimeout( timeout );clearTimeout( endTimeout );
        scrollY = undefined;
        distX = 0;
        var point = hasTouch ? e.touches[0] : e;
        startX =  point.pageX;
        startY =  point.pageY;

        //添加“触摸移动”事件监听
        conBox.	addEventListener(touchMove, tMove,false);
        //添加“触摸结束”事件监听
        conBox.addEventListener(touchEnd, tEnd ,false);
    }

    //触摸移动函数
    var tMove = function(e){
        if( hasTouch ){ if ( e.touches.length > 1 || e.scale && e.scale !== 1) return }; //多点或缩放

        var point = hasTouch ? e.touches[0] : e;
        distX = point.pageX-startX;
        distY = point.pageY-startY;

        if ( typeof scrollY == 'undefined') { scrollY = !!( scrollY || Math.abs(distX) < Math.abs(distY) ); }
        if( !scrollY ){
            e.preventDefault(); if(autoPlay){clearInterval(inter) }
            switch (effect){
                case "left":
                    if( (index==0 && distX>0) || (index>=navObjSize-1&&distX<0 )){ distX=distX*0.4 }
                    translate( -index*slideW+distX ,0 );
                    break;
                case "leftLoop":translate( -(index+1)*slideW+distX ,0 );break;
            }

            if(  sLoad!=null && Math.abs(distX)>slideW/3 ){
                doSwitchLoad( distX>-0?-1:1 )
            }
        }
    }

    //触摸结束函数
    var tEnd = function(e){
        if(distX==0) return;
        e.preventDefault();
        if( !scrollY )
        {
            if( Math.abs(distX) > slideW/10  ){ distX>0? index--: index++; }
            doPlay( true );
            if (autoPlay) {
                inter=setInterval(function(){ index++; doPlay() }, interTime);
            }
        }

        conBox.removeEventListener(touchMove, tMove, false);
        conBox.removeEventListener(touchEnd, tEnd, false);
    }




    //添加“触摸开始”事件监听
    conBox.addEventListener(touchStart, tStart ,false);


}// TouchSlide E







!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";var b=window.Slick||{};b=function(){function c(c,d){var f,g,e=this;if(e.defaults={accessibility:!0,arrows:!0,autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(a,b){return'<button type="button">'+(b+1)+"</button>"},dots:!1,draggable:!0,easing:"linear",fade:!1,infinite:!0,lazyLoad:"ondemand",onBeforeChange:null,onAfterChange:null,onInit:null,onReInit:null,pauseOnHover:!0,responsive:null,slide:"div",slidesToShow:1,slidesToScroll:1,speed:300,swipe:!0,touchMove:!0,touchThreshold:5,vertical:!1},e.initials={animating:!1,autoPlayTimer:null,currentSlide:0,currentLeft:null,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1},a.extend(e,e.initials),e.activeBreakpoint=null,e.animType=null,e.animProp=null,e.breakpoints=[],e.breakpointSettings=[],e.cssTransitions=!1,e.paused=!1,e.positionProp=null,e.$slider=a(c),e.$slidesCache=null,e.transformType=null,e.transitionType=null,e.windowWidth=0,e.windowTimer=null,e.options=a.extend({},e.defaults,d),e.originalSettings=e.options,f=e.options.responsive||null,f&&f.length>-1){for(g in f)f.hasOwnProperty(g)&&(e.breakpoints.push(f[g].breakpoint),e.breakpointSettings[f[g].breakpoint]=f[g].settings);e.breakpoints.sort(function(a,b){return b-a})}e.autoPlay=a.proxy(e.autoPlay,e),e.autoPlayClear=a.proxy(e.autoPlayClear,e),e.changeSlide=a.proxy(e.changeSlide,e),e.setPosition=a.proxy(e.setPosition,e),e.swipeHandler=a.proxy(e.swipeHandler,e),e.dragHandler=a.proxy(e.dragHandler,e),e.keyHandler=a.proxy(e.keyHandler,e),e.autoPlayIterator=a.proxy(e.autoPlayIterator,e),e.instanceUid=b++,e.init()}var b=0;return c}(),b.prototype.addSlide=function(b,c,d){var e=this;if("boolean"==typeof c)d=c,c=null;else if(0>c||c>=e.slideCount)return!1;e.unload(),"number"==typeof c?0===c&&0===e.$slides.length?a(b).appendTo(e.$slideTrack):d?a(b).insertBefore(e.$slides.eq(c)):a(b).insertAfter(e.$slides.eq(c)):d===!0?a(b).prependTo(e.$slideTrack):a(b).appendTo(e.$slideTrack),e.$slides=e.$slideTrack.children(this.options.slide),e.$slideTrack.children(this.options.slide).remove(),e.$slideTrack.append(e.$slides),e.$slidesCache=e.$slides,e.reinit()},b.prototype.animateSlide=function(b,c){var d={},e=this;e.transformsEnabled===!1?e.options.vertical===!1?e.$slideTrack.animate({left:b},e.options.speed,e.options.easing,c):e.$slideTrack.animate({top:b},e.options.speed,e.options.easing,c):e.cssTransitions===!1?a({animStart:e.currentLeft}).animate({animStart:b},{duration:e.options.speed,easing:e.options.easing,step:function(a){e.options.vertical===!1?(d[e.animType]="translate("+a+"px, 0px)",e.$slideTrack.css(d)):(d[e.animType]="translate(0px,"+a+"px)",e.$slideTrack.css(d))},complete:function(){c&&c.call()}}):(e.applyTransition(),d[e.animType]=e.options.vertical===!1?"translate3d("+b+"px, 0px, 0px)":"translate3d(0px,"+b+"px, 0px)",e.$slideTrack.css(d),c&&setTimeout(function(){e.disableTransition(),c.call()},e.options.speed))},b.prototype.applyTransition=function(a){var b=this,c={};c[b.transitionType]=b.options.fade===!1?b.transformType+" "+b.options.speed+"ms "+b.options.cssEase:"opacity "+b.options.speed+"ms "+b.options.cssEase,b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.autoPlay=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer),a.slideCount>a.options.slidesToShow&&a.paused!==!0&&(a.autoPlayTimer=setInterval(a.autoPlayIterator,a.options.autoplaySpeed))},b.prototype.autoPlayClear=function(){var a=this;a.autoPlayTimer&&clearInterval(a.autoPlayTimer)},b.prototype.autoPlayIterator=function(){var a=this;a.options.infinite===!1?1===a.direction?(a.currentSlide+1===a.slideCount-1&&(a.direction=0),a.slideHandler(a.currentSlide+a.options.slidesToScroll)):(0===a.currentSlide-1&&(a.direction=1),a.slideHandler(a.currentSlide-a.options.slidesToScroll)):a.slideHandler(a.currentSlide+a.options.slidesToScroll)},b.prototype.buildArrows=function(){var b=this;b.options.arrows===!0&&b.slideCount>b.options.slidesToShow&&(b.$prevArrow=a('<button type="button" class="slick-prev">Previous</button>').appendTo(b.$slider),b.$nextArrow=a('<button type="button" class="slick-next">Next</button>').appendTo(b.$slider),b.options.infinite!==!0&&b.$prevArrow.addClass("slick-disabled"))},b.prototype.buildDots=function(){var c,d,b=this;if(b.options.dots===!0&&b.slideCount>b.options.slidesToShow){for(d='<ul class="slick-dots">',c=0;c<=b.getDotCount();c+=1)d+="<li>"+b.options.customPaging.call(this,b,c)+"</li>";d+="</ul>",b.$dots=a(d).appendTo(b.$slider),b.$dots.find("li").first().addClass("slick-active")}},b.prototype.buildOut=function(){var b=this;b.$slides=b.$slider.children(b.options.slide+":not(.slick-cloned)").addClass("slick-slide"),b.slideCount=b.$slides.length,b.$slidesCache=b.$slides,b.$slider.addClass("slick-slider"),b.$slideTrack=0===b.slideCount?a('<div class="slick-track"/>').appendTo(b.$slider):b.$slides.wrapAll('<div class="slick-track"/>').parent(),b.$list=b.$slideTrack.wrap('<div class="slick-list"/>').parent(),b.$slideTrack.css("opacity",0),b.options.centerMode===!0&&(b.options.infinite=!0,b.options.slidesToScroll=1,0===b.options.slidesToShow%2&&(b.options.slidesToShow=3)),a("img[data-lazy]",b.$slider).not("[src]").addClass("slick-loading"),b.setupInfinite(),b.buildArrows(),b.buildDots(),b.options.accessibility===!0&&b.$list.prop("tabIndex",0),b.setSlideClasses(0),b.options.draggable===!0&&b.$list.addClass("draggable")},b.prototype.checkResponsive=function(){var c,d,b=this;if(b.originalSettings.responsive&&b.originalSettings.responsive.length>-1&&null!==b.originalSettings.responsive){d=null;for(c in b.breakpoints)b.breakpoints.hasOwnProperty(c)&&a(window).width()<b.breakpoints[c]&&(d=b.breakpoints[c]);null!==d?null!==b.activeBreakpoint?d!==b.activeBreakpoint&&(b.activeBreakpoint=d,b.options=a.extend({},b.defaults,b.breakpointSettings[d]),b.refresh()):(b.activeBreakpoint=d,b.options=a.extend({},b.defaults,b.breakpointSettings[d]),b.refresh()):null!==b.activeBreakpoint&&(b.activeBreakpoint=null,b.options=a.extend({},b.defaults,b.originalSettings),b.refresh())}},b.prototype.changeSlide=function(b){var c=this;switch(b.data.message){case"previous":c.slideHandler(c.currentSlide-c.options.slidesToScroll);break;case"next":c.slideHandler(c.currentSlide+c.options.slidesToScroll);break;case"index":c.slideHandler(a(b.target).parent().index()*c.options.slidesToScroll);break;default:return!1}},b.prototype.destroy=function(){var b=this;b.autoPlayClear(),b.touchObject={},a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&(b.$prevArrow.remove(),b.$nextArrow.remove()),b.$slides.unwrap().unwrap(),b.$slides.removeClass("slick-slide slick-active slick-visible").removeAttr("style"),b.$slider.removeClass("slick-slider"),b.$slider.removeClass("slick-initialized"),b.$list.off(".slick"),a(window).off(".slick-"+b.instanceUid)},b.prototype.disableTransition=function(a){var b=this,c={};c[b.transitionType]="",b.options.fade===!1?b.$slideTrack.css(c):b.$slides.eq(a).css(c)},b.prototype.fadeSlide=function(a,b){var c=this;c.cssTransitions===!1?(c.$slides.eq(a).css({zIndex:1e3}),c.$slides.eq(a).animate({opacity:1},c.options.speed,c.options.easing,b)):(c.applyTransition(a),c.$slides.eq(a).css({opacity:1,zIndex:1e3}),b&&setTimeout(function(){c.disableTransition(a),b.call()},c.options.speed))},b.prototype.filterSlides=function(a){var b=this;null!==a&&(b.unload(),b.$slideTrack.children(this.options.slide).remove(),b.$slidesCache.filter(a).appendTo(b.$slideTrack),b.reinit())},b.prototype.getCurrent=function(){var a=this;return a.currentSlide},b.prototype.getDotCount=function(){var e,a=this,b=0,c=0,d=0;for(e=a.options.infinite===!0?a.slideCount+a.options.slidesToShow-a.options.slidesToScroll:a.slideCount;e>b;)d++,c+=a.options.slidesToScroll,b=c+a.options.slidesToShow;return d},b.prototype.getLeft=function(a){var c,b=this;return b.slideOffset=0,b.options.infinite===!0?(b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideWidth*b.options.slidesToShow),0!==b.slideCount%b.options.slidesToScroll&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(b.slideOffset=-1*b.slideCount%b.options.slidesToShow*b.slideWidth)):0!==b.slideCount%b.options.slidesToShow&&a+b.options.slidesToScroll>b.slideCount&&b.slideCount>b.options.slidesToShow&&(b.slideOffset=b.slideCount%b.options.slidesToShow*b.slideWidth),b.options.centerMode===!0&&(b.slideOffset+=b.slideWidth*Math.floor(b.options.slidesToShow/2)-b.slideWidth),b.options.vertical===!1?c=-1*a*b.slideWidth+b.slideOffset:(b.listHeight=b.$list.height(),c=b.options.infinite===!0?-1*a*b.listHeight-b.listHeight:-1*a*b.listHeight),c},b.prototype.init=function(){var b=this;a(b.$slider).hasClass("slick-initialized")||(a(b.$slider).addClass("slick-initialized"),b.buildOut(),b.setProps(),b.startLoad(),b.loadSlider(),b.initializeEvents(),b.checkResponsive()),null!==b.options.onInit&&b.options.onInit.call(this,b)},b.prototype.initArrowEvents=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.on("click.slick",{message:"previous"},a.changeSlide),a.$nextArrow.on("click.slick",{message:"next"},a.changeSlide))},b.prototype.initDotEvents=function(){var b=this;b.options.dots===!0&&b.slideCount>b.options.slidesToShow&&a("li",b.$dots).on("click.slick",{message:"index"},b.changeSlide)},b.prototype.initializeEvents=function(){var b=this;b.initArrowEvents(),b.initDotEvents(),b.$list.on("touchstart.slick mousedown.slick",{action:"start"},b.swipeHandler),b.$list.on("touchmove.slick mousemove.slick",{action:"move"},b.swipeHandler),b.$list.on("touchend.slick mouseup.slick",{action:"end"},b.swipeHandler),b.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},b.swipeHandler),b.options.pauseOnHover===!0&&b.options.autoplay===!0&&(b.$list.on("mouseenter.slick",b.autoPlayClear),b.$list.on("mouseleave.slick",b.autoPlay)),b.options.accessibility===!0&&b.$list.on("keydown.slick",b.keyHandler),a(window).on("orientationchange.slick.slick-"+b.instanceUid,function(){b.checkResponsive(),b.setPosition()}),a(window).on("resize.slick.slick-"+b.instanceUid,function(){a(window).width!==b.windowWidth&&(clearTimeout(b.windowDelay),b.windowDelay=window.setTimeout(function(){b.windowWidth=a(window).width(),b.checkResponsive(),b.setPosition()},50))}),a(window).on("load.slick.slick-"+b.instanceUid,b.setPosition)},b.prototype.initUI=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.show(),a.$nextArrow.show()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.show(),a.options.autoplay===!0&&a.autoPlay()},b.prototype.keyHandler=function(a){var b=this;37===a.keyCode?b.changeSlide({data:{message:"previous"}}):39===a.keyCode&&b.changeSlide({data:{message:"next"}})},b.prototype.lazyLoad=function(){var c,d,e,f,b=this;b.options.centerMode===!0?(e=b.options.slidesToShow+b.currentSlide-1,f=e+b.options.slidesToShow+2):(e=b.options.infinite?b.options.slidesToShow+b.currentSlide:b.currentSlide,f=e+b.options.slidesToShow),c=b.$slider.find(".slick-slide").slice(e,f),a("img[data-lazy]",c).not("[src]").each(function(){a(this).css({opacity:0}).attr("src",a(this).attr("data-lazy")).removeClass("slick-loading").load(function(){a(this).animate({opacity:1},200)})}),b.currentSlide>=b.slideCount-b.options.slidesToShow?(d=b.$slider.find(".slick-cloned").slice(0,b.options.slidesToShow),a("img[data-lazy]",d).not("[src]").each(function(){a(this).css({opacity:0}).attr("src",a(this).attr("data-lazy")).removeClass("slick-loading").load(function(){a(this).animate({opacity:1},200)})})):0===b.currentSlide&&(d=b.$slider.find(".slick-cloned").slice(-1*b.options.slidesToShow),a("img[data-lazy]",d).not("[src]").each(function(){a(this).css({opacity:0}).attr("src",a(this).attr("data-lazy")).removeClass("slick-loading").load(function(){a(this).animate({opacity:1},200)})}))},b.prototype.loadSlider=function(){var a=this;a.setPosition(),a.$slideTrack.css({opacity:1}),a.$slider.removeClass("slick-loading"),a.initUI(),"progressive"===a.options.lazyLoad&&a.progressiveLazyLoad()},b.prototype.postSlide=function(a){var b=this;null!==b.options.onAfterChange&&b.options.onAfterChange.call(this,b,a),b.animating=!1,b.setPosition(),b.swipeLeft=null,b.options.autoplay===!0&&b.paused===!1&&b.autoPlay(),b.setSlideClasses(b.currentSlide)},b.prototype.progressiveLazyLoad=function(){var c,d,b=this;c=a("img[data-lazy]").not("[src]").length,c>0&&(d=a(a("img[data-lazy]",b.$slider).not("[src]").get(0)),d.attr("src",d.attr("data-lazy")).removeClass("slick-loading").load(function(){b.progressiveLazyLoad()}))},b.prototype.refresh=function(){var b=this;b.destroy(),a.extend(b,b.initials),b.init()},b.prototype.reinit=function(){var b=this;b.$slides=a(b.options.slide+":not(.slick-cloned)",b.$slideTrack).addClass("slick-slide"),b.slideCount=b.$slides.length,b.currentSlide>=b.slideCount&&0!==b.currentSlide&&(b.currentSlide=b.currentSlide-b.options.slidesToScroll),b.setProps(),b.setupInfinite(),b.buildArrows(),b.updateArrows(),b.initArrowEvents(),b.buildDots(),b.updateDots(),b.initDotEvents(),b.setSlideClasses(0),b.setPosition(),null!==b.options.onReInit&&b.options.onReInit.call(this,b)},b.prototype.removeSlide=function(a,b){var c=this;return"boolean"==typeof a?(b=a,a=b===!0?0:c.slideCount-1):a=b===!0?--a:a,c.slideCount<1||0>a||a>c.slideCount-1?!1:(c.unload(),c.$slideTrack.children(this.options.slide).eq(a).remove(),c.$slides=c.$slideTrack.children(this.options.slide),c.$slideTrack.children(this.options.slide).remove(),c.$slideTrack.append(c.$slides),c.$slidesCache=c.$slides,c.reinit(),void 0)},b.prototype.setCSS=function(a){var d,e,b=this,c={};d="left"==b.positionProp?a+"px":"0px",e="top"==b.positionProp?a+"px":"0px",c[b.positionProp]=a,b.transformsEnabled===!1?b.$slideTrack.css(c):(c={},b.cssTransitions===!1?(c[b.animType]="translate("+d+", "+e+")",b.$slideTrack.css(c)):(c[b.animType]="translate3d("+d+", "+e+", 0px)",b.$slideTrack.css(c)))},b.prototype.setDimensions=function(){var a=this;a.options.centerMode===!0?a.$slideTrack.children(".slick-slide").width(a.slideWidth):a.$slideTrack.children(".slick-slide").width(a.slideWidth),a.options.vertical===!1?(a.$slideTrack.width(Math.ceil(a.slideWidth*a.$slideTrack.children(".slick-slide").length)),a.options.centerMode===!0&&a.$list.css({padding:"0px "+a.options.centerPadding})):(a.$list.height(a.$slides.first().outerHeight()),a.$slideTrack.height(Math.ceil(a.listHeight*a.$slideTrack.children(".slick-slide").length)),a.options.centerMode===!0&&a.$list.css({padding:a.options.centerPadding+" 0px"}))},b.prototype.setFade=function(){var c,b=this;b.$slides.each(function(d,e){c=-1*b.slideWidth*d,a(e).css({position:"relative",left:c,top:0,zIndex:800,opacity:0})}),b.$slides.eq(b.currentSlide).css({zIndex:900,opacity:1})},b.prototype.setPosition=function(){var a=this;a.setValues(),a.setDimensions(),a.options.fade===!1?a.setCSS(a.getLeft(a.currentSlide)):a.setFade()},b.prototype.setProps=function(){var a=this;a.positionProp=a.options.vertical===!0?"top":"left","top"===a.positionProp?a.$slider.addClass("slick-vertical"):a.$slider.removeClass("slick-vertical"),(void 0!==document.body.style.WebkitTransition||void 0!==document.body.style.MozTransition||void 0!==document.body.style.msTransition)&&(a.cssTransitions=!0),void 0!==document.body.style.MozTransform&&(a.animType="MozTransform",a.transformType="-moz-transform",a.transitionType="MozTransition"),void 0!==document.body.style.webkitTransform&&(a.animType="webkitTransform",a.transformType="-webkit-transform",a.transitionType="webkitTransition"),void 0!==document.body.style.msTransform&&(a.animType="transform",a.transformType="transform",a.transitionType="transition"),a.transformsEnabled=null!==a.animType},b.prototype.setValues=function(){var a=this;a.listWidth=a.$list.width(),a.listHeight=a.$list.height(),a.slideWidth=Math.ceil(a.listWidth/a.options.slidesToShow)},b.prototype.setSlideClasses=function(a){var c,d,e,b=this;b.$slider.find(".slick-slide").removeClass("slick-active").removeClass("slick-center"),d=b.$slider.find(".slick-slide"),b.options.centerMode===!0?(c=Math.floor(b.options.slidesToShow/2),a>=c&&a<=b.slideCount-1-c?b.$slides.slice(a-c,a+c+1).addClass("slick-active"):(e=b.options.slidesToShow+a,d.slice(e-c+1,e+c+2).addClass("slick-active")),0===a?d.eq(d.length-1-b.options.slidesToShow).addClass("slick-center"):a===b.slideCount-1&&d.eq(b.options.slidesToShow).addClass("slick-center"),b.$slides.eq(a).addClass("slick-center")):a>0&&a<b.slideCount-b.options.slidesToShow?b.$slides.slice(a,a+b.options.slidesToShow).addClass("slick-active"):(e=b.options.slidesToShow+a,d.slice(e,e+b.options.slidesToShow).addClass("slick-active")),"ondemand"===b.options.lazyLoad&&b.lazyLoad()},b.prototype.setupInfinite=function(){var c,d,e,b=this;if((b.options.fade===!0||b.options.vertical===!0)&&(b.options.slidesToShow=1,b.options.slidesToScroll=1,b.options.centerMode=!1),b.options.infinite===!0&&b.options.fade===!1&&(d=null,b.slideCount>b.options.slidesToShow)){for(e=b.options.centerMode===!0?b.options.slidesToShow+1:b.options.slidesToShow,c=b.slideCount;c>b.slideCount-e;c-=1)d=c-1,a(b.$slides[d]).clone().attr("id","").prependTo(b.$slideTrack).addClass("slick-cloned");for(c=0;e>c;c+=1)d=c,a(b.$slides[d]).clone().attr("id","").appendTo(b.$slideTrack).addClass("slick-cloned");b.$slideTrack.find(".slick-cloned").find("[id]").each(function(){a(this).attr("id","")})}},b.prototype.slideHandler=function(a){var b,c,d,e,f=null,g=this;return g.animating===!0?!1:(b=a,f=g.getLeft(b),d=g.getLeft(g.currentSlide),e=0!==g.slideCount%g.options.slidesToScroll?g.options.slidesToScroll:0,g.currentLeft=null===g.swipeLeft?d:g.swipeLeft,g.options.infinite===!1&&(0>a||a>g.slideCount-g.options.slidesToShow+e)?(b=g.currentSlide,g.animateSlide(d,function(){g.postSlide(b)}),!1):(g.options.autoplay===!0&&clearInterval(g.autoPlayTimer),c=0>b?0!==g.slideCount%g.options.slidesToScroll?g.slideCount-g.slideCount%g.options.slidesToScroll:g.slideCount-g.options.slidesToScroll:b>g.slideCount-1?0:b,g.animating=!0,null!==g.options.onBeforeChange&&a!==g.currentSlide&&g.options.onBeforeChange.call(this,g,g.currentSlide,c),g.currentSlide=c,g.updateDots(),g.updateArrows(),g.options.fade===!0?(g.fadeSlide(c,function(){g.postSlide(c)}),!1):(g.animateSlide(f,function(){g.postSlide(c)}),void 0)))},b.prototype.startLoad=function(){var a=this;a.options.arrows===!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.hide(),a.$nextArrow.hide()),a.options.dots===!0&&a.slideCount>a.options.slidesToShow&&a.$dots.hide(),a.$slider.addClass("slick-loading")},b.prototype.swipeDirection=function(){var a,b,c,d,e=this;return a=e.touchObject.startX-e.touchObject.curX,b=e.touchObject.startY-e.touchObject.curY,c=Math.atan2(b,a),d=Math.round(180*c/Math.PI),0>d&&(d=360-Math.abs(d)),45>=d&&d>=0?"left":360>=d&&d>=315?"left":d>=135&&225>=d?"right":"vertical"},b.prototype.swipeEnd=function(b){var c=this;if(c.$list.removeClass("dragging"),void 0===c.touchObject.curX)return!1;if(c.touchObject.swipeLength>=c.touchObject.minSwipe)switch(a(b.target).on("click.slick",function(b){b.stopImmediatePropagation(),b.stopPropagation(),b.preventDefault(),a(b.target).off("click.slick")}),c.swipeDirection()){case"left":c.slideHandler(c.currentSlide+c.options.slidesToScroll),c.touchObject={};break;case"right":c.slideHandler(c.currentSlide-c.options.slidesToScroll),c.touchObject={}}else c.touchObject.startX!==c.touchObject.curX&&(c.slideHandler(c.currentSlide),c.touchObject={})},b.prototype.swipeHandler=function(a){var b=this;if("ontouchend"in document&&b.options.swipe===!1)return!1;if(b.options.draggable===!1&&!a.originalEvent.touches)return!1;switch(b.touchObject.fingerCount=a.originalEvent&&void 0!==a.originalEvent.touches?a.originalEvent.touches.length:1,b.touchObject.minSwipe=b.listWidth/b.options.touchThreshold,a.data.action){case"start":b.swipeStart(a);break;case"move":b.swipeMove(a);break;case"end":b.swipeEnd(a)}},b.prototype.swipeMove=function(a){var c,d,e,f,b=this;return f=void 0!==a.originalEvent?a.originalEvent.touches:null,c=b.getLeft(b.currentSlide),!b.$list.hasClass("dragging")||f&&1!==f.length?!1:(b.touchObject.curX=void 0!==f?f[0].pageX:a.clientX,b.touchObject.curY=void 0!==f?f[0].pageY:a.clientY,b.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(b.touchObject.curX-b.touchObject.startX,2))),d=b.swipeDirection(),"vertical"!==d?(void 0!==a.originalEvent&&b.touchObject.swipeLength>4&&a.preventDefault(),e=b.touchObject.curX>b.touchObject.startX?1:-1,b.swipeLeft=b.options.vertical===!1?c+b.touchObject.swipeLength*e:c+b.touchObject.swipeLength*(b.listHeight/b.listWidth)*e,b.options.fade===!0||b.options.touchMove===!1?!1:b.animating===!0?(b.swipeLeft=null,!1):(b.setCSS(b.swipeLeft),void 0)):void 0)},b.prototype.swipeStart=function(a){var c,b=this;return 1!==b.touchObject.fingerCount||b.slideCount<=b.options.slidesToShow?(b.touchObject={},!1):(void 0!==a.originalEvent&&void 0!==a.originalEvent.touches&&(c=a.originalEvent.touches[0]),b.touchObject.startX=b.touchObject.curX=void 0!==c?c.pageX:a.clientX,b.touchObject.startY=b.touchObject.curY=void 0!==c?c.pageY:a.clientY,b.$list.addClass("dragging"),void 0)},b.prototype.unfilterSlides=function(){var a=this;null!==a.$slidesCache&&(a.unload(),a.$slideTrack.children(this.options.slide).remove(),a.$slidesCache.appendTo(a.$slideTrack),a.reinit())},b.prototype.unload=function(){var b=this;a(".slick-cloned",b.$slider).remove(),b.$dots&&b.$dots.remove(),b.$prevArrow&&(b.$prevArrow.remove(),b.$nextArrow.remove()),b.$slides.removeClass("slick-slide slick-active slick-visible").removeAttr("style")},b.prototype.updateArrows=function(){var a=this;a.options.arrows===!0&&a.options.infinite!==!0&&a.slideCount>a.options.slidesToShow&&(a.$prevArrow.removeClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled"),0===a.currentSlide?(a.$prevArrow.addClass("slick-disabled"),a.$nextArrow.removeClass("slick-disabled")):a.currentSlide>=a.slideCount-a.options.slidesToShow&&(a.$nextArrow.addClass("slick-disabled"),a.$prevArrow.removeClass("slick-disabled")))},b.prototype.updateDots=function(){var a=this;null!==a.$dots&&(a.$dots.find("li").removeClass("slick-active"),a.$dots.find("li").eq(a.currentSlide/a.options.slidesToScroll).addClass("slick-active"))},a.fn.slick=function(a){var c=this;return c.each(function(c,d){d.slick=new b(d,a)})},a.fn.slickAdd=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.addSlide(a,b,c)})},a.fn.slickCurrentSlide=function(){var a=this;return a.get(0).slick.getCurrent()},a.fn.slickFilter=function(a){var b=this;return b.each(function(b,c){c.slick.filterSlides(a)})},a.fn.slickGoTo=function(a){var b=this;return b.each(function(b,c){c.slick.slideHandler(a)})},a.fn.slickNext=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"next"}})})},a.fn.slickPause=function(){var a=this;return a.each(function(a,b){b.slick.autoPlayClear(),b.slick.paused=!0})},a.fn.slickPlay=function(){var a=this;return a.each(function(a,b){b.slick.paused=!1,b.slick.autoPlay()})},a.fn.slickPrev=function(){var a=this;return a.each(function(a,b){b.slick.changeSlide({data:{message:"previous"}})})},a.fn.slickRemove=function(a,b){var c=this;return c.each(function(c,d){d.slick.removeSlide(a,b)})},a.fn.slickSetOption=function(a,b,c){var d=this;return d.each(function(d,e){e.slick.options[a]=b,c===!0&&(e.slick.unload(),e.slick.reinit())})},a.fn.slickUnfilter=function(){var a=this;return a.each(function(a,b){b.slick.unfilterSlides()})},a.fn.unslick=function(){var a=this;return a.each(function(a,b){b.slick.destroy()})}});