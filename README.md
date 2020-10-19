## `Next.js`

`Next.js*` 是一个轻量级的 React 服务端渲染应用框架

### nextjs`项目创建

1. 手动创建

   `npm init -y`

   `npm i react react-dom next`

   `pages`文件夹：创建的`js`文件就是组件，需要`export`

   修改`scripts`

   `"dev": "next" // 自动编译监听, "build": "next build", "start": "next start"`

   `npm run dev`

   `pages/index.js`：`export`一个组件，不需要引入`React`，`next`已经引入到全局

2. `create-next-app`

   `npm i -g create-next-app`

   `npx create-next-app name / npm create next-app name / 直接调用 create-next-app`

   `npm run dev`
   
   > 如果浏览器报错`Cannot read property 'forEach' of undefined`，这个是扩展工具`React Developer Tools`的问题需要更新版本或者禁止使用
   >
   > https://chrome.zzzmh.cn/info?token=fmkadmapgofadopljbjfkapdkoienihi

### `nextjs`作为`koa`的中间件

服务器：

`nextjs`自身带有服务器，只处理`ssr`渲染

处理`HTTP`请求返回数据

根据域名之类的`HOST`定位服务器

#### `koa`

流行的轻量级`nodejs`服务端框架，`egg`是基于`koa`

注意：`nextjs`要传入`nodejs`原生的`ctx.req`和`ctx.res`

安装`koa`

```js
// server.js
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

    // next作为koa的中间件
    server.use(async (ctx, next) => {
        await handler(ctx.req, ctx.res)
        ctx.respond = false
    })
    server.use(router.routes())
    // 监听服务
    server.listen(3000, () => {
        console.log('server on 3000')
    })
})
```

### `redis`

内存数据解构存储

内存存储，也有持久存储的功能

`value`支持多种数据结构

#### 安装-windows

方法1：

https://github.com/ServiceStack/redis-windows

手动启动

```js
// 服务器，注意指定windows配置文件
redis-server.exe redis.windows.conf
// 客户端，可以直接执行redis命令
redis-cli
```

配置

```js
redis-cli -h xxx -p xxxx
config get xxx
```

方法2：https://github.com/microsoftarchive/redis/releases下载稳定版`msi`文件，安装

打开服务，找到`redis`，安装后默认开机自动启动，也可以手动启动，全局命令就可以

#### 安装-mac

1. 通过源码安装

   官网下载

   进入`redis`目录，执行命令`make`

   执行命令`sudo make install`

2. 通过`brew`安装

   安装`brew`（查看官网）

   `brew install redis`如果出现问题就先`brew update`一下

`redis-server`直接启动

`redis-cli`连接数据库

#### 设置密码

修改配置文件的`requirepass`

`AUTH Naixes`可以登录

#### 其他注意

使用`module:name`区分`key`的内容可以防止`key`重复，例如`set session:sessionId xxx`

`KEYs *`查找所有`key`

#### `ioredis`

```js
const Redis = require('ioredis')

const redis = new Redis({
  port: 6379,
  password: 'naixes'
})

redis.keys('*').then(data => {
  console.log("keys", data)
})
```

### 集成`antd`

#### 解决`nextjs`不支持`css`

新建`next.config.js`，修改默认配置

安装`@zeit/next-css`，用来加载`css`

```js
// 由于检测到自定义CSS配置，内置CSS支持被禁用
// next.config.js
const withCss = require('@zeit/next-css')

if(typeof require !== 'undefined') {
    require.extensions['css'] = file => {}
}
// 返回要修改的config，withCss会生成一个config对象
module.exports = withCss({})
```

会报警告：由于检测到自定义CSS配置，内置CSS支持被禁用

#### 按需加载`antd`

##### 引入`js`

`antd` 默认支持基于 ES modules 的 tree shaking，对于`js`部分，直接引入 `import { Button } from 'antd'` 就会有按需加载的效果。

**旧方式：**

1. 运行`cnpm i babel-plugin-import --save-dev`
2. 修改`.babelrc`文件：

```json
{
    "presets": ["next/babel"],
    "plugins":[
        // 可以配置自动引入css，但是mini-css-extract-plugin中会出现冲突的bug，issue编号250
        [
            "import", { "libraryName": "antd", "style": "css" }
        ]
    ]
}
```

3. 然后只需从`antd`引入模块即可。`babel-plugin-import`自动解析成手动引入的代码。

##### 引入样式

新建`_app.js`覆盖`nextjs`的`app`组件，引入`css`，也可以在`babel-plugin-import`配置自动引入，但是`mini-css-extract-plugin`中会出现冲突的bug，`issue`编号250

```js
// _app.js（新版本脚手架自带不用新建）
import '../styles/globals.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

### `nextjs`基础

#### 目录结构

`pages`：对应页面，访问路由根据`pages`的文件目录生成

`componets`：公共组件

`lib`：公共代码，`utils`等

`public`：资源

#### 路由基础

##### `link`组件

前端跳转，不用重新加载页面

```js
// pages/index.js
import Link from 'next/link'

export default () =>
  <div>
    Click{' '}
	// 没有标签渲染，需要指定渲染内容，只能有一个根节点，link会绑定click事件，点击跳转
    <Link href="/about">
      <a>here</a>
    </Link>{' '}
    to read more
  </div>
```

##### `Router`模块

手动跳转

```js
import Router from 'next/router'

export default () =>
  <div>
    Click <span onClick={() => Router.push('/about')}>here</span> to read more
  </div>
```

##### 动态路由

只能使用`query`传递参数，因为路由是通过文件关系生成

直接加在`path`后面`?value=1`，或者传入对象

```js
// 传入对象
<Link href={{ pathname: '/about', query: { name: 'Zeit' }}}>
    <a>here</a>
</Link>
// 传入对象
Router.push({
    pathname: '/about',
    query: { name: 'Zeit' }
})
```

接收参数`withRouter`

```react
import { withRouter } from 'next/router'

// router中包含query
const ActiveLink = ({ children, router, href }) => {
  const style = {
    marginRight: 10,
    color: router.pathname === href? 'red' : 'black'
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default withRouter(ActiveLink)
```

##### 路由映射

`link`添加`as`属性`as='/test/1'`或者`Router.push({pathname:'xx',...}, '/test/1')`

但是刷新会变成404

解决：在`koa`中增加该路由并使用`next`处理

```js
...
// 先编译pages
app.prepare().then(() => {
    ...
    // 解决路由映射刷新时404的问题
    router.get('/a/:id', async(ctx) => {
        const id = ctx.params.id
        await handler(ctx, {
            pathname: '/a',
            query: { id }
        })
        ctx.respond = false
    })
    server.use(router.routes())
    ...
})
```

##### `Router`钩子

路由事件

你可以监听路由相关事件。 下面是事件支持列表：

- `routeChangeStart(url)` - 路由开始切换时触发
- `routeChangeComplete(url)` - 完成路由切换时触发
- `routeChangeError(err, url)` - 路由切换报错时触发
- `beforeHistoryChange(url)` - 浏览器`history`模式开始切换时触发
- `hashChangeStart(url)` - 开始切换 hash 值但是没有切换页面路由时触发
- `hashChangeComplete(url)` - 完成切换 hash 值但是没有切换页面路由时触发

> 这里的`url`是指显示在浏览器中的`url`。如果你用了`Router.push(url, as)`（或类似的方法），那浏览器中的`url`将会显示 as 的值。

下面是如何正确使用路由事件`routeChangeStart`的例子：

```js
const handleRouteChange = url => {
  console.log('App is changing to: ', url)
}

Router.events.on('routeChangeStart', handleRouteChange)
```

如果你不想长期监听该事件，你可以用`off`事件去取消监听：

```
Router.events.off('routeChangeStart', handleRouteChange)
```

当`history`模式跳转页面时会依次触发`routeChangeStart`，`beforeHistoryChange`，`routeChangeComplete`

而`hash`变化时只会监听到`hashChangeStart`和`hashChangeComplete`

应用：`loading`

#### `getInitialProps`

组件上的静态方法，`nextjs`的数据获取规范，用于在页面或`App`中数据获取，可以完成客户端和服务端数据的同步

```react
import React from 'react'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  render() {
    return (
      <div>
        Hello World {this.props.userAgent}
      </div>
    )
  }
}
```

当页面渲染时加载数据，我们使用了一个异步方法`getInitialProps`能异步获取`JS`普通对象，并绑定在`props`上。

当服务渲染时，`getInitialProps`将会把数据序列化，就像`JSON.stringify`。所以确保`getInitialProps`返回的是一个普通`JS`对象，而不是`Date`, `Map` 或 `Set`类型。

当页面初始化加载时，`getInitialProps`只会加载在服务端。只有当路由跳转（`Link`组件跳转或`API`方法跳转）时，客户端才会执行`getInitialProps`。

**注意：`getInitialProps`将不能使用在子组件中。只能使用在`pages`页面中。**

> 只有服务端用到的模块放在`getInitialProps`里，请确保正确的导入了它们， 否则会拖慢你的应用速度。

你也可以给无状态组件定义`getInitialProps`：

```react
const Page = ({ stars }) =>
  <div>
    Next stars: {stars}
  </div>

Page.getInitialProps = async ({ req }) => {
  const res = await fetch('https://api.github.com/repos/zeit/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```

`getInitialProps`入参对象的属性如下：

- `pathname` - URL 的 path 部分
- `query` - URL 的 query 部分，并被解析成对象
- `asPath` - 显示在浏览器中的实际路径（包含查询部分），为`String`类型
- `req` - HTTP 请求对象 (只有服务器端有)
- `res` - HTTP 返回对象 (只有服务器端有)
- `jsonPageRes` - [获取数据响应对象](https://developer.mozilla.org/en-US/docs/Web/API/Response) (只有客户端有)
- `err` - 渲染过程中的任何错误

#### 自定义`app`

作用：布局`Layout`，保持公用状态，给页面传入自定义数据，自定义错误处理

`Container`已作废

```js
import App from 'next/app'
import '../styles/globals.css'
import 'antd/dist/antd.css'

// 每个页面都会渲染该组件，每次页面跳转也都会执行，浅层路由允许你改变 URL 但是不执行getInitialProps生命周期。你可以加载相同页面的 URL，得到更新后的路由属性pathname和query，并不失去 state 状态。
// Component是每一个页面
class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    let pageProps
    if(await Component.getInitialProps()) {
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
```

#### 自定义`document`

`document`：只有在服务端渲染时才会被调用的组件，用来修改服务端渲染的文档内容，一般用来配合第三方`css-in-js`方案使用

```react
import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    // 可以不覆盖，覆盖时必须包括以下内容
    static async getInitialProps(ctx) {
        const props = await Document.getInitialProps(ctx)
        return {...props}
    }

    // 可以不覆盖，覆盖时必须包括以下内容
    render() {
        return <Html>
            <Head>
                {/* 不推荐使用title */}
                <title>xxx</title>
                <style>{`.test {color: red}`}</style>
            </Head>
            <body className="test">
                <Main></Main>
                <NextScript></NextScript>
            </body>
        </Html>
    }
}

export default MyDocument
```

`title`可以在每个页面单独设置

```react
import Head from 'next/head'

...
<Head>
    <title>Create Next App</title>
	<link rel="icon" href="/favicon.ico" />
</Head>
...
```

#### 定义样式

`nextjs`默认不支持引入`css`，需要修改配置，见上文

##### 默认的`css-in-js`方案

```react
...
{/* 定义样式，组件间隔离 */}
<style jsx>{`
    button {
    	color: blue;
    }
`}</style>
{/* 全局样式，但是只有在该组件加载之后才会生效 */}
<style jsx global>{`
    p {
    	color: blue;
    }
`}</style>
...
```

`styled-jsx`查看文档

##### `styled-components`

第三方的`css-in-js`方案

安装`styled-componets`和`babel-plugin-styled-components`

修改`babel`配置，用来预编译`css`

```js
{
    "presets": ["next/babel"],
    "plugins": [
        [
            "styled-components",
            {
                "ssr": true
            }
        ]
    ]
}
```

`_document.js`

```js
import Document, {Html, Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

class MyDocument extends Document {
    // 可以不覆盖，覆盖时必须包括以下内容
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage
        const sheet = new ServerStyleSheet()
        try {
            ctx.renderPage = () => originalRenderPage({
                // sheet.collectStyles()生成css代码挂载到sheet上面
                enhanceApp: App => (...props) => sheet.collectStyles(<App {...props} />),
                // enhanceComponent: Component => Component
            })

            const props = await Document.getInitialProps(ctx)
            // props.styles：内置jsx书写的样式，sheet.getStyleElement()：第三方书写样式
            return {...props, styles: <>{props.styles}{sheet.getStyleElement()}</>}
        } finally {
            sheet.seal()
        }
    }
    ...
}

export default MyDocument
```

使用

```react
...
import styled from 'styled-components'

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`

...
<Title>this is Styled Title</Title>
...
```

#### LazyLoading

`nextjs`默认页面支持`LazyLoading`

##### 异步加载模块

当一半以上页面加载了相同的模块，会被提取到公共模块导致每次打开页面都会去加载它。

使用`webpack`提供的`import`方法在`getInitialProps`中加载

```react
Home.getInitialProps = async() => {
  const moment = await import('moment')
  return {
    name: 'naixes',
    // 注意使用default
    time: moment.default(Date.now() - 60 * 1000).fromNow()
  }
}
```

##### 异步加载组件

```js
import dynamic from 'next/dynamic'

// 渲染该组件时才会加载
const Comp = dynamic(import('xxx/xxx.js'))
```

#### `next.config.js`

修改`nextjs`配置

```js
// @zeit/next-plugins中可以查找到相关文档
const withCss = require('@zeit/next-css')

// 可配置项
const configs = {
    // 编译文件输出目录,默认是.next
    distDir: 'dest',
    // 是否给每个路由生成Etag，用来进行缓存验证，nginx中有缓存配置时可以不开启
    generateEtags: true,
    // 本地开发时，页面内容缓存配置
    onDemandEntries: {
        // 内容在内存中缓存时间(ms)
        maxInactiveAge: 25 * 1000,
        // 同时缓存多少个页面
        pagesBufferLength: 2
    },
    // page目录下哪些后缀是页面
    pageExtensions: ['jsx', 'js'],
    // 配置buildId
    generateBuildId: async () => {
        if(process.env.YOUR_BUILD_ID) {
        return process.env.YOUR_BUILD_ID
        }
        // 返回Null使用默认的unique id
        return null
    },

    // 收到修改webpack config
    webpack(config, options) {
        return config
    },

    // 修改webpackDevMiddleware配置
    webpackDevMiddleware: config => {
        return config
    },
        
    // 可以在页面上通过 procsess.env.customKey 获取 value
    env: {
        customKey: 'value',
    },

    // 下面两个通过'next/config'来读取
    // 只有在服务器渲染时才会获取配置
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET
    },

    // 在服务端渲染和客户端渲染都可获取的配置
    publicRuntimeConfig: {
        staticFolder: '/static'
    }
}

if(typeof require !== 'undefined') {
    require.extensions['css'] = file => {}
}
// withCss()会增加webpack对css的配置，传入要修改的config，withCss会生成一个config对象
// 传入{webpack(){}}可以修改webpack的配置，可以参考node_modules中插件的源码
module.exports = withCss({})
```

#### `ssr`流程

**服务端页面渲染**：开始-》浏览器发起`page`请求-》koa收到请求并调用`nextjs`-》`nextjs`开始渲染-》调用`document/app`的`getInitialProps`-》调用页面上的`getInitialProps`-》渲染出`html`-》返回给浏览器进行渲染

nextjs会把服务端渲染产生的数据在返回中列出来，可以在请求的响应中查看到，在客户端可以进行复用

**客户端路由跳转**：开始-》点击链接按钮-》异步加载页面js（`nextjs`对于每个`page`都会分开打包）-》调用页面上的`getInitialProps`-》数据返回，路由变化-》渲染新页面

推荐在`getInitialProps`执行数据请求而不是在组件的生命周期里，方便进行数据同步，也是`nextjs`的重要功能

## `React Hooks`

*Hook* 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性

具体参考`note/react/组件`的`Hooks`部分

## `nextjs`的`HOC`

在对`_app.js`使用`HOC`时要注意返回`getInitialProps`方法

## 集成`redux`

**客户端和服务端不同步的警告**：服务器启动后会动态加载`nextjs`打包后的`js`，直接`export`的`store`相当于一个模块，所以`store`只有一个，每次渲染`store`都是同一个对象，不会重置。

解决：每次服务端渲染都创建一个新的`store`

让store返回一个方法创建store

利用`HOC`集成`redux`：

- 判断是否处于`window`环境，是：新建并返回`store`；
- 判断window是否已经存在`store`，不存在则新建，返回`store`
- 使用`class`组件，在构造函数中创建`store`

注意：`getInitialProps`时不能直接返回`store`，要返回`getState()`返回的内容，因为返回的内容会被序列化，`store`中有他自己的方法，不好序列化

## 认证和授权

授权不一定先认证

### OAuth

一种行业标准的授权方式

角色：客户端，服务端，授权服务器

授权方式：

- **Authorization Code**
- Refresh Token
- Device Code：TV
- Password
- Implicit
- Client Credentials

#### Refresh Token

服务端通过`refreshtoken`向授权服务器获取新的`token`

#### Password

服务端通过用户名密码向授权服务器获取`token`（不安全，网站会获取到用户名密码）

#### Authorization Code

客户端向授权服务器发起`redirect`跳转到`github`进行登录认证，带上`client_id`（向`github`申请的），授权服务器redirect到一个`url`（带上`code`，`code`是一次性的），浏览器请求到服务端，服务端根据`code`+`secret`请求授权服务器获取`token`，使用`token`和授权服务器进行交互

![Authorization Code流程](E:\Jennifer\other\next-github\public\Authorization Code流程.png)

##### 步骤

1. 注册`github-auth-app`，`setteings` ------ `developer settings` ------ `new`

2. 保存`clientid`和`clientsecret`

##### 字段

参考：https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

**跳转链接：**

`client_id`

`scope`

`redirect_uri`，`login`，`state`，`allow_signup`（是否允许注册）

**请求`token`：**

`client_id`，`client_secret`

`code`

`redirect_uri`，`state`

（`restlet`工具：发送请求）