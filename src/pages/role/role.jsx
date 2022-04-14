import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from '../../utils/memoryUtils';
import { formateDate } from '../../utils/dateUtils';
/*角色路由 */
export default class Role extends Component {
  constructor(props) {
    super(props);
    this.initColums();
  }

  formRef = React.createRef();
  formRef2 = React.createRef();

  state = {
    roles: [],//所有角色的列表
    role: {},//选中的角色
    isSHowAdd: false,// 是否显示添加界面,
    isSHowAuth: false//是否显示设置权限界面
  }

  initColums = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name', //指定显示数据对应的属性名
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time', //指定显示数据对应的属性名
        key: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time', //指定显示数据对应的属性名
        key: 'auth_time',
        render: (auth_time) => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name', //指定显示数据对应的属性名
        key: 'auth_name',
      },

    ]
  }

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    }
  }

  //添加角色的回调
  addRole = () => {
    this.formRef.current.formRef.current.validateFields().then(async value => {
      this.setState({ isSHowAdd: false })
      /*第一种方式 
        const roleName = this.formRef.current.getRoleName();
        console.log(roleName)
      */
      /* 
        第二种方式获取，validate的参数
      */
      const roleName = value.role_name
      const result = await reqAddRole(roleName);
      if (result.status === 0) {
        //新产生的角色
        const role = result.data
        //更新数组也就是要显示最新的数据
        /*这种写法不是很好
          const roles=this.state.roles;
          roles.push(role)
          this.setState({roles})
        */
        //更新roles状态：基于原本状态数据更新，比如添加一条数据
        this.setState(state => ({
          roles: [...state.roles, role]
        }))
        message.success("添加成功！")
      }
    }).catch()

  }

  //更新角色的回调
  updateRole = async () => {
    this.setState({ isSHowAuth: false })
    const role = this.state.role
    const menus = this.formRef2.current.getMenus();
    role.menus = menus
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now();
    //请求更新
    console.log(role)
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      //返回值是一个更新之后的role,此时是后台已经将roles进行了更新，所以显示更新后的全部选项

      //如果当前更新的是自己角色的权限，强制退出
      if (role._id===memoryUtils.user.role_id) {
          memoryUtils.user={}
          this.props.history.replace("/login")
          message.success("当前用户角色权限修改了，重新登录!")

      } else {
        // this.setState({
        //   roles:[...this.state.roles]
        // })
        message.success("更新角色权限成功！")
        this.getRoles()
      }


    }
  }



  componentDidMount() {
    this.getRoles();
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({ role })
      }, // 点击行
      onDoubleClick: event => { },
      onContextMenu: event => { },
      onMouseEnter: event => { }, // 鼠标移入行
      onMouseLeave: event => { },
    };
  }



  render() {
    const { roles, role, isSHowAdd, isSHowAuth } = this.state
    const { _id } = role
    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({ isSHowAdd: true })}>创建角色</Button>
        <Button type='primary' style={{ marginLeft: 20 }} disabled={_id ? false : true}
          onClick={() => this.setState({ isSHowAuth: true })}
        >设置角色权限</Button>
      </span>
    )


    return (
      <div>
        <Card title={title}>
          <Table dataSource={roles}
            columns={this.columns}
            bordered
            rowKey="_id"
            pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
            rowSelection={
              { 
                type: "radio", 
                selectedRowKeys: [_id] ,
                onSelect:(role)=>{  //选择某个radio的时候的回调
                    this.setState({
                      role
                    })
                }
              }
            }
            onRow={this.onRow}
          />
          <Modal title="添加角色" visible={isSHowAdd} onOk={this.addRole} onCancel={() => this.setState({ isSHowAdd: false })}>
            <AddForm ref={this.formRef} ></AddForm>
          </Modal>
          <Modal title="设置角色权限" visible={isSHowAuth} onOk={this.updateRole} onCancel={() => this.setState({ isSHowAuth: false })}>
            <AuthForm ref={this.formRef2} role={role}></AuthForm>
          </Modal>
        </Card>
      </div>
    )
  }
}
