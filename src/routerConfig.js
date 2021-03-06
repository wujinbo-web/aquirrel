// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import { getRouterData } from './utils/utils';
import { asideMenuConfig } from './menuConfig';

import BasicLayout from './layouts/BasicLayout';
import UserLayout from './layouts/UserLayout';
import UserLogin from './pages/UserLogin';
// import Dashboard from './pages/Dashboard';
import ServerError from './pages/ServerError';
import Forbidden from './pages/Forbidden';
import Empty from './pages/Empty';
import Home from './pages/Home';
import CustomerInfo from './pages/CustomerInfo';
import CustomerInfo2 from './pages/CustomerInfo2';
import CustomerAdd from './pages/CustomerAdd';
import PersonnelAdd from './pages/PersonnelAdd';
import DepartmentAdd from './pages/DepartmentAdd';
import DepartmentInfo from './pages/DepartmentInfo';
import PersonnelInfo from './pages/PersonnelInfo';
import Orderadd from './pages/Orderadd';
import FinanceInfo from './pages/FinanceInfo';
import OrderInfo from './pages/OrderInfo';
import DesignInfo from './pages/DesignInfo';
import DesignMeasure from './pages/DesignMeasure';
import DesignInfo2 from './pages/DesignInfo2';
import DesignAddDraw from './pages/DesignAddDraw';
import ProducInfo from './pages/ProducInfo';
import ProducList from './pages/ProducList';
import ProjectPutIn from './pages/ProjectPutIn';
import ProjectPutout from './pages/ProjectPutout';
import ProjectPreinstall from './pages/ProjectPreinstall';
import ProjectPrefinish from './pages/ProjectPrefinish';
import GoodsTypeInfo from './pages/GoodsTypeInfo';
import GoodsTypeAdd from './pages/GoodsTypeAdd';
import MessageAdd from './pages/MessageAdd';
import ProjectList from './pages/ProjectList';
import ProducMaterialAdd from './pages/ProducMaterialAdd';
import ProjectList2 from './pages/ProjectList2';
import ProjectList3 from './pages/ProjectList3';
import MessageInfo from './pages/MessageInfo';
import FinanceList from './pages/FinanceList';
import OrderDetail from './pages/OrderDetail';
import OrderDetail2 from './pages/OrderDetail2';
import ProducMaterialManage from './pages/ProducMaterialManage';
import DesignAddList from './pages/DesignAddList';
import DesignAddDetail from './pages/DesignAddDetail';
import ProducMaterialList from './pages/ProducMaterialList';
import OrderAddList from './pages/OrderAddList';
import DesignFloor from './pages/DesignFloor';
import DesignFloorMeasure from './pages/DesignFloorMeasure';
import DesignKailiao from './pages/DesignKailiao';
import DesignKailiaoList from './pages/DesignKailiaoList';
import DesignGeneralList from './pages/DesignGeneralList';
import DesignAddGeneral from './pages/DesignAddGeneral';
import DesignEditGeneral from './pages/DesignEditGeneral';
import PurchaseList from './pages/PurchaseList';
import PurchasePutIn from './pages/PurchasePutIn';
import FinanceExamine from './pages/FinanceExamine';
import ProducUseMaterials from './pages/ProducUseMaterials';
import PurchaseType from './pages/PurchaseType';
import ProudcPutin from './pages/ProudcPutin';
import ProducPutout from './pages/ProducPutout';
import ProducList2 from './pages/ProducList2';
import ProducList3 from './pages/ProducList3';
import OrderSearchKailiao from './pages/OrderSearchKailiao';
import ProducKuCun from './pages/ProducKuCun';
import FinanceDetail from './pages/FinanceDetail';
import NotFound from './pages/NotFound';
import FinanceInvoicingList from './pages/FinanceInvoicingList';
import PurchaseTotall from './pages/PurchaseTotall';
import LeavingMessage from './pages/LeavingMessage';
import InvoicingManage from './pages/InvoicingManage';
import OrderInfoDetail from './pages/OrderInfoDetail';

/*2019-1-26新增*/
import KailiaoTemplate from './pages/KailiaoTemplate';
import KailiaoTemplateEdit from './pages/KailiaoTemplateEdit';
import KailiaoTemplateEditDetail from './pages/KailiaoTemplateEditDetail';

/*2019-2-28新增*/
import ApplicationLackGoods from './pages/ApplicationLackGoods';
import DealLackGoods from './pages/DealLackGoods';

/*2019-4-1新增*/
import GoodsTypeManage from './pages/GoodsTypeManage';
import GoodsSeriesMangage from './pages/GoodsSeriesMangage';
import Wysiwyg from './pages/Wysiwyg';
import MessageItem from './pages/MessageItem';
import MessageInfoSend from './pages/MessageInfoSend';

/*4.9新增 */
import PurchaseType2 from './pages/PurchaseType2';


const routerConfig = [
  {
    path: '/purchase/type2',
    layout: BasicLayout,
    component: PurchaseType2,
  },
  {
    path: '/messageinfo/send',
    layout: BasicLayout,
    component: MessageInfoSend,
  },
  {
    path: '/goods2/typeinfo',
    layout: BasicLayout,
    component: GoodsTypeInfo,
  },
  {
    path: '/goodtype/manage',
    layout: BasicLayout,
    component: GoodsTypeManage,
  },
  {
    path: '/message/add',
    layout: BasicLayout,
    component: MessageAdd,
  },
  {
    path: '/goods/typeadd',
    layout: BasicLayout,
    component: GoodsTypeAdd,
  },
  {
    path: '/exception/500',
    component: ServerError,
    layout: BasicLayout,
  },
  {
    path: '/exception/204',
    component: Empty,
    layout: BasicLayout,
  },
  {
    path: '/user/login',
    component: UserLogin,
    layout: UserLayout,
  },
  /*2019-2-28新增*/
  {
    path: '/application/lackgoods',
    component: ApplicationLackGoods,
    layout: BasicLayout,
  },
  {
    path: '/deal/lackgoods',
    component: DealLackGoods,
    layout: BasicLayout,
  },
  /*2019-1-26新增*/
  {
    path: '/desgin/tempalte',
    component: KailiaoTemplate,
    layout: BasicLayout,
  },
  {
    path: '/desgin/tempalteedit',
    component: KailiaoTemplateEdit,
    layout: BasicLayout,
  },
  {
    path: '/desgin/tempalteeditdetail',
    component: KailiaoTemplateEditDetail,
    layout: BasicLayout,
  },
  //自己新增的
  //首页
  {
    path: '/home',
    layout: BasicLayout,
    component: Home,
  },
  {
    path: '/orderinfo/detail',
    layout: BasicLayout,
    component: OrderInfoDetail,
  },

  //人员添加
  {
    path: '/personnel/add',
    layout: BasicLayout,
    component: PersonnelAdd,
  },
  {
    path: '/personnel2/add',
    layout: BasicLayout,
    component: PersonnelAdd,
  },
  //客户列表
  {
    path: '/customer/info',
    layout: BasicLayout,
    component: CustomerInfo,
  },
  {
    path: '/customer2/info',
    layout: BasicLayout,
    component: CustomerInfo2,
  },
  //客户添加
  {
    path: '/customer/add',
    layout: BasicLayout,
    component: CustomerAdd,
  },
  {
    path: '/customer2/add',
    layout: BasicLayout,
    component: CustomerAdd,
  },
  //部门添加
  {
    path: '/department/add',
    layout: BasicLayout,
    component: DepartmentAdd,
  },
  {
    path: '/department2/add',
    layout: BasicLayout,
    component: DepartmentAdd,
  },
  //部门列表
  {
    path: '/department/info',
    layout: BasicLayout,
    component: DepartmentInfo,
  },
  {
    path: '/department2/info',
    layout: BasicLayout,
    component: DepartmentInfo,
  },
  //订单添加
  {
    path: '/order/add',
    layout: BasicLayout,
    component: Orderadd,
  },
  {
    path: '/order2/add',
    layout: BasicLayout,
    component: Orderadd,
  },
  //订单列表
  {
    path: '/order/info',
    layout: BasicLayout,
    component: OrderInfo,
  },
  //财务列表
  {
    path: '/finance/info',
    layout: BasicLayout,
    component: FinanceInfo,
  },
  {
    path: '/finance2/info',
    layout: BasicLayout,
    component: FinanceInfo,
  },
  //待测量列表
  {
    path: '/design/info',
    layout: BasicLayout,
    component: DesignInfo,
  },
  {
    path: '/design2/info',
    layout: BasicLayout,
    component: DesignInfo,
  },
  {
    path: '/design3/info',
    layout: BasicLayout,
    component: DesignInfo,
  },
  {
    path: '/design2/info',
    layout: BasicLayout,
    component: DesignInfo,
  },

  //部门列表
  {
    path: '/personnel/info',
    layout: BasicLayout,
    component: PersonnelInfo,
  },
  {
    path: '/personnel2/info',
    layout: BasicLayout,
    component: PersonnelInfo,
  },
  //待设计列表
  {
    path: '/design/measure',
    layout: BasicLayout,
    component: DesignMeasure,
  },
  {
    path: '/design/info2',
    layout: BasicLayout,
    component: DesignInfo2,
  },
  {
    path: '/design/adddraw',
    layout: BasicLayout,
    component: DesignAddDraw,
  },
  //待生产列表
  {
    path: '/produc/info',
    layout: BasicLayout,
    component: ProducInfo,
  },
  {
    path: '/produc2/info',
    layout: BasicLayout,
    component: ProducInfo,
  },
  //添加材料
  {
    path: '/produc/materialadd',
    layout: BasicLayout,
    component: ProducMaterialAdd,
  },
  //待入库订单
  {
    path: '/project/putin',
    layout: BasicLayout,
    component: ProjectPutIn,
  },
  //待出库订单
  {
    path: '/project/putout',
    layout: BasicLayout,
    component: ProjectPutout,
  },
  {
    path: '/project2/putout',
    layout: BasicLayout,
    component: ProjectPutout,
  },
  //待安装订单
  {
    path: '/project/preinstall',
    layout: BasicLayout,
    component: ProjectPreinstall,
  },
  {
    path: '/project2/preinstall',
    layout: BasicLayout,
    component: ProjectPreinstall,
  },
  //增项订单
  {
    path: '/project/prefinish',
    layout: BasicLayout,
    component: ProjectPrefinish,
  },
  {
    path: '/project2/prefinish',
    layout: BasicLayout,
    component: ProjectPrefinish,
  },
  {
    path: '/goods/typeinfo',
    layout: BasicLayout,
    component: GoodsTypeInfo,
  },
  //2019.4.2
  {
    path: '/goodsseried/manage',
    layout: BasicLayout,
    component: GoodsSeriesMangage,
  },
  /*公共页面*/
  {
    path: '/exception/403',
    component: Forbidden,
    layout: BasicLayout,
  },
  {
    path: '/exception/404',
    component: NotFound,
    layout: BasicLayout,
  },
  {
    path: '/goods2/typeadd',
    layout: BasicLayout,
    component: GoodsTypeAdd,
  },
  {
    path: '/project/list',
    layout: BasicLayout,
    component: ProjectList,
  },
  {
    path: '/project/list2',
    layout: BasicLayout,
    component: ProjectList2,
  },
  {
    path: '/project/list3',
    layout: BasicLayout,
    component: ProjectList3,
  },
  {
    path: '/message/info',
    layout: BasicLayout,
    component: MessageInfo,
  },
  {
    path: '/finance/list',
    layout: BasicLayout,
    component: FinanceList,
  },
  {
    path: '/order/detail',
    layout: BasicLayout,
    component: OrderDetail,
  },
  {
    path: '/orderDetail',
    layout: BasicLayout,
    component: OrderDetail2,
  },
  {
    path: '/produc/materialmanage',
    layout: BasicLayout,
    component: ProducMaterialManage,
  },
  {
    path: '/design/addlist',
    layout: BasicLayout,
    component: DesignAddList,
  },
  {
    path: '/design/adddetail',
    layout: BasicLayout,
    component: DesignAddDetail,
  },
  {
    path: '/produc/materiallist',
    layout: BasicLayout,
    component: ProducMaterialList,
  },
  {
    path: '/order/addlist',
    layout: BasicLayout,
    component: OrderAddList,
  },
  {
    path: '/design/floor',
    layout: BasicLayout,
    component: DesignFloor,
  },
  {
    path: '/design/floormeasure',
    layout: BasicLayout,
    component: DesignFloorMeasure,
  },
  {
    path: '/desgin/lailiao',
    layout: BasicLayout,
    component: DesignKailiao,
  },
  {
    path: '/desgin/kailiaolist',
    layout: BasicLayout,
    component: DesignKailiaoList,
  },
  {
    path: '/design/generallist',
    layout: BasicLayout,
    component: DesignGeneralList,
  },
  {
    path: '/design2/generallist',
    layout: BasicLayout,
    component: DesignGeneralList,
  },
  {
    path: '/design/addgeneral',
    layout: BasicLayout,
    component: DesignAddGeneral,
  },
  {
    path: '/design/editgeneral',
    layout: BasicLayout,
    component: DesignEditGeneral,
  },
  {
    path: '/purchase/list',
    layout: BasicLayout,
    component: PurchaseList,
  },
  {
    path: '/purchase2/list',
    layout: BasicLayout,
    component: PurchaseList,
  },
  {
    path: '/purchase/putin',
    layout: BasicLayout,
    component: PurchasePutIn,
  },
  {
    path: '/purchase2/putin',
    layout: BasicLayout,
    component: PurchasePutIn,
  },
  {
    path: '/finance/examine',
    layout: BasicLayout,
    component: FinanceExamine,
  },
  {
    path: '/finance2/examine',
    layout: BasicLayout,
    component: FinanceExamine,
  },
  {
    path: '/produc/usematerials',
    layout: BasicLayout,
    component: ProducUseMaterials,
  },
  {
    path: '/produc2/usematerials',
    layout: BasicLayout,
    component: ProducUseMaterials,
  },
  {
    path: '/purchase/type',
    layout: BasicLayout,
    component: PurchaseType,
  },
  {
    path: '/purchase2/type',
    layout: BasicLayout,
    component: PurchaseType,
  },
  {
    path: '/produc/putin',
    layout: BasicLayout,
    component: ProudcPutin,
  },
  {
    path: '/produc2/putin',
    layout: BasicLayout,
    component: ProudcPutin,
  },
  {
    path: '/produc/putout',
    layout: BasicLayout,
    component: ProducPutout,
  },
  {
    path: '/produc2/putout',
    layout: BasicLayout,
    component: ProducPutout,
  },
  {
    path: '/produc/list',
    layout: BasicLayout,
    component: ProducList,
  },
  {
    path: '/produc/list2',
    layout: BasicLayout,
    component: ProducList2,
  },
  {
    path: '/produc/list3',
    layout: BasicLayout,
    component: ProducList3,
  },
  {
    path: '/order/searchkailiao',
    layout: BasicLayout,
    component: OrderSearchKailiao,
  },
  {
    path: '/produc/kucun',
    layout: BasicLayout,
    component: ProducKuCun,
  },
  {
    path: '/produc2/kucun',
    layout: BasicLayout,
    component: ProducKuCun,
  },
  {
    path: '/finance/detail',
    layout: BasicLayout,
    component: FinanceDetail,
  },
  {
    path: '/finance/invoicing',
    layout: BasicLayout,
    component: InvoicingManage,
  },
  {
    path: '/finance/invoicinglist',
    layout: BasicLayout,
    component: FinanceInvoicingList,
  },
  {
    path: '/purchase/totall',
    layout: BasicLayout,
    component: PurchaseTotall,
  },
  {
    path: '/leaving/message',
    layout: BasicLayout,
    component: LeavingMessage,
  },
  {
    path: '/wysiwyg',
    layout: BasicLayout,
    component: Wysiwyg,
  },
  {
    path: '/message/item',
    layout: BasicLayout,
    component: MessageItem,
  },
];

const routerData = getRouterData(routerConfig, asideMenuConfig);

export { routerData };
