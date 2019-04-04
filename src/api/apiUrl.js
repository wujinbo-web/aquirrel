//查询财务详情
export const financeDetailQuery = "queryDmByPid.do";
//删除财务详情
export const financeDetailDelete = "deleteDetailMoney.do";
//添加财务详情
export const financeDetailAdd = "saveDetailMoney.do";
//查询财务记录
export const financeListQuery = "queryOrderMoneyById.do";
//查询财务开票列表
export const invoiceListQuery = "queryInvoiceByOrderId.do";
//添加开票公司
export const invoiceCompanyAdd = "saveCompany.do";
//查找开票公司
export const invoiceCompanyQuery = "queryCompany.do";
//修改开票公司
export const invoiceCompanyUpdate = "updateCompany.do";
//删除开票公司
export const invoiceCompanyDelete = "deleteCompany.do";
//添加发票
export const invoiceAdd = "saveInvoice.do";
//删除发票
export const invoiceDelete = "deleteInvoice.do";
//编辑发票
export const invoiceUpdate = "updateInvoice.do";
//查询客户开票公司名、税号
export const customsQuery = "findCustomerList.do";

//查询进货统计金额
export const materialsTotal = "queryMaterialsClassTotalPrice.do";

//查询进货统计金额
export const leavingMessageQuery = "queryLeaveWord.do";
//查询进货统计金额
export const leavingMessageType = "updateLeaveWord.do";
//查询进货统计金额
export const leavingMessageDelete = "deleteLeaveWord.do";

//查看订单详情
export const orderQuery = "findOrder.do";

//智能开料 添加模板
export const templateAdd = "saveTemplate.do";
//智能开料 删除模板
export const templateDelete = "deleteTemplate.do";
//智能开料 查询模板其他规格
export const otherSizeQuery = "querySpecByTid.do";
//智能开料 查询模板部件详情
export const partDetailQuery = "queryPartsByTid.do";
//智能开料 修改模板其他规格
export const otherSizeUpdate = "updateSpec.do";
//智能开料 修改模板部件
export const templatePartUpdate = "updateParts.do";
//智能开料 新增模板规格
export const otherSizeAdd = "saveSpec.do";
//智能开料 新增模板部件
export const templatePartAdd = "saveParts.do";

//智能开料 删除模板部件
export const templatePartDelete = "deleteParts.do";
//智能开料 删除模板规格
export const otherSizeDelete = "deleteSpec.do";
//智能开料 查询模板
export const templateQuery = "queryTemplateById.do";
//智能开料 查询模板 分页
export const templateListQuery = "queryTemplateBy.do";
//智能开料 修改部件属性
export const departUpdate = "updateOrderMaterials.do";
//智能开料 修改模板名称
export const templateNameUpdate = "updateTemplate.do";

//消息模块  未读改已读
export const updateUnread = 'updateUnread.do';
//消息模块  删除消息
export const deleteMessage = 'deleteOneMessage.do';
//消息模块 查询发送的消息
export const querySendMessage = 'fingSendMessage.do';
//消息模块 查询未读的消息
export const queryUnreadMessage = 'fingUnreadMessage.do';


//添加缺货申请
export const addLackGoods = 'saveUrgentService.do';
//查询缺货申请
export const queryLackGoods = 'findUrgentServiceBySearch.do';
//删除申请
export const deleteAplication = 'deleteUrgentService.do';
//处理申请
export const dealAplication = 'updateUrgentService.do';

export const deleteKaiLiao = 'updateOrderMaterialsRecord.do';


//商品管理 添加商品
export const addGoods = 'saveProductClass.do';
//商品管理 查询商品
export const queryGoods = 'findProductClassByName.do';
//商品管理 删除商品
export const deleteGoods = 'deleteProductClass.do';
//商品管理 更新商品
export const updateGoods = 'updateProductClass.do';


//类别管理 查询
export const queryGoodsType = 'queryPcClassBy.do';
//类别管理 添加
export const addGoodsType = 'savePcClass.do';
//类别管理 修改
export const updateGoodsType = 'updatePcClass.do';
//类别管理 删除
export const deleteGoodsType = 'deletePcClass.do';

//系列管理 查询
export const queryGoodsSeries = 'queryPcDeptBy.do';
//系列管理 添加
export const addGoodsSeries = 'savePcDept.do';
//系列管理 修改
export const updateGoodsSeries = 'updatePcDept.do';
//系列管理 删除
export const deleteGoodsSeries = 'deletePcDept.do';

//测量 删除列
export const deleteColumn = 'deleteByName.do';
//测量 新增列
export const addColumn = 'saveByName.do';


//消息 用户列表
export const userList = 'findCmsUserBySearch.do';
