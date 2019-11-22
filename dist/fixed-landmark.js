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
  }

  _createClass(Box, [{
    key: "rect",
    value: function rect() {
      return this.dom.getBoundingClientRect();
    }
  }, {
    key: "styles",
    value: function styles() {
      return this.dom.currentStyle || window.getComputedStyle(this.dom);
    }
  }]);

  return Box;
}();

var Landmark = function (_Box) {
  _inherits(Landmark, _Box);

  function Landmark(target) {
    _classCallCheck(this, Landmark);

    var _this = _possibleConstructorReturn(this, (Landmark.__proto__ || Object.getPrototypeOf(Landmark)).call(this, document.createElement('div')));

    _this.target = target;
    _this.parent = target.dom.parentNode;
    _this.update();
    _this.dom.classList.add('fixed-landmark');
    _this.parent.insertBefore(_this.dom, _this.target.dom);
    _this.isEnabled = false;
    _this.display(false);
    return _this;
  }

  _createClass(Landmark, [{
    key: "display",
    value: function display(value) {
      var height = this.target.rect().height;
      this.isEnabled = value;
      if (this.isEnabled) {
        this.dom.classList.add('fixed-landmark-active');
        this.dom.classList.remove('fixed-landmark-inactive');
      } else {
        this.dom.classList.add('fixed-landmark-inactive');
        this.dom.classList.remove('fixed-landmark-active');
      }
      this.dom.style.height = value ? height + 'px' : '0px';
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      this.dom.style.width = this.target.rect().width + "px";
      this.dom.style.height = this.target.rect().height + "px";
      ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].forEach(function (attr) {
        return _this2.dom.style[attr] = _this2.target.dom.style[attr];
      });
    }
  }]);

  return Landmark;
}(Box);

var Container = function (_Box2) {
  _inherits(Container, _Box2);

  function Container(element) {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, element));
  }

  return Container;
}(Box);

var FixedElement = function (_Box3) {
  _inherits(FixedElement, _Box3);

  function FixedElement(options) {
    _classCallCheck(this, FixedElement);

    var element = options.element,
        container = options.container,
        offsetValue = options.offsetValue,
        offsetElement = options.offsetElement,
        offsetFunction = options.offsetFunction;

    var _this4 = _possibleConstructorReturn(this, (FixedElement.__proto__ || Object.getPrototypeOf(FixedElement)).call(this, element));

    _this4.container = new Container(container);
    _this4.landmark = new Landmark(_this4);
    _this4.offsetValue = offsetValue || 0;
    _this4.offsetElement = offsetElement;
    _this4.offsetFunction = offsetFunction;
    _this4.isFixed = false;
    _this4.defaultPosition = _this4.position();
    _this4.defaultWidth = _this4.styles().defaultWidth;
    _this4.defaultPositionMargins = {
      top: _this4.styles().top,
      right: _this4.styles().right,
      bottom: _this4.styles().bottom,
      left: _this4.styles().left
    };
    window.addEventListener('scroll', _this4.update.bind(_this4));
    window.addEventListener('resize', function () {
      _this4.reset();
      _this4.update();
    });
    _this4.update();
    return _this4;
  }

  _createClass(FixedElement, [{
    key: "reset",
    value: function reset() {
      this.dom.removeAttribute('style');
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
      var _this5 = this;

      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      ['top', 'right', 'bottom', 'left'].forEach(function (attr) {
        return _this5.dom.style[attr] = values[attr] || 'auto';
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
        this.dom.classList.remove("fixed-element-inactive");
        this.dom.classList.add("fixed-element-active");
      } else {
        this.position(this.defaultPosition);
        this.positionMargins(this.defaultPositionMargins);
        this.dom.style.width = this.defaultWidth;
        this.dom.classList.remove("fixed-element-active");
        this.dom.classList.add("fixed-element-inactive");
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
      this.top = offset;
      this.left = containerR.left;
      if (containerR.bottom <= rect.height + offset) {
        this.top += containerR.bottom - rect.height - offset;
      }
      this.top += 'px';
      this.left += 'px';
      if (this.landmark.isEnabled != isFixed) this.landmark.display(isFixed);
      this.fix(isFixed);
    }
  }]);

  return FixedElement;
}(Box);