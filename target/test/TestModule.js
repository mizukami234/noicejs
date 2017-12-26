'use strict';

var _chai = require('chai');

var _inject = require('../main/inject');

describe('Module class', function () {
  it('should start with no bindings', function () {
    (0, _chai.expect)(new _inject.Module().bindings.size).to.equal(0);
  });

  it('should bind an interface and return a to function', function () {
    var iface = {},
        keys = ['to'];
    (0, _chai.expect)(Object.keys(new _inject.Module().bind(iface))).to.deep.equal(keys);
  });

  it('should bind an interface to an deferred implementation', function () {
    var iface = {},
        impl = {},
        module = new _inject.Module();
    module.bind(iface).to(impl);
    (0, _chai.expect)(module.bindings.get(iface)).to.equal(impl);
  });

  it('should bind an interface to an implementation immediately', function () {
    var iface = {},
        impl = {},
        module = new _inject.Module();
    module.bind(iface, impl);
    (0, _chai.expect)(module.bindings.get(iface)).to.equal(impl);
  });

  it('should throw on configure', function () {
    (0, _chai.expect)(function () {
      new _inject.Module().configure();
    }).to.throw();
  });
});