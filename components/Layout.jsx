import {Layout, Input, Avatar} from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import {useCallback, useState} from 'react'
import Container from '../components/Container'

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

const MyLayout = ({children}) => {
    const [search, setSearch] = useState('');

    const handleOnChange = useCallback(e => {
        setSearch(e.target.value)
    }, [setSearch])

    const handleOnSearch = useCallback(() => {})

    return (<Layout>
        <Header>
            {/* header不能直接增加class */}
            <Container renderEle={<div className="header-inner" />}>
                <div className="header-left">
                    <div className="logo">
                        <GithubOutlined  style={githubIconStyle}/>
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
                        <Avatar size={40} icon={<UserOutlined />}></Avatar>
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

export default MyLayout