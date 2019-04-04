// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: '消息中心',
    path: '/message/info',
    icon: 'message',
  },
];


//首页
const home={
  name: '首页',
  path: '/home',
  icon: 'home',
};
/*商品管理*/
const goods={
  name: '商品管理',
  path: '/goods',
  icon: 'shop',
  authority: ['admin','normAdmin','measure'],
  children: [
    {
      name: '\u6DFB\u52A0\u5546\u54C1',
      path: '/goods/typeadd',
    },
    {
      name: '商品列表',
      path: '/goods/typeinfo',
    },
    {
      name: '类别管理',
      path: '/goodtype/manage',
    },
    {
      name: '系列管理',
      path: '/goodsseried/manage',
    },
  ],
};

/*客户管理*/
const customer={
  name: '业务管理',
  path: '/customer',
  icon: 'person',
  authority: ['admin', 'firm'],
  children: [
    {
      name: '客户列表',
      path: '/customer/info',
    },
    {
      name: '添加客户',
      path: '/customer/add',
    },
    {
      name: '添加订单',
      path: '/order/add',
    },
  ],
};

/*人员管理*/
const personnel={
  name: '人员管理',
  path: '/personnel',
  icon: 'yonghu',
  authority: ['admin','normAdmin','finance'],
  children: [
    {
      name: '\u4EBA\u5458\u5217\u8868',
      path: '/personnel/info',
    },
    {
      name: '添加人员',
      path: '/personnel/add',
    },
  ],
};
/*部门管理*/
const department={
  name: '部门管理',
  path: '/department',
  icon: 'fans2',
  authority: ['admin','normAdmin','finance'],
  children: [
    {
      name: '部门列表',
      path: '/department/info',
    },
    {
      name: '添加部门',
      path: '/department/add',
    },
  ],
};

/*订单管理*/
const order={
  name: '订单管理',
  path: '/order',
  icon: 'ol-list',
  authority: 'admin',
  children: [
    {
      name: '订单列表',
      path: '/order/info',
    },
    {
      name: '开料记录',
      path: '/order/searchkailiao',
    },
  ],
};
/*财务管理*/
const finance={
  name: '财务管理',
  path: '/finance',
  icon: 'pin',
  authority: ['admin','finance'],
  children: [
    {
      name: '财务列表',
      path: '/finance/info',
    },
    {
      name: '进货单',
      path: '/finance/examine',
    },
    {
      name: '客户管理',
      path: '/customer2/info'
    },
    {
      name: '开票管理',
      path: '/finance/invoicing',
    },
  ],
};
/*测量设计*/
const design={
  name: '测量设计',
  path: '/design',
  icon: 'edit2',
  authority: ['admin','normAdmin','measure'],
  children: [
    {
      name: '添加总单', //添加总单
      path: '/design/generallist',
    },
    {
      name: '待测量列表',
      path: '/design/info',
    },
    {
      name: '待开料列表',
      path: '/design/info2',
    },
    {
      name:'添加模板',
      path: '/desgin/tempalte',
    },
    {
      name:'编辑模板',
      path: '/desgin/tempalteedit',
    },
    {
      name:'缺货申请',
      path: '/application/lackgoods',
    },
  ],
};

//生产管理
const produc={
  name: '生产管理',
  path: '/produc',
  icon: 'sucai',
  authority: ['admin','normAdmin','product'],
  children: [
    {
      name: '待生产列表',
      path: '/produc/info',
    },
    {
      name: '待入库订单',
      path: '/produc/putin',
    },
    {
      name: '待出库订单',
      path: '/produc/putout',
    },
    {
      name: '用料单',
      path: '/produc/usematerials',
    },
    {
      name: '查看库存',
      path: '/produc/kucun',
    },
    {
      name:'缺货申请',
      path: '/application/lackgoods',
    },
  ],
};

//工程管理菜单
const project={
  name: '工程管理',
  path: '/project',
  icon: 'qrcode',
  authority: ['admin','normAdmin','project'],
  children: [
    {
      name: '待收货订单',
      path: '/project/putout',
    },
    {
      name: '待安装订单',
      path: '/project/preinstall',
    },
    {
      name: '完成订单',
      path: '/project/prefinish',
    },
  ],
};

//采购管理
const purchase={
  name: '采购管理',
  path: '/purchase',
  icon: 'shopcar',
  authority: ['admin','normAdmin','purchase'],
  children: [
    {
      name: '材料类别',
      path: '/purchase/type',
    },
    {
      name: '\u6750\u6599\u5E93', //材料库
      path: '/purchase/list',
    },
    {
      name: '进货单', //进货管理
      path: '/purchase/putin',
    },
    {
      name: '进货统计', //进货管理
      path: '/purchase/totall',
    },
    {
      name: '缺货处理', //进货管理
      path: '/deal/lackgoods',
    },
  ],
};

//消息管理
const message={
  name: '消息管理',
  path: '/message',
  icon: 'message',
  children: [
    {
      name: '留言管理',
      path: '/leaving/message',
      authority: 'admin',
    },
    {
      name: '发布消息',
      path: '/message/add',
    },
    {
      name: '收件箱',
      path: '/message/info',
    },
    {
      name: '发件箱',
      path: '/messageinfo/send',
    },
  ],
};

const orderDetail = {
  name: '订单基础信息',
  path: '/orderDetail',
  icon: 'copy',
}


//const asideMenuConfig = [home, goods, goods2, customer,customer2, personnel,personnel2, department,department2, order, finance,finance2, design,design2, produc,produc2, project,project2, purchase,purchase2, message ];
const asideMenuConfig = [home,order,orderDetail, customer,  finance, design, purchase, produc, project, goods, department, personnel,message,  ];

// function editMenu(authority){
//   if(authority=="admin"){
//     return [home, goods, customer, personnel, department, order, finance, design, produc, project, purchase, message ];
//   }else if(authority=='finance'){
//     return [home, personnel, department, finance, message ];
//   }else if(authority=='measure'){
//     return [home, goods, design, message ];
//   }else if(authority=='product'){
//     return [home, produc, message ];
//   }else if(authority=='project'){
//     return [home, project, message ];
//   }else if(authority=='purchase'){
//     return [home, purchase, message ];
//   }else if(authority=='firm'){
//     return [home, customer, message ];
//   }else{
//     return [home];
//   }
// }



export { headerMenuConfig, asideMenuConfig };
