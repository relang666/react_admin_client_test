import React, { Component } from 'react'
import { Form, Input, Select} from 'antd';
import PropTypes from "prop-types"
const { Option } = Select;


/*
    添加分类的form组件
*/
export default class AddForm extends Component {
  formRef = React.createRef();

  static propTypes={
     categorys:PropTypes.array.isRequired,//一级分类的数组
     parentId:PropTypes.string.isRequired//父分类的ID
  }

  componentDidUpdate(){
    this.formRef.current.setFieldsValue({
      parentId: this.props.parentId,
      categoryName:""
  });
  }

  render() {
    const {categorys,parentId}=this.props;
    console.log(categorys)
    return (
      <Form ref={this.formRef} name="control-hooks">
        <Form.Item name="parentId"  initialValue={parentId} rules={[{ required: true }]}>
          <Select>
            <Option value="0">一级分类</Option>
              {
                  //一级分类的id作为二级分类的父ID
                  categorys.map((obj)=><Option value={obj._id} key={obj._id}>{obj.name}</Option>)
              }
          </Select>
        </Form.Item>

        <Form.Item name="categoryName"  initialValue="" rules={[{ required: true }]}>
          <Input  placeholder='请输入分类名称'/>
        </Form.Item>

      </Form>
    )
  }
}
