import React from 'react'

import createStore from '../store/store'

// 判断是否是服务端
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
    // 服务端创建新的store对象
    if(isServer) {
        return createStore(initialState)
    }
    // 客户端使用缓存，保证客户端一直只有一个store防止数据被初始化
    if(!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
    // 使用class组件
    class withRedux extends React.Component {
        // 客户端服务端渲染时执行
        // props：getInitialProps返回的
        constructor(props) {
            super(props)

            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }
        render() {
            const {Component, pageProps, ...rest} = this.props
            return (
                <Comp reduxStore={this.reduxStore} Component={Component} pageProps={pageProps} {...rest} />
            )
        }
    }

    // getInitialProps返回的内容会被序列化成字符串，在页面上可以查看到，__NEXT_DATA__，客户端会处理这些数据
    withRedux.getInitialProps = async (ctx) => {
        // 初始化store
        const reduxStore = getOrCreateStore()
        ctx.reduxStore = reduxStore

        // app的getInitialProps返回的props
        let appProps = {}
        if(typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx)
        }

        return {
            ...appProps,
            // 这里不能直接返回reduxStore，因为是一个store对象，难以序列化
            initialReduxState: reduxStore.getState()
        }
    }

    return withRedux
}