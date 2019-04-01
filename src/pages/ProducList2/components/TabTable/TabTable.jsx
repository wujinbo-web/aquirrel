import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { postkaiLiaojilu, getGoodsType, postAddMaterialsRecord, postUpdateState, updateOrderState } from './../../../../api';

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
      current: 1,
      total: 1,
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
        title: '已生产',
        dataIndex: 'proNum',
        key: 'proNum',
        width: 70,
      },
      {
        title: '已入库',
        dataIndex: 'dputNum',
        key: 'dputNum',
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
              {
                record.state==2?"":<EditDialog index={index} record={record} getFormValues={this.getFormValues} />
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

    let params = {
      "orderMaterialsRecord.id":values.id,
      "orderMaterialsRecord.dputNum":Number(values.dputNum)+Number(values.number),
    };
    const data = await updateOrderState(params);
    if(data.data.state="success"){
      Toast.success("成功");
      this.state.dataSource["all"][dataIndex]["dputNum"]=Number(values.dputNum)+Number(values.number);
      this.setState({});
    }
    console.log(data);
  }

  getIndexData = async () => {
    const data = await postkaiLiaojilu({orderId: this.props.id, pageIndex: this.state.current});
    this.state.total = data.data.total;
    let dataSource=data.data.data.map((item)=>{
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
        dputNum: item.dputNum,
      });
    })
    console.log(dataSource);
    this.setState({ dataSource:{ all: dataSource.filter(item=>item.state !=0) } });
  }



  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  //切换页码
  handleChange = (current) => {
    this.state.current = current;
    this.setState({});
    this.getIndexData();
  }

  render() {
    const { dataSource, goodsType } = this.state;
    const { id } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h2 style={{ textAlign: "center" }}>订单{id}入库单</h2>
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
          <Pagination
            style={{float: "right"}}
            current={this.state.current}
            total={this.state.total}
            onChange={this.handleChange}
          />
          <Button onClick={this.props.goBack}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
