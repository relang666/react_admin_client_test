import React, {  PureComponent } from 'react'
import { Form, Input, Select } from 'antd';
const Option = Select.Option


/*
    添加/修改用户的form组件
*/
export default class UserForm extends PureComponent {
    formRef = React.createRef();


    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            username: "",
            password: "",
            phone: "",
            email: "",
            role_id: "",
        });
    }

    //子组件中做一函数，父组件可以调用获取值
    getValues = () => {
        return this.formRef.current.getFieldsValue()
    }
    render() {
        const { roles ,user} = this.props


        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//指定右侧包裹的宽度
        }
        return (
            <Form ref={this.formRef} {...formItemLayout}>

                <Form.Item label="用户名：" name="username" initialValue={user.username} rules={[{ required: true, message: "不能为空" }]}>
                    <Input placeholder='请输入用户名' />
                </Form.Item>
                {
                    user._id ? null : (
                        <Form.Item label="密码：" name="password" initialValue={user.password} rules={[{ required: true, message: "不能为空" }]}>
                            <Input type="password" placeholder='请输入密码' />
                        </Form.Item>
                    )
                }
                <Form.Item label="手机号：" name="phone" initialValue={user.phone} rules={[{ required: true, message: "不能为空" }]}>
                    <Input placeholder='请输入手机号' />
                </Form.Item>
                <Form.Item label="邮箱：" name="email" initialValue={user.email} rules={[{ required: true, message: "不能为空" }]}>
                    <Input placeholder='请输入邮箱' />
                </Form.Item>
                <Form.Item label="角色：" name="role_id" initialValue={user.role_id} rules={[{ required: true, message: "不能为空" }]}>
                    <Select>
                        {
                            roles.map((role) => {
                                return <Option value={role._id} key={role._id}>{role.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>

            </Form>
        )
    }
}
