// 需要在客户端和服务端执行，不能使用import
const axios = require("axios")

const config = require('../config')

const isServer = typeof window === 'undefined'

// 请求github
async function requestGithub(url, method, data, headers) {
    return await axios({
        url: `${config.github.github_base_url}${url}`,
        method,
        data,
        headers
    })
}

// req 和 res只有在服务端渲染时才能拿到
async function request({url, method='GET', data={}}, req, res) {
    if(!url) {
        throw Error('url must provide')
    }
    // 服务端直接请求github
    if(isServer) {
        const session = req.session
        const githubAuth = session.githubAuth || {}
        let headers = {}

        if(githubAuth.access_token) {
            headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return await requestGithub(url, method, data, headers)
    }else {
        // 客户端直接请求自己的服务
        return await axios({
            url: `/github${url}`,
            method,
            data
        })
    }
}

module.exports = {
    request,
    requestGithub
}