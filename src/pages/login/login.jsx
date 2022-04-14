import React, { Component } from 'react'
import "./login.css"
import logo from "../../assets/images/logo.png"
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {Redirect} from "react-router-dom"


// 用户登录的路由组件

export default class Login extends Component {
    state = { isRedirect: false }
    formRef = React.createRef();
    //点击登录后，触发事件
    handleSubmit = async (values) => {
        /*
            获取数据两种方式：
                1.通过ref方式
                    首先拿到函数的返回值：formRef=React.createRef();
                    再是以下：
                    const form=this.formRef.current;
                    const values=form.getFieldsValue(["name","password"])
                    console.log("数据是:",values.name)
                2.直接通过参数values，通过解构赋值的形式获取对应的数据
                    const {name,password}=values;
                    console.log("用户名:"+name+" 密码是:"+password)

        */
        const { username, password } = values;
        console.log("用户名:" + username + " 密码是:" + password)
        //alt+<- 回退键
        //发送ajax请求,向后台传送数据
        //  reqLogin(username,password).then(response=>{
        //     console.log("成功的数据是:",response.data)
        // }).catch(error=>{
        //     console.log("失败了",error)
        // })

        //发送ajax请求,向后台传送数据，
        //简化模式,前面在封装时已经处理过异常，这里不需要在写try catch
        const result = await reqLogin(username, password)

        if (result.status === 0) {//登录成功
            //提示登录成功
            message.success("登陆成功")

            const user=result.data
            //保存user信息到内存里面
            memoryUtils.user = user;
            //保存到local中
            storageUtils.saveUser(user)


            //跳转到管理页面(不需要再回退到登录页面使用：replace,需要回退到登录界面使用：push)
            //页面跳转
            this.props.history.replace('/')




        } else {//登录失败
            //提示错误信息
            message.error(result.msg)
        }



    }
    validatePwd = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("密码不能为空!"))
        } else if (value.length < 4) {
            return Promise.reject(new Error("密码至少4位!"))
        } else if (value.length > 12) {
            return Promise.reject(new Error("密码最多12位!"))
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject(new Error("用户名必须是英文、数字或者下划线组成!"))
        } else {
            return Promise.resolve();
        }
    }
    render() {

        //如果用户已经登录，自动跳转到管理界面
        const user=memoryUtils.user;
        if(user&&user._id){
             return <Redirect to="/"/>
        }

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="" />
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form ref={this.formRef} className='login-form' onFinish={this.handleSubmit}>
                        <Form.Item name="username"
                            //表单验证,这种方式为声明式验证
                            rules={[
                                { required: true, whitespace: true, message: '用户名必须输入!' },
                                { min: 4, message: '用户名至少4位!' },
                                { max: 12, message: '用户名最多12位!' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或者下划线组成!' },

                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="用户名" />
                        </Form.Item>

                        <Form.Item name="password"
                            //自定义验证
                            rules={[
                                { validator: this.validatePwd, whitespace: true }

                            ]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" placeholder="密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录测试
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
/*
   两件事：
     1.前台表单验证
     2.搜集数据输入数据

*/
