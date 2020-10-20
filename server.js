const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
// 初始化next
// 传入是否开发状态
const app = next({ dev })
const handler = app.getRequestHandler()

// 先编译pages
app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    // 解决路由映射刷新时404的问题
    // router.get('/a/:id', async(ctx) => {
    //     const id = ctx.params.id
    //     await handler(ctx, {
    //         pathname: '/a',
    //         query: { id }
    //     })
    //     ctx.respond = false
    // })
    server.use(router.routes())

    // next作为koa的中间件
    server.use(async (ctx, next) => {
        await handler(ctx.req, ctx.res)
        // 指不使用koa内置的body处理，手动返回响应内容
        ctx.respond = false
    })

    // 监听服务
    server.listen(3002, () => {
        console.log('server on 3000')
    })
})
