"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const koa_router_1 = __importDefault(require("koa-router"));
const keys_1 = require("./keys");
async function default_1(folderPath) {
    const files = fs_1.default.readdirSync(folderPath);
    const routers = {};
    for (const file of files) {
        if (!/\.(j|t)s$/.test(file))
            continue;
        // eslint-disable-next-line no-await-in-loop
        const ControllerClass = (await Promise.resolve().then(() => __importStar(require(`${folderPath}/${file}`)))).default;
        if (typeof ControllerClass !== 'function' || !ControllerClass[keys_1.CONTROLLER_KEY])
            continue;
        const controller = new ControllerClass();
        const proto = ControllerClass.prototype;
        const moduleRouter = new koa_router_1.default();
        // eslint-disable-next-line no-console
        console.log('Auto load controller', file, `for path ${ControllerClass[keys_1.CONTROLLER_KEY]}`);
        const controllerMiddlewares = ControllerClass[keys_1.MIDDLEWARE_KEY] || [];
        for (const methodName of Object.getOwnPropertyNames(proto)) {
            const fn = controller[methodName];
            if (!fn[keys_1.ROUTE_KEY])
                continue;
            const middlewares = controllerMiddlewares.concat(fn[keys_1.MIDDLEWARE_KEY] || []);
            for (const { path, method } of fn[keys_1.ROUTE_KEY]) {
                const routerMethod = method.toLowerCase();
                moduleRouter[routerMethod](`${path}`, ...middlewares, fn);
                // eslint-disable-next-line no-console
                console.log(`route: ${routerMethod} ${ControllerClass[keys_1.CONTROLLER_KEY]}${path}${middlewares.length > 0
                    ? ` [${middlewares.map((m) => m.name).join(',')}]`
                    : ''}`);
            }
        }
        routers[ControllerClass[keys_1.CONTROLLER_KEY]] = moduleRouter;
    }
    return routers;
}
exports.default = default_1;
//# sourceMappingURL=parser.js.map