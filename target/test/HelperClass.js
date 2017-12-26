'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestInjector = exports.TestModule = exports.Consumer = exports.Implementation = exports.Interface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _desc, _value, _class2;

var _inject = require('../main/inject');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interface = exports.Interface = function Interface() {
  _classCallCheck(this, Interface);
};

var Implementation = exports.Implementation = function Implementation() {
  _classCallCheck(this, Implementation);

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  this._args = args;
};

var Consumer = exports.Consumer = (_dec = (0, _inject.Inject)(Interface), _dec2 = (0, _inject.Inject)(Interface), _dec(_class = (_class2 = function () {
  _createClass(Consumer, null, [{
    key: 'create',
    value: function create(iface) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return new (Function.prototype.bind.apply(Consumer, [null].concat([iface], args)))();
    }
  }]);

  function Consumer(iface) {
    _classCallCheck(this, Consumer);

    this._iface = iface;

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    this._args = args;
  }

  return Consumer;
}(), (_applyDecoratedDescriptor(_class2, 'create', [_dec2], Object.getOwnPropertyDescriptor(_class2, 'create'), _class2)), _class2)) || _class);

var TestModule = exports.TestModule = function (_Module) {
  _inherits(TestModule, _Module);

  function TestModule() {
    _classCallCheck(this, TestModule);

    return _possibleConstructorReturn(this, (TestModule.__proto__ || Object.getPrototypeOf(TestModule)).apply(this, arguments));
  }

  _createClass(TestModule, [{
    key: 'configure',
    value: function configure() {
      this.bind(Interface).to(Implementation);
    }
  }]);

  return TestModule;
}(_inject.Module);

var TestInjector = exports.TestInjector = function (_Injector) {
  _inherits(TestInjector, _Injector);

  function TestInjector() {
    _classCallCheck(this, TestInjector);

    return _possibleConstructorReturn(this, (TestInjector.__proto__ || Object.getPrototypeOf(TestInjector)).apply(this, arguments));
  }

  _createClass(TestInjector, [{
    key: 'getDependencies',
    value: function getDependencies() {
      return [];
    }
  }]);

  return TestInjector;
}(_inject.Injector);