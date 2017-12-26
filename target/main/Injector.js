'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.allowedKeys = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Options = require('./Options');

var _Options2 = _interopRequireDefault(_Options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var allowedKeys = exports.allowedKeys = ['name', 'fn'];

function find(data, cb) {
  if (data.find) {
    return data.find(cb);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var it = _step.value;

      if (cb(it)) {
        return it;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return undefined;
}

var Injector = function () {
  _createClass(Injector, null, [{
    key: 'isCallable',
    value: function isCallable(fn) {
      return fn && typeof fn.apply === 'function' && typeof fn.call === 'function';
    }
  }, {
    key: 'fromParams',
    value: function fromParams(params) {
      var _params = _slicedToArray(params, 1),
          p0 = _params[0];

      if (p0 instanceof Injector) {
        return p0;
      } else {
        var injector = p0.injector;

        if (injector instanceof Injector) {
          return injector;
        } else {
          throw new Error('unable to locate injector');
        }
      }
    }
  }]);

  function Injector() {
    _classCallCheck(this, Injector);

    for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
      modules[_key] = arguments[_key];
    }

    this._modules = modules;
    this._modules.forEach(function (module) {
      return module.configure();
    });
  }

  _createClass(Injector, [{
    key: 'extend',
    value: function extend() {
      for (var _len2 = arguments.length, modules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        modules[_key2] = arguments[_key2];
      }

      return new Injector(this.modules.concat(modules));
    }
  }, {
    key: 'getDependencies',


    /**
     * refactor this to handle names
     */
    value: function getDependencies(target) {
      var _this = this;

      if (this._logger) {
        this._logger.debug({ target: target }, 'Getting dependencies.');
      }

      var opts = _Options2.default.getOptions(target);
      return opts.deps.map(function (dep) {
        var fn = dep.fn,
            name = dep.name;


        var val = fn || name;
        var module = _this.getModule(val);

        if (module) {
          return _this.resolve(module, val);
        } else {
          throw new Error('Unable to satisfy dependency.', dep);
        }
      });
    }
  }, {
    key: 'resolve',
    value: function resolve(module, fn) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (this._logger) {
        this._logger.debug({ module: module, val: val }, 'Using val from module to meet dependency.');
      }

      var provider = module.getProvider(fn);
      if (provider) {
        if (this._logger) {
          this._logger.debug({ module: module, provider: provider }, 'Executing provider from module.');
        }

        return this.execute(provider, module, args);
      }

      var binding = module.getBinding(fn);
      if (Injector.isCallable(binding)) {
        if (this._logger) {
          this._logger.debug({ binding: binding, module: module }, 'Creating binding from module.');
        }

        return this.create.apply(this, [binding].concat(_toConsumableArray(args)));
      } else {
        if (this._logger) {
          this._logger.debug({ binding: binding, module: module }, 'Returning binding from module.');
        }

        return binding;
      }
    }
  }, {
    key: 'getModule',
    value: function getModule(fn) {
      return find(this._modules, function (m) {
        return m.has(fn);
      });
    }
  }, {
    key: 'execute',
    value: function execute(fn, scope) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var deps = this.getDependencies(fn);
      var args = deps.concat(params);

      var module = this.getModule(fn);
      var provider = module ? module.getProvider(fn) : null;
      if (provider) {
        var _val = provider.apply(scope, args);
        if (this._logger) {
          this._logger.debug({
            args: args, deps: deps, fn: fn, provider: provider, val: _val
          }, 'Executed provider in place of function.');
        }
        return _val;
      } else {
        var _val2 = fn.apply(scope, args);
        if (this._logger) {
          this._logger.debug({
            args: args, deps: deps, fn: fn, val: _val2
          }, 'Executed original function.');
        }
        return _val2;
      }
    }
  }, {
    key: 'create',
    value: function create(ctor) {
      var deps = this.getDependencies(ctor);

      for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        params[_key3 - 1] = arguments[_key3];
      }

      var args = deps.concat(params);

      var module = this.getModule(ctor);
      if (!module) {
        var _val3 = new (Function.prototype.bind.apply(ctor, [null].concat(_toConsumableArray(args))))();
        if (this._logger) {
          this._logger.debug({
            args: args, ctor: ctor, deps: deps, val: _val3
          }, 'Instantiated original constructor.');
        }
        return _val3;
      }

      var provider = module.getProvider(ctor);
      if (provider) {
        var _val4 = this.execute(provider, module, args);
        if (this._logger) {
          this._logger.debug({
            args: args, ctor: ctor, deps: deps, val: _val4
          }, 'Executed provider in place of constructor.');
        }
        return _val4;
      }

      var binding = module.getBinding(ctor);
      if (binding) {
        var _val5 = new (Function.prototype.bind.apply(binding, [null].concat(_toConsumableArray(args))))();
        if (this._logger) {
          this._logger.debug({
            args: args, ctor: ctor, deps: deps, val: _val5
          }, 'Instantiated resolved constructor.');
        }
        return _val5;
      }

      throw new Error('A module claimed to provide constructor but was unable.');
    }
  }, {
    key: 'logger',
    set: function set(value) {
      this._logger = value;
    }
  }, {
    key: 'modules',
    get: function get() {
      return this._modules;
    }
  }]);

  return Injector;
}();

exports.default = Injector;