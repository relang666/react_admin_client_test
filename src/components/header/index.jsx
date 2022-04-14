import React, { Component } from 'react'
import "./index.less"
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;



/*
    头部组件
*/
class Header extends Component {
  state={
    currentTime:formateDate(Date.now())
  }

  //从数组中的对象中获取对应的title
  getTitle=()=>{
    const path=this.props.location.pathname;
    let title="";
    menuList.forEach((item)=>{
        if(item.key===path){
          title=item.title;
        }else if(item.children){
          const cItem=item.children.find((cItem)=>path.indexOf(cItem.key)===0)
          if(cItem){
            title=cItem.title;
          }
          
        }
    })
    return title;
  }

  getTime=()=>{
      //每隔一秒钟获取当前时间，并更新状态数据currentTime
      this.intervalId=setInterval(()=>{
        const currentTime=formateDate(Date.now());
        this.setState({currentTime})
      },1000)
  }
  // 在第一次render()之后执行一次，一般在此执行异步操作：发送ajax请求、启动定时器
  componentDidMount(){
      this.getTime()
  }

  //在当前组件卸载之前
  componentWillUnmount(){
      clearInterval(this.intervalId)
  }

   logOut=()=>{
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定退出吗?',
      onOk:()=> {
        //删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user={}
        //跳转到login
        this.props.history.replace("/login")

      }
    });
  }
  render() {
    const user=memoryUtils.user
    const title=this.getTitle();
    return (
      <div className='header'>
          <div className='header-top'>
              <span>欢迎,{user.username}</span>
              <LinkButton onClick={this.logOut}>退出</LinkButton>
          </div>
          <div className='header-bottom'>
            <div className='header-bottom-left'>{title}</div>
            <div className='header-bottom-right'>
                <span className='time'>{this.state.currentTime}</span>
                <span>晴</span>
            </div>
          </div>
      </div>
    )
  }
}
export default withRouter(Header)