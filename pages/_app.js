import App from 'next/app'
import 'antd/dist/antd.css'
import {Provider} from 'react-redux'

import '../styles/globals.css'
import Layout from '../components/Layout'
import withRedux from '../lib/with-redux'

// 每个页面都会渲染该组件，每次页面跳转也都会执行，浅层路由允许你改变 URL 但是不执行getInitialProps生命周期。你可以加载相同页面的 URL，得到更新后的路由属性pathname和query，并不失去 state 状态。
// Component是每一个页面
class MyApp extends App {
  // 组件上的静态方法，用于在页面或App中数据获取，可以完成客户端和服务端数据的同步
  // 当页面初始化加载时，getInitialProps只会加载在服务端。只有当路由跳转时，客户端才会执行
  // 当服务渲染时，getInitialProps将会把返回的数据序列化，就像JSON.stringify。所以要确保返回的是一个普通`JS`对象
  static async getInitialProps(ctx) {
    const {Component} = ctx
    let pageProps = {}

    if(await Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    
    return {pageProps}
  }

  // 重写render函数
  render() {
    const {Component, pageProps, reduxStore} = this.props
    return <Provider store={reduxStore}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  }
}

export default withRedux(MyApp)
