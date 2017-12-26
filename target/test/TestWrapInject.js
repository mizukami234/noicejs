'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _inject = require('../main/inject');

var _HelperClass = require('./HelperClass');

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

describe('WrapInject decorator', function () {
  it('should return a function', function () {
    (0, _chai.expect)((0, _inject.WrapInject)()).to.be.a('function');
  });

  it('should attach params to the target', function () {
    var params = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];

    var Target = function () {
      function Target() {
        _classCallCheck(this, Target);
      }

      _createClass(Target, [{
        key: 'method',
        value: function method() {/* noop */}
      }]);

      return Target;
    }();

    var wrapper = _inject.WrapInject.apply(undefined, params)(Target);

    (0, _chai.expect)(_inject.Options.getOptions(wrapper).deps).to.deep.equal(params);
    (0, _chai.expect)(wrapper).not.to.equal(Target);
    (0, _chai.expect)(new wrapper({
      injector: new _HelperClass.TestInjector()
    })).to.be.an.instanceof(Target);
  });

  it('should work as a class decorator', function () {
    var _dec, _class;

    var params = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];

    var Target = (_dec = _inject.WrapInject.apply(undefined, params), _dec(_class = function () {
      function Target() {
        _classCallCheck(this, Target);
      }

      _createClass(Target, [{
        key: 'method',
        value: function method() {/* noop */}
      }]);

      return Target;
    }()) || _class);


    (0, _chai.expect)(_inject.Options.getOptions(Target).deps).to.deep.equal(params);
    (0, _chai.expect)(new Target({
      injector: new _HelperClass.TestInjector()
    })).to.be.an.instanceof(Target.wrappedClass);
  });

  it('should work as a method decorator', function () {
    var _dec2, _desc, _value, _class2;

    var params = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    var counter = 0;
    var Target = (_dec2 = _inject.WrapInject.apply(undefined, params), (_class2 = function () {
      function Target() {
        _classCallCheck(this, Target);
      }

      _createClass(Target, [{
        key: 'method',
        value: function method() {
          ++counter;
        }
      }]);

      return Target;
    }(), (_applyDecoratedDescriptor(_class2.prototype, 'method', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'method'), _class2.prototype)), _class2));


    var inst = new Target();
    inst.method({
      injector: new _HelperClass.TestInjector()
    });

    (0, _chai.expect)(inst.method).to.be.an.instanceof(Function);
    (0, _chai.expect)(_inject.Options.getOptions(Target.prototype.method).deps).to.deep.equal(params);
    (0, _chai.expect)(counter).to.equal(1);
  });
});