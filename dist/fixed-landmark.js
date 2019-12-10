"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = function () {
  function Box(element) {
    _classCallCheck(this, Box);

    if (typeof element == "string") {
      this.dom = document.querySelector(element);
    } else if ((typeof element === "undefined" ? "undefined" : _typeof(element)) == "object") {
      this.dom = element;
    }
    if (!this.dom) console.error("Element (" + element + ") wasn't found.");
    this.rect();
    this.styles();
  }

  _createClass(Box, [{
    key: "rect",
    value: function rect() {
      this.cachedRect = this.dom.getBoundingClientRect();
      return this.cachedRect;
    }
  }, {
    key: "styles",
    value: function styles() {
      this.cachedStyles = this.dom.currentStyle || window.getComputedStyle(this.dom);
      return this.cachedStyles;
    }
  }, {
    key: "inView",
    value: function inView() {
      var rect = this.rect();
      return rect.bottom >= 0;
    }
  }, {
    key: "classReplace",
    value: function classReplace(wrong, right) {
      var _this = this;

      var limiter = void 0;
      clearTimeout(limiter);
      limiter = setTimeout(function () {
        _this.dom.className = _this.dom.className.replace(wrong, '').replace(/\s\s/gi, ' ') + ' ' + right;
      }, 5);
    }
  }]);

  return Box;
}();

var Container = function (_Box) {
  _inherits(Container, _Box);

  function Container(element) {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, element));
  }

  return Container;
}(Box);

var FixedElement = function (_Box2) {
  _inherits(FixedElement, _Box2);

  function FixedElement(options) {
    _classCallCheck(this, FixedElement);

    var element = options.element,
        container = options.container,
        offsetValue = options.offsetValue,
        offsetElement = options.offsetElement,
        offsetFunction = options.offsetFunction,
        _options$performanceP = options.performancePriority,
        performancePriority = _options$performanceP === undefined ? true : _options$performanceP;

    var _this3 = _possibleConstructorReturn(this, (FixedElement.__proto__ || Object.getPrototypeOf(FixedElement)).call(this, element));

    _this3.container = new Container(container);
    _this3.landmark = new Landmark(_this3);
    _this3.offsetValue = offsetValue || 0;
    _this3.offsetElement = offsetElement;
    _this3.offsetFunction = offsetFunction;
    _this3.isFixed = false;
    _this3.performancePriority = performancePriority;
    _this3.reset();
    _this3.watchScroll();
    _this3.watchResize();
    _this3.update();
    return _this3;
  }

  _createClass(FixedElement, [{
    key: "watchResize",
    value: function watchResize() {
      var _this4 = this;

      this.resizeListener = window.addEventListener('resize', function () {
        _this4.reset();
        _this4.landmark.reset();
        clearTimeout(_this4.resizeLimiter);
        _this4.resizeLimiter = setTimeout(function () {
          _this4.update();
          _this4.landmark.update();
        }, 100);
      });
    }
  }, {
    key: "stopWatchResize",
    value: function stopWatchResize() {
      window.removeEventListener('resize', this.resizeListener);
    }
  }, {
    key: "watchScroll",
    value: function watchScroll() {
      var _this5 = this;

      var limiter = void 0,
          limitCount = 0;
      this.scrollListener = window.addEventListener('scroll', function () {
        if (!_this5.performancePriority) return _this5.update();
        if (limitCount < 10) clearTimeout(limiter);
        limitCount++;
        limiter = setTimeout(function () {
          _this5.update();
          limitCount = 0;
        }, 5);
      });
    }
  }, {
    key: "stopWatchScroll",
    value: function stopWatchScroll() {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.dom.removeAttribute('style');
      this.defaultPosition = this.position();
      this.defaultWidth = this.styles().defaultWidth;
      this.defaultPositionMargins = {
        top: this.styles().top,
        right: this.styles().right,
        bottom: this.styles().bottom,
        left: this.styles().left
      };
    }
  }, {
    key: "offset",
    value: function offset() {
      var offset = this.offsetValue || 0;
      if (this.offsetElement) {
        // STATIC OFFSET VALUE WILL BE ADDED TO OFFSET FROM ELEMENT
        offset += new Box(this.offsetElement).rect().height;
      }
      if (this.offsetFunction) {
        // MANUALLY EVALUATE OFFSET FROM A FUNCTION
        offset = this.offsetFunction(this, offset);
      }
      return offset;
    }
  }, {
    key: "position",
    value: function position(value) {
      if (!value) return this.styles().position;
      this.dom.style.position = value;
    }
  }, {
    key: "positionMargins",
    value: function positionMargins() {
      var _this6 = this;

      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      ['top', 'right', 'bottom', 'left'].forEach(function (attr) {
        return _this6.dom.style[attr] = values[attr] || 'auto';
      });
    }
  }, {
    key: "fix",
    value: function fix(value) {
      this.isFixed = value;
      if (this.isFixed) {
        this.dom.style.width = this.dom.offsetWidth + 'px';
        this.position('fixed');
        this.positionMargins(this);
      } else {
        this.position(this.defaultPosition);
        this.positionMargins(this.defaultPositionMargins);
        this.dom.style.width = this.defaultWidth;
      }
    }
  }, {
    key: "update",
    value: function update(ev) {
      var rect = this.rect();
      var landmarkR = this.landmark.rect();
      var containerR = this.container.rect();
      var offset = this.offset();
      var isFixed = landmarkR.top <= 0 + offset;
      var isAtContainerBottom = containerR.bottom <= rect.height + offset;
      this.top = offset;
      this.left = containerR.left;

      // IF AT CONTAINER BOTTOM STATE CHANGED
      if (isAtContainerBottom != this.atContainerBottom) {
        this.atContainerBottom = isAtContainerBottom;
        var atContainerBottomRightState = isAtContainerBottom ? 'active' : 'inactive';
        var atContainerBottomWrongState = !isAtContainerBottom ? 'active' : 'inactive';
        this.classReplace('at-container-bottom-' + atContainerBottomWrongState, 'at-container-bottom-' + atContainerBottomRightState);
      }

      if (this.atContainerBottom) {
        this.top += containerR.bottom - rect.height - offset;
      }

      this.top += 'px';
      this.left += 'px';

      // IF FIXED CHANGED
      if (this.landmark.isEnabled != isFixed) {
        if (!isFixed) this.landmark.update();
        this.landmark.display(isFixed);
        // SET FIXED OR NOT CLASSES
        var fixedRightState = isFixed ? 'active' : 'inactive';
        var fixedWrongState = !isFixed ? 'active' : 'inactive';
        this.classReplace('fixed-element-' + fixedWrongState, 'fixed-element-' + fixedRightState);
      }

      this.fix(isFixed);
    }
  }]);

  return FixedElement;
}(Box);

var Landmark = function (_Box3) {
  _inherits(Landmark, _Box3);

  function Landmark(target) {
    _classCallCheck(this, Landmark);

    var _this7 = _possibleConstructorReturn(this, (Landmark.__proto__ || Object.getPrototypeOf(Landmark)).call(this, document.createElement('div')));

    _this7.target = target;
    _this7.parent = target.dom.parentNode;
    _this7.update();
    _this7.dom.classList.add('fixed-landmark');
    _this7.parent.insertBefore(_this7.dom, _this7.target.dom);
    _this7.isEnabled = false;
    _this7.display(false);
    return _this7;
  }

  _createClass(Landmark, [{
    key: "display",
    value: function display(value) {
      this.isEnabled = value;
      this.dom.style.position = value ? 'relative' : 'absolute';
    }
  }, {
    key: "reset",
    value: function reset() {
      this.dom.removeAttribute('style');
    }
  }, {
    key: "update",
    value: function update() {
      var _this8 = this;

      var styles = this.target.styles();
      this.dom.style.width = this.target.rect().width + "px";
      this.dom.style.height = this.target.rect().height + "px";
      ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].forEach(function (attr) {
        return _this8.dom.style[attr] = styles[attr];
      });
    }
  }]);

  return Landmark;
}(Box);