"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Get = exports.Route = exports.Middleware = exports.Controller = void 0;
const keys_1 = require("../keys");
function getControllerNameFromClass(target) {
    return target.name.toLowerCase().replace(/controller$/, '');
}
function Controller(path) {
    return (target) => {
        const p = path || getControllerNameFromClass(target);
        target[keys_1.CONTROLLER_KEY] = /^\//.test(p) ? p : `/${p}`;
    };
}
exports.Controller = Controller;
function Middleware(middleware) {
    const ms = Array.isArray(middleware) ? middleware : [middleware];
    return (target, key, descriptor) => {
        descriptor.value[keys_1.MIDDLEWARE_KEY] = [
            ...ms,
            ...(descriptor.value[keys_1.MIDDLEWARE_KEY] || [])
        ];
        return descriptor;
    };
}
exports.Middleware = Middleware;
function createRouteOptions(method = ['GET', 'POST'], path) {
    const options = [];
    if (Array.isArray(method)) {
        for (const m of method) {
            options.concat(createRouteOptions(m, path));
        }
    }
    else {
        options.push({
            method,
            path: /^\//.test(path) ? path : `/${path}`
        });
    }
    return options;
}
function Route(method = ['GET', 'POST'], path) {
    return (target, key, descriptor) => {
        const options = createRouteOptions(method, path || key);
        if (!descriptor.value[keys_1.ROUTE_KEY])
            descriptor.value[keys_1.ROUTE_KEY] = [];
        for (const op of options) {
            descriptor.value[keys_1.ROUTE_KEY].push(op);
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
//# sourceMappingURL=route.js.map