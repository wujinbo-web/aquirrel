import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import EditDialog2 from './components/EditDialog2';
import DeleteBalloon from './components/DeleteBalloon';
import { postkaiLiaojilu, getGoodsType, postAddMaterialsRecord, postUpdateState, postUpdataMaterialsRecord, updateOrderState } from './../../../../api';

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
        title: '待生产',
        dataIndex: 'unproNum',
        key: 'unproNum',
        width: 70,
      },
      {
        title: '已生产',
        dataIndex: 'proNum',
        key: 'proNum',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 90,
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
        width: 230,
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog record={record} orderId={this.props.id}/>
              {
                record.state==2?"":<EditDialog2 index={index} record={record} getFormValues={this.getFormValues} />
              }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getIndexData();
  }

  getFormValues = async (dataIndex, values) => {
    //values.number 生产的数量
    // let params={
    //   "orderMaterialsRecord.id":values.id,
    //   "orderMaterialsRecord.name":values.name,
    //   "orderMaterialsRecord.nameColor":values.nameColor,
    //   "orderMaterialsRecord.orderId":values.orderId,
    //   "orderMaterialsRecord.outNum":values.outNum,
    //   "orderMaterialsRecord.proNum":Number(values.proNum)+Number(values.number),
    //   "orderMaterialsRecord.putNum":values.putNum,
    //   "orderMaterialsRecord.size":values.size,
    //   "orderMaterialsRecord.sizeColor":values.sizeColor,
    //   "orderMaterialsRecord.count":values.count,
    //   "orderMaterialsRecord.countColor":values.countColor,
    //   "orderMaterialsRecord.installNum":values.installNum,
    //   "orderMaterialsRecord.state":values.state,
    //   "orderMaterialsRecord.time":values.time,
    //   "orderMaterialsRecord.remark":values.remark,
    //   "orderMaterialsRecord.remarkColor":values.remarkColor,
    //   "orderMaterialsRecord.unproNum":Number(values.unproNum)-Number(values.number),
    //   "orderMaterialsRecord.uninstallNum":values.uninstallNum,
    // };
    let params={
      "orderMaterialsRecord.id":values.id,
      "orderMaterialsRecord.proNum":Number(values.proNum)+Number(values.number),
      "orderMaterialsRecord.unproNum":Number(values.unproNum)-Number(values.number)
    }
    const data = await updateOrderState(params);
    if(data.data.state="success"){
      Toast.success("成功");
      this.state.dataSource["all"][dataIndex]["proNum"]=Number(values.proNum)+Number(values.number);
      this.state.dataSource["all"][dataIndex]["unproNum"]=Number(values.unproNum)-Number(values.number);
      this.setState({});
    }
  }

  getIndexData = async () => {
    const data = await postkaiLiaojilu({orderId: this.props.id});
    let dataSource=data.data.list.map((item)=>{
      return({
        id: item.id,
        name: item.name,
        nameColor: item.nameColor,
        orderId: item.orderId,
        outNum: item.outNum,
        proNum: item.proNum,
        putNum: item.putNum,
        size: item.size,
        sizeColor: item.sizeColor,
        count: item.count,
        countColor: item.countColor,
        installNum: item.installNum,
        state: item.state, //0
        time: item.time, //"2018-12-02 03:22:07"
        remark: item.remark,
        remarkColor: item.remarkColor,
        stateName: item.state==2?"已作废":"生效单",
        unproNum: item.unproNum,
        uninstallNum: item.uninstallNum,
      });
    })
    this.setState({ dataSource:{ all: dataSource.filter(item=>item.state !=0) } });
  }



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
          <h2 style={{ textAlign: "center" }}>订单{id}生产单</h2>
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
