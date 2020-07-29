"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const parser_1 = __importDefault(require("./parser"));
var route_1 = require("./decorators/route");
Object.defineProperty(exports, "Controller", { enumerable: true, get: function () { return route_1.Controller; } });
Object.defineProperty(exports, "Middleware", { enumerable: true, get: function () { return route_1.Middleware; } });
Object.defineProperty(exports, "Get", { enumerable: true, get: function () { return route_1.Get; } });
Object.defineProperty(exports, "Post", { enumerable: true, get: function () { return route_1.Post; } });
Object.defineProperty(exports, "Route", { enumerable: true, get: function () { return route_1.Route; } });
async function default_1(controllerPath, app, router) {
    const koaApp = app || new koa_1.default();
    const koaRouter = router || new koa_router_1.default();
    const routes = await parser_1.default(controllerPath);
    for (const [routePath, route] of Object.entries(routes)) {
        koaRouter.use(routePath, route.routes(), route.allowedMethods());
    }
    koaApp.use(koaRouter.routes());
    return koaApp;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map