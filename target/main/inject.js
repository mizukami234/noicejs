'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = exports.Options = exports.Module = exports.Injector = undefined;
exports.attachDependencies = attachDependencies;
exports.Inject = Inject;
exports.ObjectInject = ObjectInject;
exports.ReactInject = ReactInject;
exports.WrapInject = WrapInject;
exports.Provides = Provides;

require('babel-polyfill');

var _Injector = require('./Injector');

var _Injector2 = _interopRequireDefault(_Injector);

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _Options = require('./Options');

var _Options2 = _interopRequireDefault(_Options);

var _Wrapper = require('./Wrapper');

var _Wrapper2 = _interopRequireDefault(_Wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Basic underlying functions

exports.Injector = _Injector2.default;
exports.Module = _Module2.default;
exports.Options = _Options2.default;
exports.Wrapper = _Wrapper2.default;


function getConstructor(target, name) {
  return name ? target[name] : target;
}

/**
 * Attach a list of dependencies to the target constructor or prototype.
 *
 * If the `name` parameter is truthy, we're dealing with a method rather
 * than a class. If this is on a method, then `target` is the prototype.
 * If this is on a class, then `target` is the constructor.
 */
function attachDependencies(target, flags, deps) {
  var opts = _Options2.default.getOptions(target);
  opts.merge(flags);
  opts.push(deps);
  _Options2.default.setOptions(target, opts);
}

/**
 * Define dependencies for the current class or method.
 *
 * this decorator takes each dependency (by interface) as a parameter
 * and will provide an instance of each, wrapped in an object, to the
 * constructor or function when instantiated through an Injector.
 */
function Inject() {
  for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
    dependencies[_key] = arguments[_key];
  }

  return function decorator(target, name) {
    attachDependencies(getConstructor(target, name), {}, dependencies);
  };
}

/**
 * Define dependencies for the current class or method.
 *
 * this decorator takes each dependency (by interface) as a parameter
 * and will provide an instance of each, wrapped in an object, to the
 * constructor or function when instantiated through an Injector.
 */
function ObjectInject() {
  for (var _len2 = arguments.length, dependencies = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    dependencies[_key2] = arguments[_key2];
  }

  return function decorator(target, name) {
    attachDependencies(getConstructor(target, name), { merge: true, tagged: true }, dependencies);
  };
}

/**
 * Define dependencies for the current class or method and replace
 * it with an automatically injecting one, to support React.
 *
 * The resulting constructor or function will require an `Injector`
 * as the first parameter (or a property thereof).
 *
 * The dependencies will be merged into the first argument.
 */
function ReactInject() {
  for (var _len3 = arguments.length, dependencies = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    dependencies[_key3] = arguments[_key3];
  }

  return function decorator(target, name, desc) {
    var wrapper = _Wrapper2.default.wrap(target, name, desc);
    attachDependencies(name ? wrapper.value : wrapper, { merge: true, tagged: true }, dependencies);
    return wrapper;
  };
}

/**
 * Define constructor dependencies and replace the constructor
 * with an auto-wrapping one, to support libraries like React.
 *
 * The resulting constructor will require an Injector as the
 * first parameter (or a property thereof).
 *
 * The dependencies will be merged into the first argument.
 */
function WrapInject() {
  for (var _len4 = arguments.length, dependencies = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    dependencies[_key4] = arguments[_key4];
  }

  return function decorator(target, name, desc) {
    var wrapper = _Wrapper2.default.wrap(target, name, desc, {});
    //@TODO: make this prettier
    attachDependencies(name ? wrapper.value : wrapper, {}, dependencies);
    return wrapper;
  };
}

/**
 * Mark a module method as the factory for an interface.
 *
 * This decorator takes the interface as a parameter and
 * will register the method on the module class as being
 * the appropriate factory for the interface.
 *
 * Provider methods will be called if no binding is found.
 */
function Provides(iface) {
  return function decorator(proto, name) {
    var target = proto.constructor;
    if (!target._providers) {
      target._providers = new Map();
    }
    target._providers.set(iface, proto[name]);
  };
}