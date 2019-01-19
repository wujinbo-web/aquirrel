import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Table } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { queryCountList } from '@/api';
import { postDesignFindFloor, getDesignAddFloor, getDesignFindFloor } from './../../../../api';

const TabPane = Tab.TabPane;
const Toast = Feedback.toast;

const tabs = [
  { tab: '全部', key: 'all' },
];

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      tabKey: 'all',
      tableData:[],
      tableHead: [],
    };
    this.columns = [
      {
        title: '楼层',
        dataIndex: 'floorNum',
        key: 'floorNum',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              {
                record.type==2?"已作废":<Button
                  size="small"
                  type="primary"
                  style={{marginRight:"5px"}}
                  onClick={()=>{this.props.redirectUrl(record)}}
                  >编辑</Button>
              }
              {
                record.type==1?<DeleteBalloon
                  handleRemove={() => this.handleRemove(value, index, record)}
                />:""
              }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getFloorData();
    this.getCountList();
  }

  getCountList = async () => {
    const { id } = this.props;
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
    console.log(data);
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

  getTabelHeadName = (key) =>　{
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

  //获取查询数据
  getFloorData = async () => {
    try{
      //查询条件，订单id
      let data = await postDesignFindFloor(this.props.id);
      let data2 = data.data.list.map((item)=>{
        return({ id:item.id,floorNum: item.floorNum, orderId: item.orderId, type: item.type, remark: item.remark })
      });
      console.log(data2,"222");
      this.setState({ dataSource: { all: data2 } });
    }catch(err){
      Toast.error(err);
    }
  }

  //添加楼层
  getFormValues = async (values) => {
    try{
      let data = await getDesignAddFloor(this.props.id, values.number);
      if(data.data.state=="success"){
        Toast.success('添加成功');
        //重新获取下数据
        this.getFloorData();
      }else{
        Toast.error(data.data.msg);
      }
    }catch(err){
      Toast.error(err);
    }
    console.log(values);
  };

  //作废
  handleRemove = async (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    console.log(value,index,record);
    const data = await getDesignFindFloor(record.orderId, record.floorNum, record.id, 2);
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      dataSource[tabKey].splice(index, 1);
      this.setState({ dataSource });
    }else{
      Toast.error(data.data.msg);
    }
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource, tableData, tableHead } = this.state;
    const { id, address } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h1 style={{textAlign: 'center'}}>订单楼层概况</h1>
          <h2>订单ID：{id}，地址：{address}</h2>
            <Table dataSource={tableData}>
              {
                tableHead.map((key,index)=>{
                  return (<Table.Column title={this.getTabelHeadName(key)} key={index} dataIndex={key}/>)
                })
              }
            </Table>
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item) => {
              return (
                <TabPane tab={item.tab} key={item.key}>
                  <CustomTable
                    dataSource={dataSource[this.state.tabKey]}
                    columns={this.columns}
                    hasBorder={false}
                  />
                </TabPane>
              );
            })}
          </Tab>
          <EditDialog getFormValues={this.getFormValues}/>
          <Button onClick={this.props.direction}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
