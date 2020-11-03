import {Layout, Input, Avatar, Tooltip, Dropdown, Menu} from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import {useCallback, useState} from 'react'
import {withRouter} from 'next/router'
import {connect} from 'react-redux'
import Link from 'next/link'

import Container from '../components/Container'
import {logout} from '../store/store'

const {Header, Content, Footer} = Layout

// 样式对象
// 写在外部保持样式一直是同一个对象防止icon重新渲染
const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
}

const footerStyle = {
    textAlign: 'center'
}

const MyLayout = ({children, user, router, logout}) => {
    // 刷新后保留输入框中的内容
    const urlQuery = router.query && router.query.query
    const [search, setSearch] = useState(urlQuery || '');

    const handleOnChange = useCallback(e => {
        setSearch(e.target.value)
    }, [setSearch])

    const handleOnSearch = useCallback(() => {
        // 跳转路由
        router.push(`/search?query=${search}`)
    }, [search])

    const handleLogout = useCallback(() => {
        logout()
    }, [])

    const userDropdown = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a onClick={handleLogout}>登 出</a>
                </Menu.Item>
            </Menu>
        )
    }

    return (<Layout>
        <Header>
            {/* header不能直接增加class */}
            <Container renderEle={<div className="header-inner" />}>
                <div className="header-left">
                    <div className="logo">
                        <Link href="/">
                            <GithubOutlined  style={githubIconStyle}/>
                        </Link>
                    </div>
                    <div>
                        <Input.Search 
                            placeholder="搜索仓库" 
                            value={search} 
                            onChange={handleOnChange} 
                            onSearch={handleOnSearch}
                        />
                    </div>
                </div>
                <div className="header_right">
                    <div className="user">
                        {user && user.id ? (
                        <Dropdown overlay={userDropdown}>
                            <a href={`/`}>
                                <Avatar size={40} src={user.avatar_url}></Avatar>
                            </a>
                        </Dropdown>
                        ) : (
                        <Tooltip title="点击进行登录">
                            <a href={`/pre-auth?url=${router.asPath}`}>
                                <Avatar size={40} icon={<UserOutlined />}></Avatar>
                            </a>
                        </Tooltip>
                        )}
                    </div>
                </div>
            </Container>
        </Header>
        <Content>
            <Container>{children}</Container>
        </Content>
        <Footer style={footerStyle}>
            develop by Naixes @
            <a href="https://github.com/Naixes">https://github.com/Naixes</a>
        </Footer>
        {/* 样式 */}
        <style jsx>{`
            .header-inner {
                display: flex;
                justify-content: space-between;
            }
            .header-left {
                display: flex;
            }
        `}</style>
        <style jsx global>{`
            #__next {
                height: 100%;
            }
            .ant-layout {
                min-height: 100%;
            }
            .ant-layout-header {
                padding-left: 0;
                padding-right: 0;
            }
            .ant-layout-content {
                background: #fff;
            }
        `}</style>
    </Layout>)
}

export default connect(
    function mapState(state) {
        return {
            user: state.user
        }
    },
    function mapReducer(dispatch) {
        return {
            logout: () => dispatch(logout())
        }
    }
)(withRouter(MyLayout))