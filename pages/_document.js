import Document, {Html, Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'

function withLog(Comp) {
    return (props) => {
        console.log(props);
        return <Comp {...props} />
    }
}

class MyDocument extends Document {
    // 可以不覆盖，覆盖时必须包括以下内容
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage
        const sheet = new ServerStyleSheet()
        try {
            ctx.renderPage = () => originalRenderPage({
                // sheet.collectStyles()生成css代码挂载到sheet上面
                enhanceApp: App => (props) => sheet.collectStyles(<App {...props} />),
                // enhanceComponent: Component => Component
            })

            const props = await Document.getInitialProps(ctx)
            // props.styles：内置jsx书写的样式，sheet.getStyleElement()：第三方书写样式
            return {...props, styles: <>{props.styles}{sheet.getStyleElement()}</>}
        } finally {
            sheet.seal()
        }
    }

    // 可以不覆盖，覆盖时必须包括以下内容
    render() {
        return <Html>
            <Head>
                {/* 不推荐使用title */}
                {/* <title>xxx</title> */}
                {/* <style>{`.test {color: red}`}</style> */}
            </Head>
            <body className="test">
                <Main></Main>
                <NextScript></NextScript>
            </body>
        </Html>
    }
}

export default MyDocument