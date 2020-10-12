const withCss = require('@zeit/next-css')

if(typeof require !== 'undefined') {
    require.extensions['css'] = file => {}
}
// 返回要修改的config，withCss会生成一个config对象
module.exports = withCss({})