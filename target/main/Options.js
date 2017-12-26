'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var symbol = exports.symbol = Symbol('noice-options');

var Options = function () {
  _createClass(Options, null, [{
    key: 'getOptions',
    value: function getOptions(fn) {
      return fn[symbol] || new Options();
    }
  }, {
    key: 'setOptions',
    value: function setOptions(fn, opts) {
      return fn[symbol] = opts;
    }
  }]);

  function Options() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$deps = _ref.deps,
        deps = _ref$deps === undefined ? [] : _ref$deps,
        _ref$obj = _ref.obj,
        obj = _ref$obj === undefined ? false : _ref$obj;

    _classCallCheck(this, Options);

    this._deps = deps;
    this._obj = obj;
  }

  _createClass(Options, [{
    key: 'push',
    value: function push(deps) {
      this._deps = this._deps.concat(deps.map(function (it) {
        if (typeof it === 'function') {
          return { fn: it };
        } else if (typeof it === 'string') {
          return { name: it };
        } else {
          return it;
        }
      }));
      return this;
    }

    /**
     * Combine the current options with another set
     * using `&&`.
     */

  }, {
    key: 'merge',
    value: function merge(opts) {
      this._obj &= opts.obj;
    }
  }, {
    key: 'deps',
    get: function get() {
      return this._deps;
    }
  }, {
    key: 'obj',
    get: function get() {
      return this._obj;
    }
  }]);

  return Options;
}();

exports.default = Options;