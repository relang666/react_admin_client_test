import React, { Component } from 'react'
import { Form, Input } from 'antd';


/*
    添加分类的form组件
*/
export default class AddForm extends Component {
    formRef = React.createRef();

    static propTypes = {
        //  categorys:PropTypes.array.isRequired,//一级分类的数组
        //  parentId:PropTypes.string.isRequired//父分类的ID
    }

    componentDidUpdate() {
        this.formRef.current.setFieldsValue({
            role_name: ""
        });
    }

    //子组件中做一函数，父组件可以调用获取值
    getRoleName=()=>{
        return this.formRef.current.getFieldsValue().role_name
    }
    render() {
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//指定右侧包裹的宽度
        }
        return (
            <Form ref={this.formRef} {...formItemLayout}>

                <Form.Item label="角色名称：" name="role_name" initialValue="" rules={[{ required: true, message: "不能为空" }]}>
                    <Input placeholder='请输入角色名称' />
                </Form.Item>

            </Form>
        )
    }
}
