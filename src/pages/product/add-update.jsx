import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqCategorys ,reqAddOrUpdateProduct} from '../../api';
import PicturesWall from './picturesWall';
import RichTextEditor from './richTextEditor';
const { Item } = Form;
const { TextArea } = Input

export default class ProductAddUpdate extends Component {
  constructor(props){
    super(props)
    //如果是添加是没有值，修改则是有值
    const product=this.props.location.state;
    this.isUpdate=!!product;//两个感叹号，表示product有值就是true  否则false
    this.product=product||{}//保存商品
    this.pw=React.createRef()
    this.editor=React.createRef()
  }
  state = {
    options: [],
  }
  formRef = React.createRef();
  submit = () => {
    this.formRef.current.validateFields().then(async values => {
        console.log(values)
        //1.收集数据，并封装成product对象
        const {name,desc,price,categoryIds}=values
        let pCategoryId,categoryId;
        if(categoryIds.length===1){
            pCategoryId="0"
            categoryId=categoryIds[0]
        }else{
            pCategoryId=categoryIds[0]
            categoryId=categoryIds[1]
        }
        const imgs=this.pw.current.getImages();
        const detail=this.editor.current.getDetail()
        const product={name,desc,price,imgs,detail,pCategoryId,categoryId}
        //如果是更新，需要添加_id
        if(this.isUpdate){
           product._id=this.product._id;
        }
        //2.调用接口请求函数去添加/更新
        const result=await reqAddOrUpdateProduct(product)

        //3.根据结果显示
        if(result.status===0){
          message.success(`${this.isUpdate?"更新":"添加"}商品成功！`)
          this.props.history.goBack();
        }else{
          message.error(`${this.isUpdate?"更新":"添加"}商品失败！`)

        }
    }).catch(errorInfo => {
      message.error("请检查问题！")
    })
  }

  validatePrice = (_, value) => {
    if (value * 1 > 0) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('价格必须大于0'));

    }
  }

  initOptions = async (categorys) => {
    //根据categorys生成options数组,注意下面生成对象  外面得包一个括号
    const options=categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))
    //如果是一个二级分类商品的更新
    const {isUpdate,product}=this;
    const {pCategoryId}=product
    if(isUpdate&&pCategoryId!=="0"){
        //获取对应的二级分类列表
        const subCategorys = await this.getCategorys(pCategoryId);
        //生成一个二级列表的options
        const childOptions=subCategorys.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: true,
        }))
        //找到当前商品对应的一级option对象
         const  targetOption=options.find(option=>option.value===pCategoryId)
        //关联到对应的一级option上
        targetOption.children=childOptions
    }

    this.setState({options})
  }
  //获取一级/二级分类列表，并显示
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      //如果是一级分类列表
      if(parentId==="0"){
         this.initOptions(categorys)
      }else{
         return categorys
      }
    }
  }

  //用于加载下一级列表
  loadData =async selectedOptions => {
    //得到选择的option对象
    const targetOption = selectedOptions[0];
    //显示loading效果
    targetOption.loading = true;


    //根据选中的分类，请求二级分类列表,现在option的结构是
    /*
    { value: c._id,
      label: c.name,
      isLeaf: false,
    }
     */
    const subCategorys=await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if(subCategorys&&subCategorys.length>0){
      //生成一个二级列表的options
      const childOptions=subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //关联到当前option上
      targetOption.children=childOptions
    }else{
      targetOption.isLeaf=true;
    }

      //更新options状态
      this.setState({
        options: [...this.state.options]
      })

  };

  componentDidMount() {
    this.getCategorys("0")
  }
  render() {
    const {isUpdate,product}=this;
    const {pCategoryId,categoryId,detail,imgs}=product

    //用来接收级联分类ID的数组
    const categoryIds=[] 
    if(isUpdate){
       //商品是一个一级分类的商品
       if(pCategoryId==="0"){
         categoryIds.push(categoryId)
       }else{
       //商品是一个二级分类的商品
         categoryIds.push(pCategoryId) 
         categoryIds.push(categoryId) 
       }
    }



    //指定item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 },//左侧label的宽度
      wrapperCol: { span: 8 },//指定右侧包裹的宽度
    }
    const title = (
      <span>
        <LinkButton >
          <ArrowLeftOutlined style={{ color: 'green', fontSize: 20 }} onClick={() => this.props.history.goBack()} />
        </LinkButton>
        <span style={{ margin: "0 10px" }}>{isUpdate?"修改商品":"添加商品"}</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form {...formItemLayout} ref={this.formRef}>
          <Item label="商品名称："
            name="name"
            initialValue={product.name}
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input placeholder='请输入商品名称'></Input>
          </Item>
          <Item label="商品描述："
            name="desc"
            initialValue={product.desc}
            rules={[{ required: true, message: '描述不能为空' }]}
          >
            <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
          </Item>
          <Item label="商品价格："
            name="price"
            initialValue={product.price}
            rules={[
              { required: true, message: '不能为空' },
              { validator: this.validatePrice }

            ]}
          >
            <Input type="number" placeholder='请输入商品价格' addonAfter="元"></Input>
          </Item>
          <Item label="商品分类："
            name="categoryIds"
            initialValue={categoryIds}
            rules={[
              { required: true, message: '不能为空' },
            ]}
          >
            <Cascader
              placeholder='请选择商品分类'
              options={this.state.options}//需要显示的列表数据数组
              loadData={this.loadData} //当选择某个列表项 加载二级列表
            ></Cascader>
          </Item>

          <Item label="商品图片：">
            <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
          </Item>

          <Item label="商品详情："labelCol={{span:2}} wrapperCol={{span:20}}>
              <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
          </Item>


          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>

        </Form>
      </Card>
    )
  }
}
