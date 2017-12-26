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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Injector class', function () {
  it('should take a list of modules', function () {
    var SubModule = function (_Module) {
      _inherits(SubModule, _Module);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          // noop
        }
      }]);

      return SubModule;
    }(_inject.Module);

    var modules = [new SubModule(), new SubModule()];
    var injector = new (Function.prototype.bind.apply(_inject.Injector, [null].concat(modules)))();

    (0, _chai.expect)(injector.modules).to.deep.equal(modules);
  });

  it('should inject a dependency from a module', function () {
    var inj = new _inject.Injector(new _HelperClass.TestModule());
    var impl = inj.create(_HelperClass.Consumer);

    (0, _chai.expect)(impl._iface).to.be.an.instanceof(_HelperClass.Implementation);
  });

  it('should inject a dependency into a factory method', function () {
    var inj = new _inject.Injector(new _HelperClass.TestModule());
    var impl = inj.execute(_HelperClass.Consumer.create, null, [3]);

    (0, _chai.expect)(impl._iface).to.be.an.instanceof(_HelperClass.Implementation);
    (0, _chai.expect)(impl._args).to.deep.equal([3]);
  });

  it('should throw on missing dependencies', function () {
    var _dec, _class;

    var Outerface = function Outerface() {
      _classCallCheck(this, Outerface);
    };

    // TestModule does not provide Outerface (it can't possibly)
    var inj = new _inject.Injector(new _HelperClass.TestModule());

    var FailingConsumer = (_dec = (0, _inject.Inject)(Outerface), _dec(_class = function FailingConsumer(di) {
      _classCallCheck(this, FailingConsumer);

      this.di = di;
    }) || _class);


    (0, _chai.expect)(function () {
      inj.create(FailingConsumer);
    }).to.throw();
  });

  it('should pass arguments to the constructor', function () {
    var inj = new _inject.Injector(new _HelperClass.TestModule());
    var args = ['a', 'b', 'c'];
    var impl = inj.create.apply(inj, [_HelperClass.Consumer].concat(args));

    (0, _chai.expect)(impl._args).to.deep.equal(args);
  });

  it('should execute providers', function () {
    var _dec2, _desc, _value, _class2;

    var counter = 0;

    var SubModule = (_dec2 = (0, _inject.Provides)(_HelperClass.Interface), (_class2 = function (_Module2) {
      _inherits(SubModule, _Module2);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          // noop
        }
      }, {
        key: 'create',
        value: function create() {
          ++counter;
          return new _HelperClass.Implementation();
        }
      }]);

      return SubModule;
    }(_inject.Module), (_applyDecoratedDescriptor(_class2.prototype, 'create', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'create'), _class2.prototype)), _class2));


    var inj = new _inject.Injector(new SubModule());
    var impl = inj.create(_HelperClass.Consumer);

    (0, _chai.expect)(impl._iface).to.be.an.instanceof(_HelperClass.Implementation);
    (0, _chai.expect)(counter).to.equal(1);
  });

  it('should provide dependencies to providers', function () {
    var _dec3, _dec4, _desc2, _value2, _class3;

    var Outerface = function Outerface() {
      _classCallCheck(this, Outerface);
    };

    var counter = 0,
        outerInstance = new Outerface();

    var SubModule = (_dec3 = (0, _inject.Inject)(Outerface), _dec4 = (0, _inject.Provides)(_HelperClass.Interface), (_class3 = function (_Module3) {
      _inherits(SubModule, _Module3);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          this.bind(Outerface).to(outerInstance);
        }
      }, {
        key: 'create',
        value: function create(outer) {
          ++counter;
          return new _HelperClass.Implementation(outer);
        }
      }]);

      return SubModule;
    }(_inject.Module), (_applyDecoratedDescriptor(_class3.prototype, 'create', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class3.prototype, 'create'), _class3.prototype)), _class3));


    var inj = new _inject.Injector(new SubModule());
    var impl = inj.create(_HelperClass.Consumer);

    (0, _chai.expect)(impl._iface).to.be.an.instanceof(_HelperClass.Implementation);
    (0, _chai.expect)(impl._iface._args).to.deep.equal([outerInstance]);
    (0, _chai.expect)(counter).to.equal(1);
  });

  it('should invoke binding functions', function () {
    var counter = 0;

    var SubModule = function (_Module4) {
      _inherits(SubModule, _Module4);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          this.bind(_HelperClass.Interface).to(function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            ++counter;
            return new (Function.prototype.bind.apply(_HelperClass.Implementation, [null].concat(args)))();
          });
        }
      }]);

      return SubModule;
    }(_inject.Module);

    var inj = new _inject.Injector(new SubModule());
    var impl = inj.create(_HelperClass.Consumer);

    (0, _chai.expect)(impl._iface).to.be.an.instanceof(_HelperClass.Implementation);
    (0, _chai.expect)(counter).to.equal(1);
  });

  it('should allow named bindings', function () {
    var _dec5, _class4;

    var name = 'foobar',
        inst = {};

    var SubModule = function (_Module5) {
      _inherits(SubModule, _Module5);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          this.bind(name).to(inst);
        }
      }]);

      return SubModule;
    }(_inject.Module);

    var inj = new _inject.Injector(new SubModule());

    var NameConsumer = (_dec5 = (0, _inject.Inject)(name), _dec5(_class4 = function NameConsumer(arg0) {
      _classCallCheck(this, NameConsumer);

      this.arg0 = arg0;
    }) || _class4);


    var impl = inj.create(NameConsumer);
    (0, _chai.expect)(impl.arg0).to.equal(inst);
  });

  it('should resolve constructors', function () {
    var Other = function Other() {
      _classCallCheck(this, Other);
    };

    var SubModule = function (_Module6) {
      _inherits(SubModule, _Module6);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'configure',
        value: function configure() {
          this.bind(_HelperClass.Interface, _HelperClass.Implementation);
        }
      }]);

      return SubModule;
    }(_inject.Module);

    var inj = new _inject.Injector(new SubModule());
    var impl = inj.create(_HelperClass.Interface);
    (0, _chai.expect)(impl).to.be.an.instanceof(_HelperClass.Implementation);
    var other = inj.create(Other);
    (0, _chai.expect)(other).to.be.an.instanceof(Other);
  });

  it('should resolve providers', function () {
    var Other = function Other() {
      _classCallCheck(this, Other);
    };

    var SubModule = function (_Module7) {
      _inherits(SubModule, _Module7);

      function SubModule() {
        _classCallCheck(this, SubModule);

        return _possibleConstructorReturn(this, (SubModule.__proto__ || Object.getPrototypeOf(SubModule)).apply(this, arguments));
      }

      _createClass(SubModule, [{
        key: 'createInterface',
        value: function createInterface() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return new (Function.prototype.bind.apply(_HelperClass.Implementation, [null].concat(args)))();
        }
      }, {
        key: 'configure',
        value: function configure() {
          var _this8 = this;

          this.provide(_HelperClass.Interface).with(function () {
            return _this8.createInterface.apply(_this8, arguments);
          });
        }
      }]);

      return SubModule;
    }(_inject.Module);

    var inj = new _inject.Injector(new SubModule());
    var impl = inj.execute(_HelperClass.Interface);
    (0, _chai.expect)(impl).to.be.an.instanceof(_HelperClass.Implementation);
    var val = inj.execute(function () {
      return 4;
    });
    (0, _chai.expect)(val).to.equal(4);
  });
});