'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _inject = require('../main/inject');

var _HelperClass = require('./HelperClass');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('Wrapper class', function () {
  it('should wrap a class', function () {
    var Target = function Target() {
      _classCallCheck(this, Target);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this._args = args;
    };

    var args = [new _HelperClass.TestInjector(), 1, 2, 3];
    var wrapped = _inject.Wrapper.wrapClass(Target, {});
    var inst = new (Function.prototype.bind.apply(wrapped, [null].concat(_toConsumableArray(args))))();

    (0, _chai.expect)(wrapped).to.not.equal(Target);
    (0, _chai.expect)(inst).to.be.an.instanceof(Target);
    (0, _chai.expect)(inst._args).to.deep.equal(args);
  });

  it('should wrap a method', function () {
    var Target = function () {
      function Target() {
        _classCallCheck(this, Target);
      }

      _createClass(Target, [{
        key: 'method',
        value: function method() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          this._args = args;
        }
      }]);

      return Target;
    }();

    var proto = Target.prototype;
    _inject.Wrapper.wrapMethod(proto.method, Object.getOwnPropertyDescriptor(proto, 'method'), {});

    var args = [new _HelperClass.TestInjector(), 1, 2, 3];
    var inst = new Target();
    inst.method.apply(inst, args);

    (0, _chai.expect)(inst._args).to.deep.equal(args);
  });
});