import {memo, useMemo} from 'react'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
  html: true, // 将md里的html转换
  linkify: true // 把链接转成可点击的连接
})

// 解决atob中文解码后乱码问题：重新编码再解码
function b64_to_utf8(str) {
    // 已废弃但有用，escape：生成新的由十六进制转义序列替换的字符串
    return decodeURIComponent(escape(atob(str)))
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