export default (orderStatus) => {
  switch (orderStatus) {
    case 1:
      return "建立合同订单";
    case 12:
      return "建立合同订单";
    case 2:
      return "总单填写（完成）";
    case 3:
      return "测量完成";
    case 4:
      return "设计完成";
    case 5:
      return "生产完成";
    case 6:
      return "生产部入库完成";
    case 7:
      return "生产部出库完成";
    case 8:
      return "工程部入货完成";
    case 9:
      return "工程部出货完成";
    case 10:
      return "安装完成增项中";
    case 11:
      return "完成订单";
    default:
      return "状态出错2";
  }
}
