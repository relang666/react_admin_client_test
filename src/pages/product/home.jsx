import React, { Component } from 'react'
import { Card, Button, Table, Select, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqProducts,reqSearchProducts,requpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants';


const { Option } = Select

/*
  product 的默认子路由组件
*/
export default class ProductHome extends Component {
  constructor(props) {
    super(props)
      //为第一次render()准备数据
      this.inintColums()

  }

  state = {
    products: [],//商品的数组
    total:0, //商品的总数量
    loading:false,//是否正在加载中
    searchName:"",//搜索的关键字名称-----------做一个受控组件，通过onchange监听去设置最新的值
    searchType:"productName",//根据哪个字段搜索

  }

  /*
      初始化table所有列的数组
  */
  inintColums = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name', //指定显示数据对应的属性名
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
        width: "50%"
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (price) => "￥" + price//当前指定了对应的属性，传入的是对应的属性值
      },
      {
        title: '状态',
        dataIndex: '',
        key: 'status',
        render: (product) => {
          const {_id,status}=product
          return (
            <span>
              <Button type='primary' onClick={()=>this.updateStatus(_id,status===1?2:1)}>{status === 1 ? "下架" : "上架"}</Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (product) => (//指定需要显示的界面标签
          <span>
            {/*将product对象使用state传递给目标路由组件 */}
            <LinkButton onClick={()=>this.props.history.push("/product/detail",product)}>详情</LinkButton>
            <LinkButton onClick={()=>this.props.history.push("/product/add-update",product)}>修改</LinkButton>

            {/* <LinkButton>修改</LinkButton> */}
            {/*
              注意：外面不包函数的话，渲染时就会调用，就不是点击才调用
              所以得加一层函数，可以使用箭头函数实现()=>{},这样就可以实现向事件函数里面传递参数
            */}
            {/* {this.state.parentId === "0" ? <LinkButton onClick={() => { this.getSubCategorys(category) }}>查看子分类</LinkButton> : null} */}
          </span>
        ),

      },

    ];
  }

  updateStatus=async (_id,status)=>{
    const result=await requpdateStatus(_id,status);
    if(result.status===0){
        message.success("更新商品成功")
        this.getProducts(this.pageNum)
    }
    
  }

  //获取指定页码的列表数据显示
  getProducts=async (pageNum)=>{
     this.pageNum=pageNum;//保存pageNum,让其他方法可以看见
     this.setState({loading:true})//显示loading
     const {searchName,searchType}=this.state
     const pageSize=PAGE_SIZE
     let result
     //如果搜索的关键字有值，说明我们要做的就是搜索分页
     if(searchName){
        //对象中的属性没有先后顺序
        result=await reqSearchProducts({pageNum,pageSize,searchName,searchType});
     }else{
        result=await reqProducts(pageNum,PAGE_SIZE);
     }
     this.setState({loading:false})//隐藏loading
     if(result.status===0){
       const {total,list}=result.data
       this.setState({total,products:list})
     }else{

     }
  }

  //执行异步任务：发送异步ajax请求
  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products,total ,loading,searchName,searchType} = this.state
    const title = (
      <span>
        <Select value={searchType} style={{ width: 150 }} 
                onChange={value=>this.setState({searchType:value})}> 
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{ width: 150, margin: "0 15px" }} value={searchName}
               onChange={event=>this.setState({searchName:event.target.value})}/>
        <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type="primary" icon={<PlusOutlined />} size={"middle"} 
      onClick={()=>this.props.history.push("/product/add-update")}>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={products}
          columns={this.columns}
          loading={loading}
          bordered
          rowKey="_id"
          pagination={{ 
            current:this.pageNum,
            total, 
            defaultPageSize: PAGE_SIZE, 
            showQuickJumper: true ,
            onChange:(pageNum)=>this.getProducts(pageNum) //这里可以简写为onChange:this.getProducts
          }}
        />
      </Card>
    )
  }
}
