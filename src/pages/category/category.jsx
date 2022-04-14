import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqCategorys, requpdateCategory,reqaddCategory } from '../../api';
import AddForm from './add-form';
import UpdateForm from "./update-form"

/*商品分类路由 */
export default class Category extends Component {
  formRef = React.createRef();
  formRef2= React.createRef();
  //将数据放在状态里，修改数据更新state,就会执行render再次渲染
  state = {
    loading: false,//是否正在获取数据中
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: "0",//当前需要显示的分类列表的父分类ID
    parentName: "",//当前需要显示的分类列表的父分类名称
    showStatus: 0//标识添加/更新的确认是否显示，0：都不显示，1：显示添加；2显示更新
  }
  constructor(props) {
    super(props)
    //为第一次render()准备数据
    this.inintColums()

  }

  /*
      初始化table所有列的数组
  */
  inintColums = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', //指定显示数据对应的属性名
        key: 'name',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (category) => (//指定需要显示的界面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/*
              注意：外面不包函数的话，渲染时就会调用，就不是点击才调用
              所以得加一层函数，可以使用箭头函数实现()=>{},这样就可以实现向事件函数里面传递参数
            */}
            {this.state.parentId === "0" ? <LinkButton onClick={() => { this.getSubCategorys(category) }}>查看子分类</LinkButton> : null}

          </span>
        ),
        width: "40%"
      },

    ];
  }

  //异步获取一级或者二级分类列表显示
  //参数parentId:如果传过来有参数就是他  如果没有就是状态里面的parentid
  getCategorys = async (parentId) => {
    parentId= parentId||this.state.parentId;
    //在发请求前，显示loading
    this.setState({ loading: true })
    const result = await reqCategorys(parentId);

    //在发请求后，隐藏loading
    this.setState({ loading: false })

    if (result.status === 0) {
      //去除分类数组（可能是一级的也可能是二级的）
      const categorys = result.data;
      if (parentId === "0") {
        //更新一级的
        this.setState({ categorys })
      } else {
      //更新二级的
      this.setState({ subCategorys: categorys })
      }
    } else {
      //提示错误信息
      message.error("获取分类列表失败")
    }
  }

  //显示指定一级分类列表
  showCategorys = () => {
    this.setState({
      subCategorys: [], //二级分类列表
      parentId: "0",//当前需要显示的分类列表的父分类ID置为0
      parentName: "",//当前需要显示的分类列表的父分类名称置为空
    }, () => {
      this.getCategorys();
    })
  }

  getSubCategorys = (category) => {
    console.log(category)
    //先更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {//在状态更新且重新render()后执行
      console.log(this.state.parentId)//------------------------"更改后的id"
      //获取二级分类列表
      this.getCategorys();
    })
    // console.log(this.state.parentId)
    // //获取二级分类列表
    // this.getCategorys();---------------------"0"
  }



  //响应点击取消：隐藏确定框
  handleCancel = () => {
    this.setState({
      showStatus: 0
    })
  };

  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  showUpdate = (category) => {
    this.category = category
    this.setState({
      showStatus: 2,
    })
  }

  //添加分类
  addCategory =async () => {
        //进行表单验证，只有通过了才处理
        this.formRef2.current.formRef.current.validateFields()
        .then(async(values) => {
           //1.隐藏确定框
            this.setState({
              showStatus: 0,
            })
            const categoryId = values.parentId;
            const categoryName = values.categoryName
            console.log(categoryId,categoryName)

            //2.发请求更新分类
            const result = await reqaddCategory(categoryName,categoryId);
            if (result.status === 0) {
              //3.添加的分类就是当前分类列表下的分类，其他的刷新没有意义
              if(categoryId===this.state.parentId){
                //重新获取当前分类列表
                this.getCategorys();
              }else if(categoryId==="0"){
                //在二级分类下添加一级分类时，重新获取一级分类列表，但是不需要显示一级列表
                this.getCategorys("0")
              }
              
            }
        })
        .catch(errorInfo => {
            message.error("请检查问题!")
        });
       
   
  }


  //更新分类
  updateCategory =  () => {
    //进行表单验证，只有通过了才处理
    this.formRef.current.formRef.current.validateFields()
    .then(async(values) => {
      //1.隐藏确定框
      this.setState({
        showStatus: 0,
      })
      const categoryId = this.category._id;
      //const categoryName=this.form.getFieldValue("categoryName");
      //得到子组件传过来的值
      const categoryName = values.categoryName
      //2.发请求更新分类
      const result = await requpdateCategory({ categoryId, categoryName });
      if (result.status === 0) {
        //3.重新显示列表
        this.getCategorys();
      }
    })
    .catch(errorInfo => {
        message.error("请检查问题!")
    });
   

  }




  //执行异步任务：发送异步ajax请求
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    //读取状态数据
    const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
    const category = this.category || { name: "" } // 如果还没有指定一个空对象
    //card的左侧
    const title = parentId === "0" ? "一级分类列表" : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined />
        &nbsp;
        <span>{parentName}</span>
      </span>
    )
    //card的右侧
    const extra = (
      <Button type="primary" icon={<PlusOutlined />} size={"small"} onClick={this.showAdd}>
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          loading={loading}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
        <Modal title="添加分类" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
          <AddForm categorys={categorys} parentId={parentId} ref={this.formRef2}></AddForm>
        </Modal>
        <Modal title="更新分类" visible={showStatus === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
          <UpdateForm ref={this.formRef} categoryName={category.name}
            setForm={(form) => { this.form = form }} ></UpdateForm>
        </Modal>
      </Card>
    )
  }
}
