/*
    要求：能根据接口文档定义接口请求
    包含应用中所有接口请求函数的模块
    每个函数的返回值都是promise
*/
import ajax from "./ajax"

//登录
/*
    export function reqLogin(username,password){
        return ajax("/login",{username,password},"POST")
    }
*/
//箭头函数返回值问题：当只有一条返回语句时，可以省略花括号，且return必须省略.
//执行结果就是器返回值
export const reqLogin=(username,password)=>ajax("/login",{username,password},"POST")

//获取分类列表
export const reqCategorys=(parentId)=>ajax("/manage/category/list",{parentId},"GET")

//添加分类
export const reqaddCategory=(categoryName, parentId)=>ajax("/manage/category/add",{categoryName, parentId},"  POST")

//更新分类
export const requpdateCategory=({categoryId, categoryName})=>ajax("/manage/category/update",{categoryId, categoryName},"POST")

//获取一个分类
export const reqCategory=(categoryId)=>ajax("/manage/category/info",{categoryId},"GET")

//获取商品分页列表
export const reqProducts=(pageNum, pageSize)=>ajax("/manage/product/list",{pageNum, pageSize},"GET")

//更新商品的状态（上架与下架）
export const requpdateStatus=(productId, status)=>ajax("/manage/product/updateStatus",{productId, status},"POST")

//删除图片
export const reqDeleteImg=(name)=>ajax("/manage/img/delete",{name},"POST")

//搜索商品分页列表
//searchType:搜索的类型，productName/productDesc
//要使变量的值作为属性名，需要加[]，不然属性名就是变量名
export const reqSearchProducts=({pageNum, pageSize,searchName,searchType})=>ajax("/manage/product/search",
{
    pageNum, 
    pageSize,
    [searchType]:searchName
},"GET")


//添加商品
export const reqAddOrUpdateProduct=(product)=>ajax("/manage/product/"+(product._id?"update":"add"),product,"  POST")


//获取所有角色的列表
export const reqRoles=()=>ajax("/manage/role/list")
// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
// 修改角色,此时传过来的已经是一个对象了
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//获取用户列表
export const reqUsers=()=>ajax("/manage/user/list")
//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')
//添加用户
export const reqAddOrUpdateUser=(user)=>ajax("/manage/user/"+(user._id?"update":"add"),user,"POST")
