import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Input, Table, Button, Dialog, Form, Field, Feedback } from '@icedesign/base';
import axios from 'axios';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { getDesignQueryByOrderIdFloor, getDesignAddRoom, getDesignUpdateRoom, getDesignDeleteRoom, getDesignFindFloor, postMeasureExcel } from '@/api';
import { API_URL } from '@/config'
import { postUrl } from '@/api';
import { deleteColumn, addColumn } from '@/api/apiUrl';
import AddGoods from './components/AddGoods';


const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class TabTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      visible: false,
      FloorNum: [""], //存储楼层的数组
      headData:[],
      dataRmarks: this.props.remark,
    };
    this.field = new Field(this);
  }

  componentDidMount() {
    this.getIndexData();
  }

  //获取首页数据
  getIndexData = async () => {
    const data = await getDesignQueryByOrderIdFloor(this.props.id, this.props.floorNumId);

    //获取导航头数据
    let headData=data.data.room.map((item1)=>{   //101,102
        let itemData={};
        data.data[item1].forEach((item2)=>{  //{id:"7",name: "床",size: ""}
          itemData[item2.id]=item2.name;
        })
        return itemData;
    })
    // headData = [{7: "床", 8: "凳子", 9: "床头柜"....},{....}]
    let headData2 = [];
    for(let key in headData[0]){
      headData2.push({ title: headData[0][key], index: key });
    }
    console.log(headData2); //[{title:"床",index:"7"}]
    this.state.headData=headData2;
    //获取列表数据
    let bodyData=data.data.room.map((item1)=>{
      let itemData={roomNum:item1};
      data.data[item1].forEach((item2)=>{  //{id:"7",name: "床",size: ""}
        itemData[item2.id]=item2.size;
      })
      return itemData;
    })
    console.log(bodyData);//[{floorNum:"301",7:"",8:"",9:""...},{...}]
    this.state.dataSource=bodyData;

    this.setState({});
  }

  //渲染表格输入框
  renderName = (valueKey, value, index, record) => {
    return (
      <Input
        placeholder={"0"}
        style={{width:"100%"}}
        value={this.state.dataSource[index][valueKey]}
        onChange={this.changeTabelData.bind(this, index, record, valueKey)}
        onBlur={this.changeTabelDataApi.bind(this, index, record, valueKey)}
      />
    );
  }

  //渲染删除按钮
  renderOptions = (value, index, record) => {
    return (
      <DeleteBalloon handleRemove={() => this.handleRemove(index, record)}/>
    )
  }

  handleRemove = async (index, record) => {
    console.log(index, record);
    //orderId,floor,room
    const { id, floorNumId, floorNum } = this.props;
    try{
      const data = await getDesignDeleteRoom(id,floorNumId,record.roomNum);
      if(data.data.state=="success"){
        Toast.success(data.data.msg);
        this.state.dataSource.splice(index, 1);
        this.setState({});
      }else {
        Toast.error(data.data.msg);
      }
    }catch(err){
      Toast.error(err);
    }

  }

  //修改备注
  changeRemark = (value) => {
    this.state.dataRmarks = value;
    this.setState({});
  }

  changeReamrkApi = async () => {
    const { id, floorNumId, floorNum} = this.props;
    const {dataRmarks} = this.state;
    const data = await getDesignFindFloor(id,floorNum,floorNumId,1,dataRmarks);
    sessionStorage.design_floorRemark = dataRmarks;
  }

  changeTabelData = (index,record,valueKey,value) => {
    let { dataSource } = this.state;
    dataSource[index][valueKey]=value;
    this.setState({});
  }

  changeTabelDataApi = async (index,record,valueKey) => {
    //orderId,classId,floor,roomNum,size    110/ xxxx/ 2/201/100*100
    const { id, floorNumId, floorNum } = this.props;
    const data = await getDesignUpdateRoom(id,valueKey,floorNumId,record.roomNum,record[valueKey]);
    console.log(data);
  }

  //确认订单
  ensureOrder = async () => {
    //orderId,floorNum,id,type
    const { id, floorNumId, floorNum, remark } = this.props;
    try{
      const data = await getDesignFindFloor(id,floorNum,floorNumId,1,remark);
      if(data.data.state=="success"){
        Toast.success("确认成功");
        this.props.direction();
      }else{
        Toast.error(data.data.msg);
      }
    }catch(err){
      Toast.error(err);
    }
  }

  /*添加房间start*/

  onOpen = () => {
    this.setState({ visible: true });
  }

  onClose = () => {
    this.setState({ visible: false });
  }

  //提交添加房间api
  handleSubmit = async () => {

    let error = null;
    //循环判断是否有没填的
    this.state.FloorNum.forEach((item)=>{
      if(item==""){
        error=true;
        return false;
      }
    })
    //校验
    if(error){
      Toast.error("楼层号不能为空");
      return false;
    }
    const { id, floorNumId, floorNum } = this.props;
    let roomNum=this.state.FloorNum.join(',');
    //uuid:floorNumId, roomNum:roomNum  , orderId: id   floor:floorNum
    try{
      this.setState({ visible: false, FloorNum: [""] });
      const data = await getDesignAddRoom(floorNumId,roomNum,id,floorNum);
      this.getIndexData();
    }catch(error){
      Toast.error(error);
    }

  };

  addRoomNum = () => {
    this.state.FloorNum.push("");
    console.log(this.state.FloorNum);
    this.setState({});

  }

  changeData = (value,index) => {
    this.state.FloorNum[index]=value;
    this.setState({})
  }

  reduceRoomNum = (index) =>{
    console.log(index);
    this.state.FloorNum.splice(index,1);
    this.setState({});
  }
  /*添加房间end*/

  //下载excel表格
  installExcel = async () => {
    const { id, floorNumId, floorNum } = this.props;
    window.location.href=`${API_URL}/measureExcel.do?orderId=${id}&floor=${floorNumId}&floorNum=${floorNum}`;
  }

  //渲染表头
  renderTitle = (title, index) => {
    return(
      <span>
        {title}
        <DeleteBalloon handleRemove={()=>this.handleDeleteColumn(title,index)} />
      </span>
    )
  }

  //添加产品
  addGoodsName = async (id,name) => {
    //商品IDid  商品名 name
    //this.props.id 订单id    this.props.floorNumId 楼层id  this.props.floorNum 楼层数
    let params = {
      "measure.orderId": this.props.id ,
      "measure.orderFloorId": this.props.floorNumId,
      "measure.classId": id,
      "measure.name": name,
      "measure.floor": this.props.floorNum,
    };
    let response = await postUrl(addColumn,params);
    if(response.data.state=="success"){
      Toast.success("添加成功")
      this.getIndexData();
    }else{
      Toast.error(response.data.msg);
    }
  }

  //删除列
  handleDeleteColumn = async (title, index) => {
    //this.props.id  订单ID  this.props.floorNumId 楼层号ID  title  列明
    let response = await postUrl(deleteColumn,{
      orderId: this.props.id,
      floor: this.props.floorNumId,
      name: title,
    });
    if(response.data.state=="success"){
      this.state.headData.splice(index,1);
      this.setState({});
    }else{
      Toast.error(response.data.msg);
    }
  }

  render() {
    const { dataSource, headData, dataRmarks } = this.state;
    const { id, floorNumId, floorNum } = this.props;
    const init = this.field.init;
    const formItemLayout = {
     labelCol: {
       fixedSpan: 6
     },
     wrapperCol: {
       span: 14
     }
    };
    const styles = {
     formInput: {
       width:"50px",
       marginLeft:"3px",
       marginBottom: "3px"
     }
   }
    return (
      <div className="tab-table">
        <IceContainer>
          <h1 style={{ textAlign: "center" }}>{floorNum}楼测量单</h1>
          <h2 style={{ fontSize: "14px", color: "rgb(32, 119, 255)" }}>
            当前订单ID: {id}
            <span style={{ float: "right" }}>
              <Button size='small' type='primary' onClick={this.onOpen}>添加房间</Button>
            </span>
            <AddGoods getFormValues={this.addGoodsName} />
          </h2>

          <Dialog
             visible={this.state.visible}
             onOk={this.handleSubmit}
             onCancel={this.onClose}
             onClose={this.onClose}
             style={{ width: "480px" }}
             title="添加房间"
           >
            房间号：
            <Button size="small"  style={{marginRight:"5px"}} onClick={this.addRoomNum} >+</Button>
            <br/>
            {
              this.state.FloorNum.map((item,index)=>{
                return (
                  <span key={index} style={{ marginTop: "5px", marginRight:"20px" }}>
                    <Input
                      value={this.state.FloorNum[index]}
                      style={styles.formInput}
                      onChange={(value)=>{this.changeData(value,index)}}
                      placeholder = {item}
                    />
                  {
                    index == 0 ? "" : <Button size="small" style={{marginLeft:"5px"}} onClick={()=>{this.reduceRoomNum(index)}}>-</Button>
                  }

                  </span>
                );
              })
            }

           </Dialog>

          <Table dataSource={dataSource}>
              <Table.Column title="房号" dataIndex="roomNum" width={70} lock />
              {
                headData.map((item, index)=>{
                  return(<Table.Column
                    key={item.index}
                    title={this.renderTitle.bind(this,item.title, index)}
                    dataIndex={item.index}
                    width={150}
                    cell={this.renderName.bind(this,item.index)}
                    />)
                })
              }
              <Table.Column
                title="操作"
                dataIndex="time"
                width={90}
                lock="right"
                cell={this.renderOptions.bind(this)}
              />
          </Table>
          {
            dataSource.length==0?"":(<div style={{ border: "1px solid #eee", color:"#999",padding: "3px 10px" }}>
              备注：
              <Input
                value={dataRmarks}
                style={{ width: "100%" }}
                onChange={this.changeRemark}
                onBlur={this.changeReamrkApi}
              />
          </div>)
          }

          <Button
            size='small'
            type='primary'
            style={{ marginTop: "5px" }}
            onClick={this.ensureOrder}
          >确认测量单</Button>
        <Button onClick={this.props.direction} style={{ marginLeft: "5px" }}>返回</Button>
        <Button onClick={this.installExcel} style={{ marginLeft: "5px" }}> 下载表格</Button>
        </IceContainer>
      </div>
    );
  }
}
