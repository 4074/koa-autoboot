import Koa from 'koa';
export declare type HTTPMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT' | 'PATCH';
export interface RouteOption {
    method: HTTPMethod;
    path: string;
}
export interface ClassDecorator {
    (target: NewableFunction): void;
}
export interface MethodDecorator {
    (target: Record<string, any>, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
}
export declare function Controller(path?: string): ClassDecorator;
export declare function Middleware(middleware: Koa.Middleware | Koa.Middleware[]): MethodDecorator;
export declare function Route(method?: HTTPMethod | HTTPMethod[], path?: string): MethodDecorator;
export declare function Get(path?: string): MethodDecorator;
export declare function Post(path?: string): MethodDecorator;
