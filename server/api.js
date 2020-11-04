const { requestGithub } = require('../lib/api')

module.exports = (server) => {
    server.use(async(ctx, next) => {
        const {path} = ctx
        if(path.startsWith('/github/')) {
            const {session, method} = ctx
            const githubAuth = session && session.githubAuth
            let headers = {}
            if(githubAuth && githubAuth.access_token) {
                headers['Authorization'] = `${githubAuth.token_type} ${githubAuth && githubAuth.access_token}`
            }

            const result = await requestGithub(
                ctx.url.replace('/github/', '/'),
                method,
                ctx.request.body || {},
                headers
            )

            ctx.status = result.status
            ctx.body = result.data
        }else {
            await next()
        }
    })
}

// module.exports = (server) => {
//     server.use(async(ctx, next) => {
//         const {path} = ctx
//         if(path.startsWith('/github/')) {
//             const {session} = ctx
//             const githubAuth = session && session.githubAuth
//             const githubUrl = `${config.github.github_base_url}${ctx.url.replace('/github/', '/')}`
//             const token = githubAuth && githubAuth.access_token
//             let headers = {}
//             if(token) {
//                 headers['Authorization'] = `${githubAuth.token_type} ${token}`
//             }

//             try {
//                 console.log('githubUrl', githubUrl);
//                 const result = await axios({
//                     method:'GET',
//                     url: githubUrl,
//                     headers
//                 })

//                 if(result.status === 200) {
//                     ctx.body = result.data,
//                     ctx.set('Content-Type', 'application/json')
//                 }else {
//                     ctx.status = result.status
//                     ctx.body = {
//                         success: false
//                     },
//                     ctx.set('Content-Type', 'application/json')
//                 }
//             } catch (error) {
//                 console.log(error);
//                 ctx.body = {
//                     success: false
//                 },
//                 ctx.set('Content-Type', 'application/json')
//             }
//         }else {
//             await next()
//         }
//     })
// }