import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
  } from '@ant-design/icons';

const menuList = [
    {
      title: '首页', // 菜单标题名称
      key: '/home', // 对应的path
      icon: <AppstoreOutlined/>, // 图标名称
      isPublic: true, // 公开的
    },
    {
      title: '商品',
      key: '/products',
      icon: <MenuUnfoldOutlined/>,
      children: [ // 子菜单列表
        {
          title: '品类管理',
          key: '/category',
          icon: <MenuFoldOutlined/>
        },
        {
          title: '商品管理',
          key: '/product',
          icon: <MailOutlined/>
        },
      ]
    },
  
    {
      title: '用户管理',
      key: '/user',
      icon: <ContainerOutlined/>
    },
    {
      title: '角色管理',
      key: '/role',
      icon: <DesktopOutlined/>,
    },
  
    {
      title: '图形图表',
      key: '/charts',
      icon: <MenuUnfoldOutlined/>,
      children: [
        {
          title: '柱形图',
          key: '/charts/bar',
          icon: <DesktopOutlined/>
        },
        {
          title: '折线图',
          key: '/charts/line',
          icon: <ContainerOutlined/>
        },
        {
          title: '饼图',
          key: '/charts/pie',
          icon: <PieChartOutlined/>
        },
      ]
    },

  ]
  
  export default menuList