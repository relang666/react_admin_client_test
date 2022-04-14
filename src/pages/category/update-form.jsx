import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from "prop-types"
/*
    更新分类的form组件
*/
export default class UpdateForm extends Component {
  formRef = React.createRef();

  static propTypes={
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }


  //组件挂载完之后的钩子，也就是render()执行完之后就会执行这个钩子
  componentDidUpdate() {
    this.formRef.current.setFieldsValue({
        categoryName: this.props.categoryName,
    });
  }

  render() {


    const {categoryName}=this.props;
    console.log(categoryName)

    return (
      <Form name="control-hooks" ref={this.formRef}  preserve={false}>
        <Form.Item name="categoryName" initialValue={categoryName}  rules={[{ required: true,message:"请输入名称，不能为空!" }]}>
          <Input  placeholder="请输入分类名称" />
        </Form.Item>
      </Form>
    )
  }
}

