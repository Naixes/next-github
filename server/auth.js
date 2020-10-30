const axios = require('axios')
const config = require('../config')

const {client_id, client_secret, request_token_url} = config.github

// github 授权
module.exports = (server) => {
    // 登录：获取授权及用户信息，github登陆成功后会跳转到这个页面
    server.use(async(ctx, next) => {
        if(ctx.path === '/auth') {
            // 获取code
            const code = ctx.query.code
            if(!code) {
                ctx.body = 'code not exist'
                return
            }
            // 获取授权token
            const result = await axios({
                method: 'POST',
                url: request_token_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            })
            // 200也可能会报错
            if(result.status === 200 && (result.data && !result.data.error)) {
                // 获取授权token成功
                console.log('token success');
                // 保存授权信息
                ctx.session.githubAuth = result.data
                const {access_token, token_type} = result.data
                // 获取用户信息
                const userInfoRes = await axios({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                })
                // 保存用户信息
                ctx.session.userInfo = userInfoRes.data
                // 重定向
                ctx.redirect(ctx.session && ctx.session.urlBeforeOAuth ? ctx.session.urlBeforeOAuth : '/')
                if(ctx.session) {
                    ctx.session.urlBeforeOAuth = ''
                }
            }else {
                // 请求授权token出错
                console.log('token fail');
                const errMsg = result.data && result.data.error
                ctx.body = `request token failed ${errMsg}`
            }
        }else {
            await next()
        }
    })

    // 退出登录
    server.use(async(ctx, next) => {
        const {path, method} = ctx
        if(path === '/logout' && method === 'POST') {
            // 清空授权信息和用户信息
            ctx.session = null
            ctx.body = 'logout success'
        }else {
            await next()
        }
    })

    // 授权登录
    server.use(async(ctx, next) => {
        const {path, method} = ctx
        // 记录授权登录之前的页面地址
        // 作为授权成功后返回的地址
        if(path === '/pre-auth' && method === 'GET') {
            const {url} = ctx.query
            ctx.session.urlBeforeOAuth = url
            // 跳转到github登陆页面
            ctx.redirect(`${config.OAUTH_URL}`)
        }else {
            await next()
        }
    })
}