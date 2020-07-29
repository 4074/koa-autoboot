"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var koa_1 = __importDefault(require("koa"));

var koa_router_1 = __importDefault(require("koa-router"));

var parser_1 = __importDefault(require("./parser"));

var route_1 = require("./decorators/route");

Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function get() {
    return route_1.Controller;
  }
});
Object.defineProperty(exports, "Get", {
  enumerable: true,
  get: function get() {
    return route_1.Get;
  }
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function get() {
    return route_1.Post;
  }
});
Object.defineProperty(exports, "Route", {
  enumerable: true,
  get: function get() {
    return route_1.Route;
  }
});

function default_1(_x, _x2, _x3) {
  return _default_.apply(this, arguments);
}

function _default_() {
  _default_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(controllerPath, app, router) {
    var koaApp, koaRouter, routes, _i, _Object$entries, _Object$entries$_i, routePath, route;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            koaApp = app || new koa_1.default();
            koaRouter = router || new koa_router_1.default();
            _context.next = 4;
            return parser_1.default(controllerPath);

          case 4:
            routes = _context.sent;

            for (_i = 0, _Object$entries = Object.entries(routes); _i < _Object$entries.length; _i++) {
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), routePath = _Object$entries$_i[0], route = _Object$entries$_i[1];
              koaRouter.use(routePath, route.routes(), route.allowedMethods());
            }

            koaApp.use(koaRouter.routes());
            return _context.abrupt("return", koaApp);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _default_.apply(this, arguments);
}

exports.default = default_1;