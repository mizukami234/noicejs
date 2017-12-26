'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = function () {
  function Module() {
    _classCallCheck(this, Module);

    var clazz = this.getClass();
    var entries = clazz._providers ? clazz._providers.entries() : undefined;

    this._bindings = new Map();
    this._providers = new Map(entries);
  }

  _createClass(Module, [{
    key: 'bind',
    value: function bind(iface, impl) {
      var _this = this;

      if (impl) {
        this._bindings.set(iface, impl);
        return this;
      } else {
        return {
          to: function to(dimpl) {
            _this._bindings.set(iface, dimpl);
            return _this;
          }
        };
      }
    }
  }, {
    key: 'provide',
    value: function provide(iface, impl) {
      var _this2 = this;

      if (impl) {
        var clazz = this.getClass();
        clazz._providers.set(iface, impl);
      } else {
        return {
          with: function _with(fn) {
            _this2._providers.set(iface, fn);
            return _this2;
          }
        };
      }
    }
  }, {
    key: 'configure',
    value: function configure() {
      throw new Error('Configure has not been implemented by this module!');
    }
  }, {
    key: 'getClass',
    value: function getClass() {
      return this.constructor;
    }
  }, {
    key: 'getBinding',
    value: function getBinding(iface) {
      return this._bindings.get(iface);
    }
  }, {
    key: 'getProvider',
    value: function getProvider(iface) {
      if (this._providers.has(iface)) {
        return this._providers.get(iface);
      } else {
        return null;
      }
    }
  }, {
    key: 'has',
    value: function has(iface) {
      var clazz = this.getClass();
      return this._bindings.has(iface) || this._providers.has(iface);
    }
  }, {
    key: 'bindings',
    get: function get() {
      return this._bindings;
    }
  }]);

  return Module;
}();

exports.default = Module;