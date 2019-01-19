import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import FindNote from './components/FindNote';
import { postkaiLiaojilu, getGoodsType, postAddMaterialsRecord, postUpdateState } from './../../../../api';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;

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
      goodsType: [],
      tabKey: 'all',
    };
    this.columns = [
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: 70,
      },
      {
        title: '开料数',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        key: 'factoryName',
        width: 80,
      },
      {
        title: '最后操作时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '状态',
        dataIndex: 'stateName',
        key: 'stateName',
        width: 70,
      },
      {
        title: '操作',
        key: 'action',
        width: 210,
        render: (value, index, record) => {
          return (
            <span>
              {
                record.state==2?"":<Button
                  size="small"
                  type="primary"
                  style={{ marginRight: "5px" }}
                  onClick={()=>{this.props.redirct(record.id,record.name,record.size,record.count,record.remark,record.state)}}
                >
                  编辑
                </Button>
              }
              {
                record.state==1?<DeleteBalloon
                  handleRemove={() => this.handleRemove(index, record)}
                />:""
              }
              {
                localStorage["ice-pro-authority"]=="admin"?<FindNote Id={record.id} />:""
              }

            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {

    this.getGoodsType();
    this.getIndexData();
  }

  getGoodsType = async () => {
    let data;
    data = this.props.text.split('_').map((item)=>{
      return (JSON.parse(item))
    });
    let goodsType = data.map((item) => {
      return({label:item.name,value:item.classId});
    })
    //获取整个商品
    // const data = await getGoodsType();
    // //data.data =>  [{id:7,name: "床"}]
    // let goodsType = data.data.data.map((item)=>{
    //   return ({label: item.name, value: item.id})
    // })
    this.setState({ goodsType });
  }

  getIndexData = async () => {
    const data = await postkaiLiaojilu({orderId: this.props.id});
    let dataSource=data.data.list.map((item)=>{
      return({
        id: item.id,
        name: item.name,
        size: item.size,
        count: item.count,
        state: item.state, //0
        time: item.time, //"2018-12-02 03:22:07"
        remark: item.remark,
        stateName:this.getStateName(item.state),
        factoryName: this.getFactoryName(item.factoryId),
      });
    })
    this.setState({ dataSource:{ all: dataSource } });
  }

  getFactoryName = (id) => {
    let name;
    switch(id){
      case 1:
        name="南京厂"
        break;
      case 2:
        name="滁州厂"
        break;
      case 3:
        name="山东厂"
        break;
      default:
        name="出错了"
    }
    return name;
  }

  getStateName = (state) => {
    let name;
    switch(state){
      case 0:
        name="填写中"
        break;
      case 1:
        name="已生效"
        break;
      case 2:
        name="已作废"
        break;
      default:
        name="出错了"
    }
    return name;
  }

  //商品id转name
  getNameFromId = (id) => {
    const { goodsType } =this.state;
    let name;
    goodsType.forEach((item)=>{
      if(item.value==id){name=item.label}
    })
    return name;
  }

  //提交申请
  getFormValues = async (values, partsData) => {
    //values: name："床",size："30*30",number: 10,remark:"备注"
    //partsData : ["部件1"，"部件2"]
    let name = this.getNameFromId(values.classId);
    let params={
      "OrderMaterialsRecord.size": values.size,
      "OrderMaterialsRecord.name": name,
      "OrderMaterialsRecord.classId": values.classId,
      "OrderMaterialsRecord.count": values.number,
      "OrderMaterialsRecord.unproNum": values.number,
      "OrderMaterialsRecord.uninstallNum": 0,
      "OrderMaterialsRecord.orderId": this.props.id,
      "OrderMaterialsRecord.remark": values.remark?values.remark:"",
      "OrderMaterialsRecord.factoryId": values.factoryId,
      names:partsData.join(','),
    };
    const data = await postAddMaterialsRecord(params);
    //{"msg":"成功","state":"success","id":"084db49728e3461abbc65b0dbb269e77"}
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      this.props.redirct(data.data.id,name,values.size,values.number,values.remark?values.remark:"",0);
    }
  };

  handleRemove = async (index, record) => {
    const data = await postUpdateState({orderMaterialsRecordId:record.id ,State:2});
    if(data.data.state=="success"){
      Toast.success("作废成功");
      this.state.dataSource["all"][index]["state"]=2;
      this.setState({});
    }
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource, goodsType } = this.state;
    const { id } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h2 style={{ textAlign: "center" }}>订单{id}开料记录单</h2>
          <div style={{ textAlign: "right" }}>
            <EditDialog goodsType={goodsType} getFormValues={this.getFormValues} />
          </div>
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
          <Button onClick={this.props.goBack}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
