import {cloneElement} from 'react'

const style = {
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
}

const MyContainer = ({children, renderEle = <div />}) => {
    return cloneElement(renderEle, {
        style: Object.assign({}, renderEle.props.style, style),
        children
    })
}

// copm属性可以将标签类型传递到子组件内部
// const MyContainer = ({children, comp: Comp}) => {
//     return (
//         <Comp style={style}>{children}</Comp>
//     )
// }

export default MyContainer