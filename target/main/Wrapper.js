'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.injectorHook = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Injector = require('./Injector');

var _Injector2 = _interopRequireDefault(_Injector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var injectorHook = exports.injectorHook = function injectorHook(target, wrapper, args) {
  return _Injector2.default.fromParams(args).getDependencies(wrapper).concat(args);
};

var Wrapper = function () {
  function Wrapper() {
    _classCallCheck(this, Wrapper);
  }

  _createClass(Wrapper, null, [{
    key: 'wrapClass',

    /**
     * Create a wrapper class to allow transparent injection.
     *
     * If options are provided and a `hook` is specified, it will be called
     * with the target and arguments before the wrapped class is invoked, and
     * may modify the parameters on the way (typically adding by dependencies).
     */
    value: function wrapClass(target, _ref) {
      var _ref$hook = _ref.hook,
          hook = _ref$hook === undefined ? injectorHook : _ref$hook;

      return function (_target) {
        _inherits(wrapper, _target);

        _createClass(wrapper, null, [{
          key: 'wrappedClass',
          get: function get() {
            return target;
          }
        }]);

        function wrapper() {
          var _ref2;

          _classCallCheck(this, wrapper);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _possibleConstructorReturn(this, (_ref2 = wrapper.__proto__ || Object.getPrototypeOf(wrapper)).call.apply(_ref2, [this].concat(_toConsumableArray(hook(target, wrapper, args)))));
        }

        return wrapper;
      }(target);
    }

    /**
     * Create a wrapper method to allow transparent injection.
     *
     * If options are provided and a `hook` is specified, it will be called
     * with the target and arguments before the wrapped class is invoked, and
     * may modify the parameters on the way (typically by adding dependencies).
     */

  }, {
    key: 'wrapMethod',
    value: function wrapMethod(target, desc, _ref3) {
      var _ref3$hook = _ref3.hook,
          hook = _ref3$hook === undefined ? injectorHook : _ref3$hook;

      desc.value = function wrapper() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return target.apply(this, hook(target, wrapper, args));
      };
      return desc;
    }
  }, {
    key: 'wrap',
    value: function wrap(target, name, desc, options) {
      if (name) {
        return Wrapper.wrapMethod(target[name], desc, options);
      } else {
        return Wrapper.wrapClass(target, options);
      }
    }
  }]);

  return Wrapper;
}();

exports.default = Wrapper;