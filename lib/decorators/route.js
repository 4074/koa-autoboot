"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = exports.Get = exports.Route = exports.Middleware = exports.Controller = void 0;

var keys_1 = require("../keys");

function getControllerNameFromClass(target) {
  return target.name.toLowerCase().replace(/controller$/, '');
}

function Controller(path) {
  return function (target) {
    var p = path || getControllerNameFromClass(target);
    target[keys_1.CONTROLLER_KEY] = /^\//.test(p) ? p : "/".concat(p);
  };
}

exports.Controller = Controller;

function Middleware(middleware) {
  var ms = Array.isArray(middleware) ? middleware : [middleware];
  return function (target, key, descriptor) {
    descriptor.value[keys_1.MIDDLEWARE_KEY] = [].concat(_toConsumableArray(ms), _toConsumableArray(descriptor.value[keys_1.MIDDLEWARE_KEY] || []));
    return descriptor;
  };
}

exports.Middleware = Middleware;

function createRouteOptions() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['GET', 'POST'];
  var path = arguments.length > 1 ? arguments[1] : undefined;
  var options = [];

  if (Array.isArray(method)) {
    var _iterator = _createForOfIteratorHelper(method),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var m = _step.value;
        options.concat(createRouteOptions(m, path));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    options.push({
      method: method,
      path: /^\//.test(path) ? path : "/".concat(path)
    });
  }

  return options;
}

function Route() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['GET', 'POST'];
  var path = arguments.length > 1 ? arguments[1] : undefined;
  return function (target, key, descriptor) {
    var options = createRouteOptions(method, path || key);
    if (!descriptor.value[keys_1.ROUTE_KEY]) descriptor.value[keys_1.ROUTE_KEY] = [];

    var _iterator2 = _createForOfIteratorHelper(options),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var op = _step2.value;
        descriptor.value[keys_1.ROUTE_KEY].push(op);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return descriptor;
  };
}

exports.Route = Route;

function Get(path) {
  return Route('GET', path);
}

exports.Get = Get;

function Post(path) {
  return Route('POST', path);
}

exports.Post = Post;