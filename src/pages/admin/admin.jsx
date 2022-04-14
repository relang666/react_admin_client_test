import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../../components/header';
import LeftNav from '../../components/left-nav';
import Home from '../home/home';
import Category from '../category/category';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';

const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    //如果内存中没有存储user，说明没有登录
    if (!user || !user._id) {
      //自动跳转到登录界面（在render()中）
      return <Redirect to="/login"></Redirect>
    }
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin:"20px", backgroundColor: "#fff" }}>
            <Switch>
              <Route path='/home' component={Home} /> 
              <Route path='/category' component={Category} /> 
              <Route path='/product' component={Product} /> 
              <Route path='/role' component={Role} /> 
              <Route path='/user' component={User} /> 
              <Route path='/charts/bar' component={Bar} /> 
              <Route path='/charts/line' component={Line} /> 
              <Route path='/charts/pie' component={Pie} /> 
              <Redirect to='/home' />
            </Switch>

          </Content>
          <Footer style={{ fontSize: "20px", textAlign: "center", color: "#cccccc" }}>推荐使用谷歌浏览器,可以获得更佳的页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
