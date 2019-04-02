import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Table, Dialog, Input, Select, Feedback } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import axios from 'axios';
import { API_URL } from '../../config';
import DeleteBalloon from './components/DeleteBalloon';
import { postAddGeneral  } from './../../api';
import EditDialog from './components/EditDialog';
import addSeries from './components/addSeries';

const Toast = Feedback.toast;

export default class DesignAddGeneral extends Component {
  static displayName = 'DesignAddGeneral';

  constructor(props) {
    super(props);
    this.state = {
      goodsData: [], //商品下拉
      addFloorVisible: false,
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
    //获取客户数据
    this.getGoodsData();
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
      console.log(this.state.dataSource);
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

  //修改商品名
  editData = (index, values) => {
    this.state.dataSource[index].name=values.name;
    this.state.dataSource[index].classId=values.id;
    console.log(this.state.dataSource);
    this.setState({});
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
        <span> {this.state.dataSource[index].name} <EditDialog  getFormValues={this.editData} index={index} /></span>
      )
    }else if(valueKey=="size"){
      return (
        <Input
          style={{ width:"100%"}}
          placeholder={valueKey=="remarks"? "": "0"}
          value={this.state.dataSource[index][valueKey]}
          onChange={this.changeData.bind(this, index, record, valueKey)}
        />
      )
    }else{
      return (
        <Input
          style={{ width:"100%"}}
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
    const data = await postAddGeneral({orderId:sessionStorage.design_order_id,text:tableText});
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      this.props.history.push("/design/generallist");
    }else{
      Toast.error(data.data.msg);
    }
  }

  render() {
    const design_order_id = sessionStorage.design_order_id;
    const drawingAddress = sessionStorage.design_drawingAddress;
    const fileAddress = sessionStorage.design_fileAddress;
    const { dataSource } = this.state;
    return (<div className="design-add-general-page" >
    <IceContainer>
        <h2 style={{textAlign:"center", borderBottom:"1px solid black"}}>订单{design_order_id}</h2>
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

        <h2 style={{ textAlign: "center" }}>填写初步货单</h2>
        <Table dataSource={ dataSource }>
            <Table.Column
              lock="left"
              width={350}
              title="名称"
              dataIndex="classId"
              cell={this.renderName.bind(this,"classId")}
            />
            <Table.Column
              lock="left"
              width={180}
              title="规格"
              dataIndex="size"
              cell={this.renderName.bind(this,"size")}
            />
            <Table.Column
              lock="left"
              width={150}
              title="备注"
              dataIndex="remarks"
              cell={this.renderName.bind(this,"remarks")}
            />
              {
                this.state.columns.map((item,index)=>{
                  return (<Table.Column
                    title={this.renderHeader.bind(this, item.title)}
                    width={100}
                    key={index}
                    dataIndex={(index+1)+"F" }
                    cell={this.renderName.bind(this,item.title)}
                    />);
                })
              }

        </Table>

        <Button
          onClick={this.addItem}
          type="primary"
          size="small"
          style={styles.button}
        >
          新增商品
        </Button>

        <addSeries  />

        <Button onClick={this.onOpen} size="small" style={styles.button}>添加楼层</Button>

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
    marginTop: "10px",
    marginRight: "5px"
  }
};
