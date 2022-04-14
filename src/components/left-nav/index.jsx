import React, { Component } from 'react'
import "./index.less"
import logo from "../../assets/images/logo.png"
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;

/*
  左侧导航组件
*/
class LeftNav extends Component {
  /*
     在第一次render()之前执行一次，为第一个render（）准备数据(必须是同步的)
  */
  constructor(props) {
    super(props)
    this.menuNodes = this.getMenuNodes(menuList)
  }

  /*
    1.根据menu的数据数组生成对应的标签数组
    2.使用map()返回一个数组+递归
  */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.map((item) => {

      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          )
        } else {

          //查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          //如果存在，说明当前item的字列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }


          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }else{
        return []
      }



    })
  }


  /**
   * 判断当前登录用户对item是否有权限
   * @param {*} item 
   */
  hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /**
     * 1.如果当前用户是admin
     * 2.如果当前item是公开的
     * 3.当前用户有此item的权限：key有咩有在menus中
     */
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if(item.children){ //4.如果当前用户有此item的某个子item的权限
       return !!item.children.find(child=>menus.indexOf(child.key) !== -1)
    }else{
      return false
    }
  }

  /*
      在第一次render()之前执行一次，为第一个render（）准备数据(必须是同步的)
  */
  // UNSAFE_componentWillMount(){
  //   this.menuNodes=this.getMenuNodes(menuList)
  // }

  render() {
    //得到当前请求的路径路由
    let path = this.props.location.pathname;
    //得到需要打开菜单项的key
    const openKey = this.openKey;
    if (path.indexOf("/product") === 0) {//当前请求的是商品或者其子路由界面
      path = "/product"
    }

    return (
      <div className='left-nav'>
        {/*上面的头像 */}
        <Link to="/" className='left-nav-header'>
          <img src={logo} alt="" />
          <h1>硅谷后台</h1>
        </Link>

        {/* 下面的菜单栏*/}
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}
/*
    withRouter高阶组件;
      包装非路由组件，返回一个新的组件：
      新的组件向非路由组件传递三个属性：history、location、match

*/
export default withRouter(LeftNav)
