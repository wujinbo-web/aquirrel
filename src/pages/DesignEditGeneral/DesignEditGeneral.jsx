import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Table, Dialog, Input, Select, Feedback } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import axios from 'axios';
import { API_URL } from '../../config';
import DeleteBalloon from './component/DeleteBalloon';
import { postAddGeneral, postUrl  } from '@/api';
import { orderQuery } from '@/api/apiUrl';

const Toast = Feedback.toast;

export default class DesignEditGeneral extends Component {
  static displayName = 'DesignEditGeneral';

  constructor(props) {
    super(props);
    this.state = {
      goodsData: [], //商品下拉
      addFloorVisible: false,
      drawingAddress: '',  //设计图地址
      fileAddress: '', //合同地址
      id: '',
      text:'',  //表格数据
      dataSource: [
        {
          classId: "",
          name: "",
          size:"",
          remarks:""
        }
      ],
      columns:[],
    };
  }



  componentDidMount = () => {
    let id = this.props.history.location.search.split('=')[1]
    //获取订单数据
    this.getIndexData(id);
    //获取客户数据
    this.getGoodsData();
  }

  //获取订单数据
  getIndexData = async (id) => {
    const response = await postUrl(orderQuery,{id});
    let data = response.data.data[0].order;
    //data.drawingAddress data.fileAddress data.text
    let drawingAddress=data.drawingAddress;
    let fileAddress=data.fileAddress;
    let text=data.text;
    let orderId=data.id;
    //{"classId":23,"name":"全季3.5卫生间门套","size":"50","remarks":"","1F":"1"}_{"classId":22,"name":"全季3.5进户门","size":"50","remarks":"","1F":"2"}_{"classId":23,"name":"全季3.5卫生间门套","size":"40","remarks":"","1F":"3"}
    let dataSource = this.stringToArray(text);
    let columns = [];
    for( var key in dataSource[0] ){
      if(key!='classId'&&key!='name'&&key!='size'&&key!='remarks'){
        columns.push({ title: key });
      }
    }
    this.setState({drawingAddress,fileAddress,text,id:orderId,dataSource,columns});
  }

  stringToArray = (str) => {
    let arr = str.split('_').map((item,index)=>{
      console.log(item);
      return JSON.parse(item);
    })
    return arr;
  }

  //获取客户数据
  getGoodsData = () => {
    axios
      .get(`${API_URL}/findProductClassByName.do?pageSize=100`)
      .then((response)=>{
        let goodsData = response.data.data.map((item)=>{
          return({label:item.name,value:item.id})
        })
        this.setState({ goodsData });
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  /*表格start*/
  //添加楼层
  addFloor = () => {
    let floor = this.state.num+"F";
    this.state.columns.forEach((item)=>{
      if(item.title == floor){
        floor=false;
        return
      }
    })
    if(floor){
      this.state.columns.push({title: floor});
      this.state.dataSource.forEach((item,index)=>{
        this.state.dataSource[index][floor]=0;
      })
      this.setState({
        addFloorVisible: false
      });
    }else{
      Toast.error("楼层添加重复");
    }
  }

  //删除楼层
  deleteFloor = (title) => {
    this.state.dataSource.forEach((item,index)=>{
      delete this.state.dataSource[index][title];
    })
    this.setState({});
    this.state.columns.forEach((item,index)=>{
      if(item.title==title){
        this.state.columns.splice(index,1);
      }
    })
    this.setState({});
  }

  //添加商品项
  addItem = () => {
    let key;
    let data={};
    for( key in this.state.dataSource[0] ){
      if(key=="name"||key=="size"||key=="remarks"){
        data[key]="";
      }else{
        data[key]=0;
      }
    }
    this.state.dataSource.push(data);
    this.setState({})

  }

  //记录改变的数据
  changeData = (index,record,valueKey,value) => {
    let { dataSource, goodsData } = this.state;
    //{label: "床", value: 1, __key: "1"}
    if(valueKey=="classId"){
        let name;
        goodsData.forEach((item)=>{
          if(item.value == value){
            name = item.label;
          }
        })
        dataSource[index]["name"]=name;
    }
    dataSource[index][valueKey]=value;
    this.setState({});
  }

  renderName = (valueKey, value, index, record) => {
    if(valueKey=="classId"){
      return (
        <Select
          style={{ width: "100%" }}
          dataSource={this.state.goodsData}
          value={this.state.dataSource[index][valueKey]}
          onChange={this.changeData.bind(this, index, record, valueKey)}
        />
      )
    }else if(valueKey=="size"){
      return (
        <Input
          style={{ width:"120px"}}
          placeholder={valueKey=="remarks"? "": "0"}
          value={this.state.dataSource[index][valueKey]}
          onChange={this.changeData.bind(this, index, record, valueKey)}
        />
      )
    }else{
      return (
        <Input
          style={{ width:"80px"}}
          placeholder={valueKey=="remarks"? "": "0"}
          value={this.state.dataSource[index][valueKey]}
          onChange={this.changeData.bind(this, index, record, valueKey)}
        />
      )
    }
  }

  renderHeader = (title) => {
    return (<span>
      {title}
      <Button
        style={{marginLeft:"5px"}}
        size="small"
        type="secondary"
        shape="warning"
        onClick={()=>{this.deleteFloor(title)}}
        >
          删除
        </Button>
    </span>)
  }

  onClose = () => {
     this.setState({
       addFloorVisible: false
     });
   };

  onOpen = () => {
      this.setState({
        addFloorVisible: true
      });
  };

  FloorNum = (value) => {
     this.state.num = value;
     this.setState({});
  }
  /*表格end*/

  handleRemove = async () => {
    let dataArray = this.state.dataSource.map((item)=>{
      return (JSON.stringify(item));
    });
    let tableText = encodeURI(dataArray.join('_'));

    //添加总单
    const data = await postAddGeneral({orderId:this.state.id,text:tableText});
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      this.props.history.push("/design/info");
    }else{
      Toast.error(data.data.msg);
    }
  }

  render() {
    const { dataSource, drawingAddress, fileAddress, id } = this.state;
    return (<div className="design-add-general-page" >
    <IceContainer>
      <h2 style={{textAlign:"center", borderBottom:"1px solid black"}}>订单{id}</h2>
      <IceTitle text="下载合同" />
        {
          fileAddress.split(',').map((item,index)=>{
            return (
              <Button
                key={index}
                onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
              >
                合同{index+1}
              </Button>
            );
          })
        }
        <IceTitle text="下载图纸" />
        {
          drawingAddress.split(',').map((item,index)=>{
            return (
              <Button
                key={index}
                onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
              >
                图纸{index+1}
              </Button>
            );
          })
        }


        <h2 style={{ textAlign: "center" }}>编辑总单</h2>
        <Table dataSource={ dataSource }>
            <Table.Column title="名称" dataIndex="classId" cell={this.renderName.bind(this,"classId")}/>
            <Table.Column title="规格" dataIndex="size" cell={this.renderName.bind(this,"size")}/>
            <Table.Column title="备注" dataIndex="remarks" cell={this.renderName.bind(this,"remarks")} />
              {
                this.state.columns.map((item,index)=>{
                  return (<Table.Column
                    title={this.renderHeader.bind(this, item.title)}
                    key={index}
                    dataIndex={(index+1)+"F" }
                    cell={this.renderName.bind(this,item.title)}
                    />);
                })
              }

        </Table>

        <Button onClick={this.addItem} style={styles.button}>新增</Button>

        <Button onClick={this.onOpen} style={styles.button}>添加楼层</Button>

        <Dialog
          visible={this.state.addFloorVisible}
          onOk={this.addFloor}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="请输入楼层数"
        >
          <Input placeholder="请输入楼层数" onChange={this.FloorNum}/>
        </Dialog>

        <DeleteBalloon handleRemove={this.handleRemove}/>


    </IceContainer>
    </div>);
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  button: {
    marginTop: "5px",
    marginRight: "5px"
  }
};
