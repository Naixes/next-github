import App from 'next/app'
import '../styles/globals.css'
import 'antd/dist/antd.css'

// 每个页面都会渲染该组件，每次页面跳转也都会执行，浅层路由允许你改变 URL 但是不执行getInitialProps生命周期。你可以加载相同页面的 URL，得到更新后的路由属性pathname和query，并不失去 state 状态。
// Component是每一个页面
class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps
    if(await Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {pageProps}
  }

  // 重写render函数
  render() {
    const {Component, pageProps} = this.props
    return <Component {...pageProps} />
  }
}

export default MyApp
