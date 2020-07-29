"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs_1 = __importDefault(require("fs"));

var koa_router_1 = __importDefault(require("koa-router"));

var keys_1 = require("./keys");

function default_1(_x) {
  return _default_.apply(this, arguments);
}

function _default_() {
  _default_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(folderPath) {
    var files, routers, _iterator, _step, _loop, _ret;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            files = fs_1.default.readdirSync(folderPath);
            routers = {};
            _iterator = _createForOfIteratorHelper(files);
            _context2.prev = 3;
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
              var file, ControllerClass, controller, proto, moduleRouter, controllerMiddlewares, _iterator2, _step2, methodName, fn, middlewares, _iterator3, _step3, _step3$value, path, method, routerMethod;

              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      file = _step.value;

                      if (/\.(j|t)s$/.test(file)) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt("return", "continue");

                    case 3:
                      _context.next = 5;
                      return Promise.resolve().then(function () {
                        return __importStar(require("".concat(folderPath, "/").concat(file)));
                      });

                    case 5:
                      ControllerClass = _context.sent.default;

                      if (!(typeof ControllerClass !== 'function' || !ControllerClass[keys_1.CONTROLLER_KEY])) {
                        _context.next = 8;
                        break;
                      }

                      return _context.abrupt("return", "continue");

                    case 8:
                      controller = new ControllerClass();
                      proto = ControllerClass.prototype;
                      moduleRouter = new koa_router_1.default(); // eslint-disable-next-line no-console

                      console.log('Auto load controller', file, "for path ".concat(ControllerClass[keys_1.CONTROLLER_KEY]));
                      controllerMiddlewares = ControllerClass[keys_1.MIDDLEWARE_KEY] || [];
                      _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(proto));
                      _context.prev = 14;

                      _iterator2.s();

                    case 16:
                      if ((_step2 = _iterator2.n()).done) {
                        _context.next = 26;
                        break;
                      }

                      methodName = _step2.value;
                      fn = controller[methodName];

                      if (fn[keys_1.ROUTE_KEY]) {
                        _context.next = 21;
                        break;
                      }

                      return _context.abrupt("continue", 24);

                    case 21:
                      middlewares = controllerMiddlewares.concat(fn[keys_1.MIDDLEWARE_KEY] || []);
                      _iterator3 = _createForOfIteratorHelper(fn[keys_1.ROUTE_KEY]);

                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          _step3$value = _step3.value, path = _step3$value.path, method = _step3$value.method;
                          routerMethod = method.toLowerCase();
                          moduleRouter[routerMethod].apply(moduleRouter, ["".concat(path)].concat(_toConsumableArray(middlewares), [fn])); // eslint-disable-next-line no-console

                          console.log("route: ".concat(routerMethod, " ").concat(ControllerClass[keys_1.CONTROLLER_KEY]).concat(path).concat(middlewares.length > 0 ? " [".concat(middlewares.map(function (m) {
                            return m.name;
                          }).join(','), "]") : ''));
                        }
                      } catch (err) {
                        _iterator3.e(err);
                      } finally {
                        _iterator3.f();
                      }

                    case 24:
                      _context.next = 16;
                      break;

                    case 26:
                      _context.next = 31;
                      break;

                    case 28:
                      _context.prev = 28;
                      _context.t0 = _context["catch"](14);

                      _iterator2.e(_context.t0);

                    case 31:
                      _context.prev = 31;

                      _iterator2.f();

                      return _context.finish(31);

                    case 34:
                      routers[ControllerClass[keys_1.CONTROLLER_KEY]] = moduleRouter;

                    case 35:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _loop, null, [[14, 28, 31, 34]]);
            });

            _iterator.s();

          case 6:
            if ((_step = _iterator.n()).done) {
              _context2.next = 13;
              break;
            }

            return _context2.delegateYield(_loop(), "t0", 8);

          case 8:
            _ret = _context2.t0;

            if (!(_ret === "continue")) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("continue", 11);

          case 11:
            _context2.next = 6;
            break;

          case 13:
            _context2.next = 18;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t1 = _context2["catch"](3);

            _iterator.e(_context2.t1);

          case 18:
            _context2.prev = 18;

            _iterator.f();

            return _context2.finish(18);

          case 21:
            return _context2.abrupt("return", routers);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee, null, [[3, 15, 18, 21]]);
  }));
  return _default_.apply(this, arguments);
}

exports.default = default_1;