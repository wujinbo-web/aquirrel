//请求接口统一管理
import axios from 'axios';
import { API_URL } from './../config';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

export async function postUrl(url,params){
  return axios({
    url: `${API_URL}/${url}`,
    method: 'post',
    data: qs(params),
  });
}

//查询开料单接口
export async function deleteInOutList(params) {
  return axios({
    url: `${API_URL}/deleteMaterialsRecord.do`,
    method: 'post',
    data: qs(params),
  });
}

//查询开料单接口
export async function queryLog(params) {
  return axios({
    url: `${API_URL}/queryLog.do`,
    method: 'post',
    data: qs(params),
  });
}

//查询开料单接口
export async function queryKailiaoCount(params) {
  return axios({
    url: `${API_URL}/totalByTime.do`,
    method: 'post',
    data: qs(params),
  });
}

//修改订单的状态
export async function updateOrderState(params) {
  return axios({
    url: `${API_URL}/updateOrderMaterialsRecord.do`,
    method: 'post',
    data: qs(params),
  });
}

//查询材料分类
export async function queryMaterialsTypeList(params) {
  return axios({
    url: `${API_URL}/qureyMaterialsClassBy.do`,
    method: 'post',
    data: qs(params),
  });
}

//添加材料分类
export async function saveMaterialsTypeList(params) {
  return axios({
    url: `${API_URL}/saveMaterialsClass.do`,
    method: 'post',
    data: qs(params),
  });
}

//删除材料分类
export async function deleteMaterialsTypeList(params) {
  return axios({
    url: `${API_URL}/deleteMaterialsClass.do`,
    method: 'post',
    data: qs(params),
  });
}

//修改材料分类
export async function updateMaterialsTypeList(params) {
  return axios({
    url: `${API_URL}/updateMaterialsClass.do`,
    method: 'post',
    data: qs(params),
  });
}

//查询总进度表
export async function queryCountList(params) {
  return axios({
    url: `${API_URL}/totalData.do`,
    method: 'post',
    data: qs(params),
  });
}

//修改进货单状态
export async function upDateInOutMaterialsState(params) {
  return axios({
    url: `${API_URL}/updateMaterialsRecordType.do`,
    method: 'post',
    data: qs(params),
  });
}

//查找进出材料记录
export async function queryInOutMaterials(params) {
  return axios({
    url: `${API_URL}/qureyMaterialsRecordBy.do`,
    method: 'post',
    data: qs(params),
  });
}

//进出料记录详情
export async function queryInOutMaterialsDetail(params) {
  return axios({
    url: `${API_URL}/qureyMaterialsBy.do`,
    method: 'post',
    data: qs(params),
  });
}


//获取uuid
export async function getUuid() {
  return axios({
    url: `${API_URL}/uuid.do`,
    method: 'post',
  });
}

//添加材料记录
export async function postAddRecord(params) {
  return axios({
    url: `${API_URL}/saveMaterialsRecord.do`,
    method: 'post',
    data: qs(params),
  });
}


//查询材料库
export async function postQueryMaterials(params) {
  return axios({
    url: `${API_URL}/qureyMaterialsMainBy.do`,
    method: 'post',
    data: qs(params),
  });
}

//添加材料库
export async function postAddMaterials(params) {
  return axios({
    url: `${API_URL}/saveMaterialsMain.do`,
    method: 'post',
    data: qs(params),
  });
}

//删除材料库
export async function postDeleteMaterials(params) {
  return axios({
    url: `${API_URL}/deleteMaterialsMain.do`,
    method: 'post',
    data: qs(params),
  });
}

//修改材料库
export async function postUpdateMaterials(params) {
  return axios({
    url: `${API_URL}/updateMaterialsMain.do`,
    method: 'post',
    data: qs(params),
  });
}

//填写总单接口
export async function postAddGeneral(params) {
  return axios({
    url: `${API_URL}/updateText.do`,
    method: 'post',
    data: qs(params),
  });
}


//下载测量excel
export async function postMeasureExcel(params) {
  return axios({
    url: `${API_URL}/measureExcel.do`,
    method: 'post',
    data: qs(params),
  });
}

//获取商品列表
export async function getGoodsType() {
  return axios({
    url: `${API_URL}/findProductClassByName.do?pageSize=20`,
    method: 'get',
  });
}

export async function login(params) {   //请求登陆接口
  return axios({
    url: '/api/login',
    method: 'post',
    data: params,
  });
}

export async function postUserRegister(params) {
  return axios({
    url: '/api/register',
    method: 'post',
    data: params,
  });
}

export async function postUserLogout() {
  return axios({
    url: `${API_URL}/webLogout.do`,
    method: 'post',
  });
}

export async function getUserProfile() {
  return axios('/api/profile');
}

//设计部门,添加楼层接口
export async function getDesignAddFloor(id, num){
  return axios({
    url: `${API_URL}/saveOrderFloor.do?orderFloor.orderId=${id}&orderFloor.floorNum=${num}`,
    method: 'get',
  });
}

//设计部门,查询楼层接口
export async function postDesignFindFloor(id){
  return axios({
    url: `${API_URL}/findOneOrderFloor.do?id=${id}`,
    method: 'get',
  });
}

//设计部门,更改楼层单状态接口
export async function getDesignFindFloor(orderId,floorNum,id,type,remark){
  return axios({
    url: `${API_URL}/updateOrderFloor.do?orderFloor.orderId=${orderId}&orderFloor.floorNum=${floorNum}&orderFloor.id=${id}&orderFloor.type=${type}&orderFloor.remark=${remark}`,
    method: 'get',
  });
}

//查看楼层订单
export async function getDesignQueryByOrderIdFloor(orderId,floorNumId){
  return axios({
    url: `${API_URL}/queryByOrderIdFloor.do?orderId=${orderId}&floor=${floorNumId}`,
    method: 'get',
  });
}

//添加房间api
export async function getDesignAddRoom(floorNumId,roomNum,id,floorNum){
  return axios({
    url: `${API_URL}/saveByFloorClass.do?uuid=${floorNumId}&roomNum=${roomNum}&orderId=${id}&floor=${floorNum}`,
    method: 'get',
  });
}

//修改房间信息api
export async function getDesignUpdateRoom(orderId,classId,floor,roomNum,size){
  return axios({
    url: `${API_URL}/updateMeasureN.do?orderId=${orderId}&classId=${classId}&floor=${floor}&roomNum=${roomNum}&size=${size}`,
    method: 'get',
  });
}



//删除房间信息api
export async function getDesignDeleteRoom(orderId,floor,room){
  return axios({
    url: `${API_URL}/deleteByOrderIdFR.do?orderId=${orderId}&floor=${floor}&room=${room}`,
    method: 'get',
  });
}

//获取开料记录单
export async function postkaiLiaojilu(params){
  return axios({
    url: `${API_URL}/qureyOmdByOId.do`,
    method: "post",
    data: qs(params),
  });
}

//添加开料记录
export async function postAddMaterialsRecord(params){
  return axios({
    url:`${API_URL}/saveOrderMaterialsRecord.do`,
    method: "post",
    data: qs(params),
  });
}

//修改开料记录
export async function postUpdataMaterialsRecord(params){
  return axios({
    url:`${API_URL}/updateOrderMaterialsRecord.do`,
    method: "post",
    data: qs(params),
  });
}

//查询开料单
export async function postQueryKailiao(params){
  return axios({
    url:`${API_URL}/queryOrderMaterialsBymcId.do`,
    method: "post",
    data: qs(params),
  });
}

//修改开料单
export async function postUpdateKailiao(params,key){
  return axios({
    url:`${API_URL}/updateM${key}.do`,
    method: "post",
    data: qs(params),
  })
}

//修改开料记录单

export async function postUpdateKaiList(params,key){
  return axios({
    url:`${API_URL}/updateMr${key}.do`,
    method: "post",
    data: qs(params),
  })
}

//删除开料单
export async function postDeleteKailiao(params){
  return axios({
    url:`${API_URL}/deleteOrderMaterials.do`,
    method: "post",
    data:qs(params),
  })
}

//添加部件
export async function postAddAparts(params){
  return axios({
    url:`${API_URL}/saveOrderMaterials.do`,
    method: "post",
    data:qs(params),
  })
}

//修改开料记录状态
export async function postUpdateState(params){
  return axios({
    url:`${API_URL}/updateOmdState.do`,
    method: "post",
    data:qs(params),
  })
}


//解析json数据
function qs(params){
  let arr=[];
  for(let key in params){
    arr.push(`${key}=${params[key]}`);
  }
  return arr.join("&");
}

export default {
  postUserRegister,
  postUserLogout,
  getUserProfile,
};
