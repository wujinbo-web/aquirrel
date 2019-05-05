import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Table, Dialog, Input, Select, Feedback } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import axios from 'axios';
import { API_URL } from '../../config';
import DeleteBalloon from './component/DeleteBalloon';
import { postAddGeneral, queryCountList, postDesignFindFloor, getDesignQueryByOrderIdFloor  } from '@/api';
import getTabelHeadName from '@/tool/countListToName';

const Toast = Feedback.toast;

export default class DesignAddGeneral extends Component {
  static displayName = 'DesignAddGeneral';

  constructor(props) {
    super(props);
    this.state = {
      id:this.props.location.search.split('?')[1].split('&')[0].split('=')[1],
      pic:this.props.location.search.split('?')[1].split('&')[1].split('=')[1],
      order:this.props.location.search.split('?')[1].split('&')[2].split('=')[1],
      tableData:[],  //总单数据
      tableHead: [], //总单表格
      mesureList: [],
    };
  }



  componentDidMount = () => {
    this.getCountList();
    this.getFloorData();
  }

  //查询列表数据
  getIndexData = async (floorNumId) => {
    const data = await getDesignQueryByOrderIdFloor(this.state.id, floorNumId);
    console.log(data.data);
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
    //console.log(headData2); //[{title:"床",index:"7"}]
    //this.state.headData=headData2;
    //获取列表数据
    let bodyData=data.data.room.map((item1)=>{
      let itemData={roomNum:item1};
      data.data[item1].forEach((item2)=>{  //{id:"7",name: "床",size: ""}
        itemData[item2.id]=item2.size;
      })
      return itemData;
    })
    //console.log(bodyData);//[{floorNum:"301",7:"",8:"",9:""...},{...}]
    //this.state.dataSource=bodyData;
    this.state.mesureList.push({tableData: bodyData, tableHead: headData2})
    console.log(this.state.mesureList,"kankankanka");
    this.setState({});
  }

  //获取查询楼层数据
  getFloorData = async () => {
    try{
      //查询条件，订单id
      let data = await postDesignFindFloor(this.state.id);
      let data2 = data.data.list.forEach((item)=>{
        this.getIndexData(item.id);
      });
      this.setState({ dataSource: { all: data2 } });
      console.log(data2);
    }catch(err){
      Toast.error(err);
    }
  }

  //处理总单数据
  getCountList = async () => {
    const { id } = this.state;
    const response = await queryCountList({ orderId: id });
    //console.log(response.data.list);
    let arrayData = response.data.list.map((item)=>{
        return item.order;
    });
    //[{1F:11,2F:22,classId:3....},{1F:11,2F,.....}]
    let data=arrayData.map((item)=>{
      let key;
      let count=0;
      for(key in item){
        if(key!="name"&&key!="size"&&key!="remarks"&&key!="jputNum"&&key!="joutNum"&&key!="count"&&key!="classId"&&key!="installNum"&&key!="proNum"&&key!="dputNum"&&key!="doutNum"&&key!="uninstallNum"&&key!="unproNum"){
          count+=Number(item[key]);
        }
      }
      item.heji=count;
      return item;
    })
    //渲染导航条
    let component=[];
    let key;
    component.push("name");
    component.push("size");
    for( key in data[0]){
      if(key!="name"&&key!="jputNum"&&key!="joutNum"&&key!="dputNum"&&key!="doutNum"&&key!="heji"&&key!="proNum"&&key!="size"&&key!="remarks"&&key!="count"&&key!="classId"&&key!="installNum"&&key!="uninstallNum"&&key!="unproNum"){
        component.push(key);
      }
    }
    component.push('heji');
    component.push('remarks');
    this.setState({tableData: data,tableHead:component});

  }

  render() {
    let { id, pic, order, tableData, tableHead, mesureList } = this.state;
    return (<div className="design-add-general-page" >
    <IceContainer>
      <h2 style={{textAlign:"center", borderBottom:"1px solid black"}}>订单{id}</h2>
        <IceTitle text="下载订单" />
        {
          order.split(',').map((item,index)=>{
            return (
              <Button
                key={index}
                style={{ marginRight: "5px" }}
                onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
              >
                合同{index+1}
              </Button>
            );
          })
        }
        <IceTitle text="下载图纸" />
        {
          pic.split(',').map((item,index)=>{
            return (
              <Button
                key={index}
                style={{ marginRight: "5px" }}
                onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
              >
                图纸{index+1}
              </Button>
            );
          })
        }

        <IceTitle text="总单数据" />

          <Table dataSource={tableData}>
            {
              tableHead.map((key,index)=>{
                return (<Table.Column title={getTabelHeadName(key)} key={index} dataIndex={key}/>)
              })
            }
          </Table>

        <IceTitle text="测量数据" />

        {
          mesureList.map((data,index)=>{
            return(
            <Table dataSource={data.tableData} key={index}>
                <Table.Column title="房号" dataIndex="roomNum" width={70} lock />
                {
                  data.tableHead.map((item)=>{
                    return(<Table.Column
                      key={item.index}
                      title={item.title}
                      dataIndex={item.index}
                      width={90}
                      />)
                  })
                }
            </Table>
            )
          })
        }


        <Button onClick={()=>this.props.history.push('/orderDetail')} style={{ marginTop:"5px" }}>返回</Button>
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
