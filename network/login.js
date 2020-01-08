// 包装home组件的一些数据，模块化
import {request} from '../network/request'




// 登入的数据请求

export function getGoodsdata(username,password){
    return request({
        url:'/login',
        params:{
            username,
            password
        }
    })
}