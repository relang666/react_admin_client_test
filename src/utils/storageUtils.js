/*
    进行local数据存储管理的工具模块
*/
import store from "store"
const USER_KEY="user_key"
export default{ //暴露一个对象
    //保存user
        saveUser(user){
            //第二个参数是一个字符串
            //localStorage.setItem(USER_KEY,JSON.stringify(user))

            //使用库store,语法更加简洁
            store.set(USER_KEY, user)

        },
    //读取user
        getUser(){
            //return JSON.parse(vlocalStorage.getItem(USER_KEY)||"{}")  
            return store.get(USER_KEY)||{}
        },
    //删除user
        removeUser(){
            //localStorage.removeItem(USER_KEY)
            store.remove(USER_KEY)
        }
        
        
}