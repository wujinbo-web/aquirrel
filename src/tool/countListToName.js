export default (key) => {
  if(key == "name"){
    return "名称";
  } else if (key == "size"){
    return "规格";
  } else if (key == "remarks"){
     return "备注";
  }else if (key == "heji"){
     return "合计";
  }else if (key == "count"){
     return "开料数";
  }else if (key == "unproNum"){
     return "待生产";
  }else if (key == "proNum"){
     return "已生产";
  }else if (key == "dputNum"){
     return "入库数";
  }else if (key == "doutNum"){
     return "出库数";
  }else if (key == "jputNum"){
     return "入货数";
  }else if (key == "joutNum"){
     return "出货数";
  }else if (key == "installNum"){
     return "安装数";
  }else if (key == "uninstallNum"){
     return "待安装";
  } else{
    return key
  }
}
