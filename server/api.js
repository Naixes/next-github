const axios = require('axios')
const config = require('../config')

module.exports = (server) => {
    server.use(async(ctx, next) => {
        const {path} = ctx
        if(path.startsWith('/github/')) {
            const {session} = ctx
            const githubAuth = session && session.githubAuth
            const githubPath = `${config.github.github_base_url}${ctx.url.replace('/github/', '/')}`
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if(token) {
                headers['Authorization'] = `${githubAuth.token_type} ${token}`
            }

            try {
                const result = await axios({
                    method:'GET',
                    url: githubPath,
                    headers
                })

                if(result.status === 200) {
                    ctx.body = result.data,
                    ctx.set('Content-Type', 'application/json')
                }else {
                    ctx.status = result.status
                    ctx.body = {
                        success: false
                    },
                    ctx.set('Content-Type', 'application/json')
                }
            } catch (error) {
                console.log(err);
                ctx.body = {
                    success: false
                },
                ctx.set('Content-Type', 'application/json')
            }
        }else {
            await next()
        }
    })
}