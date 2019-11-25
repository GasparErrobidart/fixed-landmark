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
        offsetFunction = options.offsetFunction;

    var _this2 = _possibleConstructorReturn(this, (FixedElement.__proto__ || Object.getPrototypeOf(FixedElement)).call(this, element));

    _this2.container = new Container(container);
    _this2.landmark = new Landmark(_this2);
    _this2.offsetValue = offsetValue || 0;
    _this2.offsetElement = offsetElement;
    _this2.offsetFunction = offsetFunction;
    _this2.isFixed = false;
    _this2.defaultPosition = _this2.position();
    _this2.defaultWidth = _this2.styles().defaultWidth;
    _this2.defaultPositionMargins = {
      top: _this2.styles().top,
      right: _this2.styles().right,
      bottom: _this2.styles().bottom,
      left: _this2.styles().left
    };
    _this2.watchScroll();
    _this2.watchResize();
    _this2.update();
    return _this2;
  }

  _createClass(FixedElement, [{
    key: "watchResize",
    value: function watchResize() {
      this.resizeListener = window.addEventListener('resize', this.reset.bind(this));
    }
  }, {
    key: "stopWatchResize",
    value: function stopWatchResize() {
      window.removeEventListener('resize', this.resizeListener);
    }
  }, {
    key: "watchScroll",
    value: function watchScroll() {
      var _this3 = this;

      var limiter = void 0,
          limitCount = 0;
      this.scrollListener = window.addEventListener('scroll', function () {
        if (limitCount < 10) clearTimeout(limiter);
        limitCount++;
        limiter = setTimeout(function () {
          _this3.update();
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
      this.update();
      this.landmark.update();
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
      var _this4 = this;

      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      ['top', 'right', 'bottom', 'left'].forEach(function (attr) {
        return _this4.dom.style[attr] = values[attr] || 'auto';
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
    key: "addClasses",
    value: function addClasses() {
      var _this5 = this;

      var limiter = void 0;
      clearTimeout(limiter);
      limiter = setTimeout(function () {
        if (_this5.isFixed) {
          _this5.dom.classList.remove("fixed-element-inactive");
          _this5.dom.classList.add("fixed-element-active");
        } else {
          _this5.dom.classList.remove("fixed-element-active");
          _this5.dom.classList.add("fixed-element-inactive");
        }
      }, 5);
    }
  }, {
    key: "update",
    value: function update(ev) {
      var rect = this.rect();
      var landmarkR = this.landmark.rect();
      var containerR = this.container.rect();
      var offset = this.offset();
      var isFixed = landmarkR.top <= 0 + offset;
      this.top = offset;
      this.left = containerR.left;
      if (containerR.bottom <= rect.height + offset) {
        this.top += containerR.bottom - rect.height - offset;
      }
      this.top += 'px';
      this.left += 'px';
      if (this.landmark.isEnabled != isFixed) {
        this.landmark.display(isFixed);
        this.addClasses();
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

    var _this6 = _possibleConstructorReturn(this, (Landmark.__proto__ || Object.getPrototypeOf(Landmark)).call(this, document.createElement('div')));

    _this6.target = target;
    _this6.parent = target.dom.parentNode;
    _this6.update();
    _this6.dom.classList.add('fixed-landmark');
    _this6.parent.insertBefore(_this6.dom, _this6.target.dom);
    _this6.isEnabled = false;
    _this6.display(false);
    return _this6;
  }

  _createClass(Landmark, [{
    key: "display",
    value: function display(value) {
      // const height          = this.target.rect().height
      this.isEnabled = value;
      // this.dom.style.height = value ? height+'px' : '0px'
      this.dom.style.position = value ? 'relative' : 'absolute';
      // if(this.isEnabled){
      //   this.dom.classList.add('fixed-landmark-active')
      //   this.dom.classList.remove('fixed-landmark-inactive')
      // }else{
      //   this.dom.classList.add('fixed-landmark-inactive')
      //   this.dom.classList.remove('fixed-landmark-active')
      // }
    }
  }, {
    key: "update",
    value: function update() {
      var _this7 = this;

      this.dom.style.width = this.target.rect().width + "px";
      this.dom.style.height = this.target.rect().height + "px";
      ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].forEach(function (attr) {
        return _this7.dom.style[attr] = _this7.target.dom.style[attr];
      });
    }
  }]);

  return Landmark;
}(Box);