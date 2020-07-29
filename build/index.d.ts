import Koa from 'koa';
import KoaRouter from 'koa-router';
export { Controller, Middleware, Get, Post, Route } from './decorators/route';
export default function (controllerPath: string, app: Koa, router?: KoaRouter): Promise<Koa>;
