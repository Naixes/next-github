import dynamic from 'next/dynamic'

import withRepoBasic from '../../components/with-repo-basic'
import {request} from '../../lib/api'

// 可添加loading组件
// 异步加载MDRenderer组件，单独打包，可以单独进行缓存
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