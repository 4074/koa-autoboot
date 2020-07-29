import KoaRouter from 'koa-router';
export default function (folderPath: string): Promise<{
    [key: string]: KoaRouter;
}>;
