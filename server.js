const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')

const config = require('./config')
// eedisSessionStore
const RedisSessionStore = require('./server/session-store')
const auth = require('./server/auth')

// redis
const redis = new Redis(config.redis)

const dev = process.env.NODE_ENV !== 'production'
// 初始化next
// 传入是否开发状态
const app = next({ dev })
const handler = app.getRequestHandler()

// 先编译pages
app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    // session
    server.keys = ['Naixes develop github App']
    const SESSION_CONFIG = {
        key: 'jid',
        maxAge: 24 * 60 * 60 * 1000,
        store: new RedisSessionStore(redis)
    }
    server.use(session(SESSION_CONFIG, server))
    // 授权登录
    auth(server)

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
        // 将登录信息返回
        ctx.req.session = ctx.session
        await handler(ctx.req, ctx.res)
        // 指不使用koa内置的body处理，手动返回响应内容
        ctx.respond = false
    })

    // 解决Error: read ECONNRESET报错
    server.on('close',function(isException){
        console.log('close', isException);
    })

    // 监听服务
    server.listen(3002, () => {
        console.log('server on 3002')
    })
})
