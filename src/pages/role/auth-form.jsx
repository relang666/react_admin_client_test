import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd';
import PropTypes from "prop-types"
import menuList from "../../config/menuConfig"


/*
    添加分类的form组件
*/
export default class AuthForm extends Component {
    formRef = React.createRef();
    constructor(props){
        console.log(111111111)
        super(props)
        this.menuNodes=[{
            title: '平台权限',
            key: 'all',
            children:this.getMenuNodes(menuList)
        }]
        //根据传入的角色的menus生成初始状态
        const {menus}=this.props.role
        this.state={
            checkedKeys:menus
        }
      }
    
      /*
        1.根据menu的数据数组生成对应的标签数组
        2.使用map()返回一个数组+递归
      */
      getMenuNodes = (menuList) => {
      //const path=this.props.location.pathname;
       return  menuList.map((item) => {
          if (!item.children) {
            return (
                {
                    title:item.title,
                    key:item.key
                }
            )
          } else{
            return (
                {
                    title:item.title,
                    key:item.key,
                    children:this.getMenuNodes(item.children)
                }
            )
          }
        })
      }

    static propTypes = {
        role: PropTypes.object
    }

    getMenus(){
        return this.state.checkedKeys
    }

    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            role_name: this.props.role.name
        });
    }

    
    UNSAFE_componentWillReceiveProps(nextprops){
        console.log(nextprops)
        const menus=nextprops.role.menus;
        this.setState({checkedKeys:menus})
    }
    //点击选项时的回调
    onCheck = (checkedKeys, info) => {
        this.setState({checkedKeys})
      };


    render() {
        const { role} = this.props
        const {checkedKeys}=this.state
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//指定右侧包裹的宽度
        }
          
        return (
            <Form ref={this.formRef} {...formItemLayout}>
                <Form.Item label="角色名称：" name="role_name" initialValue={role.name}>
                    <Input disabled />
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={this.onCheck}
                    treeData={this.menuNodes}
                    checkedKeys={checkedKeys}
                />
            </Form>
        )
    }
}
