'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require('chai');

var _inject = require('../main/inject');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('Inject decorator', function () {
  it('should return a function', function () {
    (0, _chai.expect)((0, _inject.Inject)()).to.be.a('function');
  });

  it('should work as a class decorator', function () {
    var _dec, _class;

    var params = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];

    var Target = (_dec = _inject.Inject.apply(undefined, params), _dec(_class = function () {
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
  });
});