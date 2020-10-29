import {createStore, applyMiddleware, combineReducers} from 'redux'
import ReduxThunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import axios from 'axios'

const userInitialState = {}
const LOGOUT = 'LOGOUT'

function userReducer(state = userInitialState, action) {
    switch (action.type) {
      case LOGOUT: 
        return {}
      default:
        return state
    }
}

// 退出登录
export function logout () {
    axios.post('/logout').then(res => {
        if(res.status === 200) {
            dispatch({type: LOGOUT})
        }else {
            console.log('logout fail');
        }
    }).catch(err => {
        console.log('logout fail', err);
    })
}

const allReducer = combineReducers({
    user: userReducer
})

// 返回一个方法创建store
export default function initoalizeStore(state) {
    return createStore(
        allReducer,
        // 合并state，state：初始化时传入的initialState
        Object.assign({}, {user: userInitialState}, state),
        // 使用redux-devtools-extension插件
        composeWithDevTools(applyMiddleware(ReduxThunk))
    )
}