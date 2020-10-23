import Head from 'next/head'
import styles from '../styles/Home.module.css'
import styled from 'styled-components'

import {Button} from 'antd'

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`

const Home = ({name, time}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Button>{name}</Button>

      <Title>this is Styled Title</Title>

      <main className={styles.main}>
        <h1 className={styles.title, 'link'}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <h2>{time}</h2>

        {/* 定义样式，组件间隔离 */}
        <style jsx>{`
          .link {
            color: red;
          }
        `}</style>
        {/* 全局样式，但是只有在该组件加载之后才会生效 */}
        <style jsx global>{`
          p {
            color: blue;
          }
        `}</style>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

Home.getInitialProps = async() => {
  // 异步加载模块
  const moment = await import('moment')
  return {
    name: 'naixes',
    time: moment.default(Date.now() - 60 * 1000).fromNow()
  }
}

export default Home
