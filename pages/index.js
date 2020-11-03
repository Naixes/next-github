import api from "../lib/api";

const Index = () => <span>Index</span>

// req 和 res只有在服务端渲染时才能拿到
Index.getInitialProps = async ({ctx}) => {
    // getInitialProps在服务端渲染会执行一次(服务端执行),跳转到这个页面也会执行一次(客户端执行)
    // '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
    // 服务端请求的是localhost的80端口
    // const result = await axios.get('/github/search/repositories?q=react')
    const result = await api.request({
        url: '/search/repositories?q=react'
    }, ctx.req, ctx.res)

    return {
        data: result.data
    }
}

export default Index