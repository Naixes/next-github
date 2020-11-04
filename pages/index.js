import {connect} from 'react-redux'
import Router, {withRouter} from 'next/router'
import {Button, Tabs} from 'antd'
import { MailOutlined } from '@ant-design/icons';
import {useEffect} from 'react'

import api from "../lib/api";
import Repo from '../components/Repo'

const isServer = typeof window === 'undefined'
let cacheUserRepos, cacheUserStaredRepos

const Index = ({router, user, userRepos, userStaredRepos}) => {
    // 未登录时显示的内容
    if(!user || !user.id) {
        return (
          <div className="root">
            <p>亲，您还没有登录哦~</p>
            <Button type="primary" href={`/pre-auth?url=${router.asPath}`}>
              点击登录
            </Button>
            <style jsx>{`
              .root {
                height: 400px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
            `}</style>
          </div>
        )
    }
    const tabKey = router.query.key || '1'
    const handleTabChange = activeKey => {
        Router.push(`/?key=${activeKey}`)
    }

    useEffect(() => {
        // 缓存数据
        if(!isServer) {
            cacheUserRepos = userRepos
            cacheUserStaredRepos = userStaredRepos
        }
    }, []);

    // 登录后显示的内容
    return (
        <div className="root">
          <div className="user-info">
            <img src={user.avatar_url} alt="avatar_url" className="avatar" />
            <span className="login">{user.login}</span>
            <span className="name">{user.name}</span>
            <span className="bio">{user.bio}</span>
            <p className="email">
                <MailOutlined  style={{ marginRight: 10 }}/>
                <a href={`mailto:${user.email}`}>
                    {user.email ? user.email : 'https://github.com/Naixes'}
                </a>
            </p>
          </div>
          <div className="user-repos">
            <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
              <Tabs.TabPane tab="你的仓库" key="1">
                {userRepos.map(repo => (
                  <Repo repo={repo} key={repo.id} />
                ))}
              </Tabs.TabPane>
              <Tabs.TabPane tab="你关注的仓库" key="2">
                {userStaredRepos.map(repo => (
                  <Repo repo={repo} key={repo.id} />
                ))}
              </Tabs.TabPane>
            </Tabs>
          </div>
          <style jsx>{`
            .root {
              display: flex;
              padding: 20px 0;
            }
            .user-info {
              width: 200px;
              margin-right: 40px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
            }
            .login {
              font-weight: 800;
              font-size: 20px;
              margin-top: 20px;
            }
            .name {
              font-size: 16px;
              color: #777;
            }
            .bio {
              margin-top: 20px;
              color: #333;
            }
            .avatar {
              width: 100%;
              border-radius: 5px;
            }
            .user-repos {
              flex-grow: 1;
            }
          `}</style>
        </div>
      )
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
        if(cacheUserRepos && cacheUserStaredRepos) {
            return {
                userRepos: cacheUserRepos,
                userStaredRepos: cacheUserStaredRepos
            }
        }
    }

    // getInitialProps在服务端渲染会执行一次(服务端执行),跳转到这个页面也会执行一次(客户端执行)
    // '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
    // 服务端请求的是localhost的80端口
    // const result = await axios.get('/github/search/repositories?q=react')
    const userRepos = await api.request({
        url: '/user/repos'
    }, ctx.req, ctx.res)
    const userStaredRepos = await api.request({
        url: '/user/starred'
    }, ctx.req, ctx.res)

    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStaredRepos: userStaredRepos.data
    }
}

// router和connect有一定的冲突，需要把withRouter放在外面强制更新
export default withRouter(connect(
    function mapState(state) {
        return {
            user: state.user
        }
    }
)(Index))