'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _inject = require('../main/inject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

describe('Provides decorator', function () {
  it('should return a function', function () {
    (0, _chai.expect)((0, _inject.Provides)()).to.be.a('function');
  });

  it('should register the method on the class', function () {
    var iface = {},
        target = { constructor: {}, foo: {} };
    (0, _inject.Provides)(iface)(target, 'foo');
    (0, _chai.expect)(target.constructor._providers.get(iface)).to.equal(target.foo);
  });

  it('should work as a method decorator', function () {
    var _dec, _desc, _value, _class;

    var iface = {};

    var Target = (_dec = (0, _inject.Provides)(iface), (_class = function () {
      function Target() {
        _classCallCheck(this, Target);
      }

      _createClass(Target, [{
        key: 'foo',
        value: function foo() {/* noop */}
      }]);

      return Target;
    }(), (_applyDecoratedDescriptor(_class.prototype, 'foo', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'foo'), _class.prototype)), _class));


    (0, _chai.expect)(Target._providers.get(iface)).to.equal(Target.prototype.foo);
  });
});