## `Next.js`

`Next.js` 是一个轻量级的 React 服务端渲染应用框架

### `nextjs`项目创建

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

#### `icon`组件`v4`更新

需要先`npm install --save @ant-design/icons`

4.0 中会采用按需引入的方式：

```diff
  import { Button } from 'antd';

  // tree-shaking supported
- import { Icon } from 'antd';
+ import { SmileOutlined } from '@ant-design/icons';

  const Demo = () => (
    <div>
-     <Icon type="smile" />
+     <SmileOutlined />
      <Button icon={<SmileOutlined />} />
    </div>
  );

  // or directly import
  import SmileOutlined from '@ant-design/icons/SmileOutlined';
```

你将仍然可以通过兼容包继续使用：

```jsx
import { Button } from 'antd';
import { Icon } from '@ant-design/compatible';

const Demo = () => (
  <div>
    <Icon type="smile" />
    <Button icon="smile" />
  </div>
);
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

#### `LazyLoading`

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

### `OAuth`

一种行业标准的授权方式

角色：客户端，服务端，授权服务器

授权方式：

- **Authorization Code**
- Refresh Token
- `Device Code`：TV
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

##### `githubOAuth`步骤

1. 注册`github-auth-app`，头像------`setteings` ------ `developer settings` ------ `OAuth Apps`------`new`

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

##### 安全性

一次性的`code`

`id`+`secret`

`redirect_uri`必须和注册时相同

#### `cookie`和`session`

`cookie`的作用之一是保存`session`的`id`，由服务端通过`id`查询用户信息设置`session`

安装包`koa-session`

##### `koa-session`存储

使用`koa-session`的`store`把`id`和用户信息存储在`redis`

提供`get`，`set`，`destroy`

#### 接入到`nextjs`

## 项目开发

### 布局

`vscode-styled-jsx` 插件

使用`Layout`组件在`app`中进行布局

#### `container`组件

一个容器组件，居中且最大宽度1200

`copm`属性可以将标签类型传递到子组件内部

```jsx
const style = {
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
}

// copm属性可以将标签类型传递到子组件内部，但是不能自定义属性
const MyContainer = ({children, comp: Comp}) => {
    return (
        <Comp style={style}>{children}</Comp>
    )
}

export default MyContainer
```

##### 使用`cloneElement`扩展组件

作用：可以在父组件给子组件添加样式等，而不需要在单独增加一层标签；组件`props`合并

```jsx
import {cloneElement} from 'react'

const style = {
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
}

const MyContainer = ({children, renderEle = <div />}) => {
    // 给renderEle增加属性
    return cloneElement(renderEle, {
        style: Object.assign({}, renderEle.props.style, style),
        children
    })
}

export default MyContainer

// 使用
<Container renderEle={<div className="header-inner" />}></...>
```

#### 登录登出

使用`redux`，`redis`和`GitHub OAuth`完成

##### 维持`OAuth`之前的页面访问

```js
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
```

##### 遇到的问题

1. `ECONNRESET`报错

> 使用 `Node.js` 搭建的服务中，如果存在 HTTP 的 `RPC` 调用，并且使用了 `keep-alive` 来保持 TCP 长连接， 那么一定会有一个牛皮糖般的问题困扰着你，那就是 `ECONNRESET` 或者 `socket hang up` 这种错误。
>
> 其实这就是状态机里一个简单的竞争情形：
>
> 1. 客户端与服务端成功建立了长连接
> 2. 连接静默一段时间（无 HTTP 请求）
> 3. 服务端因为在一段时间内没有收到任何数据，主动关闭了 TCP 连接
> 4. 客户端在收到 TCP 关闭的信息前，发送了一个新的 HTTP 请求
> 5. 服务端收到请求后拒绝，客户端报错 `ECONNRESET`
>
> 总结一下就是：服务端先于客户端关闭了 TCP，而客户端此时还未同步状态，所以存在一个错误的暂态（客户端认为 TCP 连接依然在，但实际已经销毁了）
>
> 最佳的解决方法还是，如果出现了这种暂态导致的错误，那么重试一次请求就好，但是只识别 `ECONNRESET` 这个错误码是不够的，因为服务端可能因为某些原因真的关闭了 TCP 端口。

参考：https://zhuanlan.zhihu.com/p/86953757

2. Warning: Can't perform a React state update on an unmounted component.

#### 全局Loading

`_app.js`中监听路由事件

```jsx
class MyApp extends App {
  state = {
    loading: false
  }
  startLoading = () => {
    this.setState({loading: true})
  }
  stopLoading = () => {
    this.setState({loading: false})
  }
  componentDidMount() {
    Router.events.on('routerChangeStart', this.startLoading)
    Router.events.on('routerChangeComplate', this.stopLoading)
    Router.events.on('routerChangeError', this.stopLoading)
  }
  componentWillUnmount() {
    Router.events.off('routerChangeStart', this.startLoading)
    Router.events.off('routerChangeComplate', this.stopLoading)
    Router.events.off('routerChangeError', this.stopLoading)
  }
  ...
  render() {
    const {Component, pageProps, reduxStore} = this.props
    const {loading} = this.state
    return <Provider store={reduxStore}>
      {loading ? <Loading /> : null}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  }
}
```

#### `github`接口代理

`rate limiting`：未登录，每小时60个，登陆后，每个用户每小时5000次

```js
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
```

#### 完善布局

`search`跳转，刷新后保留输入框中的内容

#### 完善接口处理

##### 区分服务端和客户端

```js
// /pages/index.js
import api from "../lib/api";

const Index = () => <span>Index</span>

// req 和 res只有在服务端渲染时才能拿到
Index.getInitialProps = async ({ctx}) => {
    // '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
    // 服务端是localhost的80端口
    // const result = await axios.get('/github/search/repositories?q=react')
    const result = await api.request({
        url: '/search/repositories?q=react'
    }, ctx.req, ctx.res)

    return {
        data: result.data
    }
}

export default Index
```

```js
// /lib/api.js
// 需要在客户端和服务端执行，不能使用import
const axios = require("axios")

const config = require('../config')

const isServer = typeof window === 'undefined'

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
```

```js
// /server/api.js
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
```

### 首页

判断用户登录

列表tab页：在路由中保存当前tab，优化切换tab时重复获取数据（缓存：需要区分客户端和服务端）

#### 缓存策略

安装`lru-cache`包：适用于不常更新或者用户更新的数据

```jsx
import {connect} from 'react-redux'
import Router, {withRouter} from 'next/router'
import {Button, Tabs} from 'antd'
import { MailOutlined } from '@ant-design/icons';
import {useEffect} from 'react'
import LRU from 'lru-cache'

import api from "../lib/api";
import Repo from '../components/Repo'

const isServer = typeof window === 'undefined'
// let cacheUserRepos, cacheUserStaredRepos
const cache = new LRU({
    // 最长不使用时间，过了就会删除
    maxAge: 1000 * 60 * 60
})

const Index = ({router, user, userRepos, userStaredRepos}) => {
    // 未登录时显示的内容
    if(!user || !user.id) {
        return (...)
    }
    const tabKey = router.query.key || '1'
    const handleTabChange = activeKey => {
        Router.push(`/?key=${activeKey}`)
    }

    // 不使用依赖时只在组件第一次mount时调用
    // userRepos, userStaredRepos依赖的作用是,数据过期后,将重新请求的数据进行缓存
    useEffect(() => {
        // 缓存数据，如果放到getInitialProps中切换tab时还会重新请求所以使用useEffect
        if(!isServer) {
            // cacheUserRepos = userRepos
            // cacheUserStaredRepos = userStaredRepos
            // 使用setTimeout设置最长缓存时间不管使用与否
            // const timeout = setTimeout(() => {
            //     cacheUserRepos = null
            //     cacheUserStaredRepos = null
            // }, 1000 * 60 * 60);
            // 作为依赖之后当值是null时也会被设置，所以要添加判断
            userRepos && cache.set('userRepos', userRepos)
            userStaredRepos && cache.set('userStaredRepos', userStaredRepos)
        }
    }, [userRepos, userStaredRepos]);

    // 登录后显示的内容
    return (...)
}

// req 和 res只有在服务端渲染时才能拿到
// getInitialProps局限性：返回的数据发生变化不会重新执行，所以返回的数据应该是不会变化的数据，所以isLogin不能在页面上来判断用户是否登录
Index.getInitialProps = async ({ctx, reduxStore}) => {
    // 判断是否登录
    const user = reduxStore.getState().user
    if(!user || !user.id) {
        return {
            isLogin: false
        }
    }

    // 判断是否有缓存
    // 需要判断是否服务端，服务端缓存会被共享
    if(!isServer) {
        // if(cacheUserRepos && cacheUserStaredRepos) {
        //     return {
        //         userRepos: cacheUserRepos,
        //         userStaredRepos: cacheUserStaredRepos
        //     }
        // }
        if(cache.get('userRepos') && cache.get('userStaredRepos')) {
            return {
                userRepos: cache.get('userRepos'),
                userStaredRepos: cache.get('userStaredRepos')
            }
        }
    }

    ...
}

// router和connect有一定的冲突，需要把withRouter放在外面强制更新
export default withRouter(connect(
    function mapState(state) {
        return {
            user: state.user
        }
    }
)(Index))
```

### 搜索页

#### 过滤

使用`router`保存过滤条件而不是内部的`state`，使组件更受控

#### 优化

路由跳转，统一成一个方法

没有任何依赖的方法可以直接声明在外面，一直是唯一的，不需要每次声明

将组件跳转封装为`FilterLink`组件，防止每次重新渲染，`memo`

将路由中为空的参数过滤掉：使用link标签

`seo`优化：使用link标签

#### 分页

`github`的限制，搜索结果1000个

```jsx
import { withRouter } from "next/router"
import { memo, isValidElement } from 'react'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'

import {request} from '../lib/api'
import Repo from '../components/Repo'

const per_page = 20
// 过滤条件
const LANGUAGE = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Python']
const SORT_TYPE = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc' // 降序
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  }
]

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 'bold'
}

/**
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库项目开发的主语言
 * page: 分页页面
 */
// 将组件跳转封装为FilterLink组件，memo防止每次重新渲染
const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  // 拼接路由参数
  let queryString = `?query=${query}`
  if (lang) queryString += `&lang=${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=${per_page}`

  return (
    // isValidElement判断是否元素，Pagination会传元素
    <Link href={`/search${queryString}`}>
      {isValidElement(name) ? name: <a>{name}</a>}
    </Link>
  )
})

function noop() {}

function Search({router, repos}) {
    const query = router.query
    const { lang, sort, order, page } = router.query

    return (
        <div className="root">
          <Row gutter={20}>
            <Col span={6}>
              <List
                bordered
                header={<span className="list-header">语言</span>}
                style={{ marginBottom: 20 }}
                dataSource={LANGUAGE}
                renderItem={item => {
                  const selected = lang === item
                  return (
                    <List.Item style={selected ? selectedItemStyle : null}>
                      {selected ? (
                        <span>{item}</span>
                      ) : (
                        <FilterLink {...query} name={item} lang={item} />
                      )}
                    </List.Item>
                  )
                }}
              ></List>
              <List
                bordered
                header={<span className="list-header">排序</span>}
                dataSource={SORT_TYPE}
                renderItem={item => {
                  let selected = false
                  if (item.name === 'Best Match' && !sort) {
                    selected = true
                  } else if (item.value === sort && item.order === order) {
                    selected = true
                  }
                  return (
                    <List.Item style={selected ? selectedItemStyle : null}>
                      {selected ? (
                        <span>{item.name}</span>
                      ) : (
                        <FilterLink
                          {...query}
                          name={item.name}
                          sort={item.value}
                          order={item.order}
                        />
                      )}
                    </List.Item>
                  )
                }}
              ></List>
            </Col>
            <Col span={18}>
              <h2 className="repos-title">{repos.total_count} 个仓库</h2>
              {repos.items.map(repo => (
                <Repo repo={repo} key={repo.id} />
              ))}
              <div className="pagination">
                {/* github搜索结果的最大限制为1000 */}
                <Pagination
                  pageSize={per_page}
                  current={Number(page) || 1}
                  total={1000}
                  onChange={noop}
                  itemRender={(page, type, ol) => {
                    const p = type === 'page'? page: (type === 'prev' ? page -1 : page +1)
                    const name = type === 'page' ? page : ol
                    return <FilterLink {...query} page={p} name={name}/>
                  }}
                />
              </div>
            </Col>
          </Row>
          <style jsx>{`
            .root {
              padding: 20px 0;
            }
            .list-header {
              font-weight: 800;
              font-size: 16px;
            }
            .repos-title {
              border-bottom: 1px solid #eee;
              font-size: 24px;
              line-height: 50px;
            }
            .pagination {
              padding: 20px ;
              text-align: center;
            }
          `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ctx}) => {
    const {query, sort, lang, order, page, per_page} = ctx.query
    if(!query) {
        return {
            repos: {
                total_count: 0
            }
        }
    }

    // 拼接请求接口参数
    // 例子: ?q=react+language:react&sort=stars&order=desc&page=2
    let queryStr = `?q=${query}`
    if(lang) queryStr += `+language:${lang}`
    if(sort) queryStr += `&sort=${lang}&order=${order || 'desc'}`
    if(page) queryStr += `&page${page}`
    queryStr += `&per_page=${per_page}`

    const result = await request({ url: `/search/repositories${queryStr}` },
    ctx.req,
    ctx.res)

    return {
        repos: result.data
    }
}

export default withRouter(Search)
```

### 详情页

#### 布局

`nextjs`没有提供非全局的布局方式，只能在页面中单独渲染

`getInitialProps`中尽量使用`ctx.query`而不是`router.query`，防止获取到的是旧的`query`

##### 将布局提取成一个`HOC`

##### 基础信息缓存功能

需要判断是否服务端，首页和搜索页都要缓存

```js
import LRU from 'lru-cache'

const REPO_CACHE = new LRU({
    maxAge: 1000 * 60 * 60
})

export function cache(repo) {
    const full_name = repo.full_name
    return REPO_CACHE.set(full_name, repo)
}

export function get(full_name) {
    return REPO_CACHE.get(full_name)
}

export function cacheArray(repos) {
    if(repos && Array.isArray(repos)) {
        repos.forEach(repo => cache(repo))
    }
}
```

#### 处理`markdown`

##### 解码

谷歌浏览器可以在全局创建一个变量（`temp1`）用来保存较长的数据

`atob()`方法用于解码使用 base-64 编码的字符串。

base-64 编码使用方法是 [btoa()](https://www.runoob.com/jsref/met-win-btoa.html) 。

`atob(temp1)`可以将编码之后的`markdown`正常显示（不支持中文），`nodejs`没有这样的方法，需要做兼容（下载`atob`模块，给`nodejs`全局添加一个`atob`方法）

```js
const atob = require('atob');

...
// 设置nodejs全局变量
global.atob = atob
...
```

##### 转义

安装`markdown-it`，`github-markdown-css`

##### 组件化

```jsx
import {memo, useMemo} from 'react'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
  html: true, // 将md里的html转换
  linkify: true // 把链接转成可点击的连接
})

// 解决atob中文解码后乱码问题：重新编码再解码
function b64_to_utf8(str) {
    // 已废弃，escape：生成新的由十六进制转义序列替换的字符串
    // return decodeURIComponent(escape(atob(str)))
    return decodeURIComponent(encodeURIComponent(atob(str)))
}

export default memo(function MarkdownRenderer({content, isBase64}) {
    const markdown = isBase64 ? b64_to_utf8(content) : content
    
    // 将markdown转换成html
    // useMemo返回一个 memoized 值
    const html = useMemo(() => md.render(markdown), [markdown])

    return (
        <div className='markdown-body'>
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
})
```

`detail/index.js`

```js
import dynamic from 'next/dynamic'

import withRepoBasic from '../../components/with-repo-basic'
import {request} from '../../lib/api'

// 可添加loading组件
const MDRenderer = dynamic(() => import('../../components/MarkdownRender'), {
    loading: () => (<div>loading...</div>)
})

const Detail = ({readme}) => {
    return (
        <MDRenderer content={readme.content} isBase64={true}/>
    )
}

Detail.getInitialProps = async({ctx: {query: {owner, name}, req, res}}) => {
    const readmeRes = await request(
        {url: `/repos/${owner}/${name}/readme`},
        req,
        res
    )
    return {
        readme: readmeRes.data
    }
}

export default withRepoBasic(Detail)
```

#### 工具

`@zeit/next-bundle-analyzer`

```js
// next.config.js
module.exports = withBundleAnalyzer(withCss({
    ...
    // 分析打包出的js的依赖关系
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        reportFilename: '../bundles/server.html'
      },
      browser: {
        analyzerMode: 'static',
        reportFilename: '../bundles/client.html'
      }
    }
}))
```

`package.json`

安装`cross-env`（windows）

```json
"scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "next start",
    "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build"
 },
```

##### 优化`detail.js`和`moment`

将`MarkdownRenderer`异步加载单独打包，可以进行缓存

忽略`moment`中的语言包

```js
// next.config.js
module.exports = withBundleAnalyzer(withCss({
    webpack(config) {
        // 忽略mement中的语言包
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/,/moment$/))
        return config
    },
    ...
}))
```

#### `issues`页面

##### 搜索

更接近中后台的方式

优化

缓存`labels`

### `nextjs`的静态页面导出

`nextjs`提供，导出时并非服务端渲染环境，服务端渲染代码不一定会执行

1. `'export': 'next export'`

`run export`时并非出于浏览器和服务器渲染环境，没有`window`，`ctx`的`req`和`res`是不存在的，也不会启动`server`，本项目不适合静态页面导出

2. `http-server`：`http-server xxx`启动一个静态服务

3. 如果想要修改路由显示需要增加配置`next.config.js`

```js
exportPathMap: async (defaultMap) => {
    return {
        ...defaultMap,
        '/repos/2': {page: '/repos', query: {page: 2}},
        ...
    }
}
```

静态网站推荐`gatsby`

### 部署

提交代码