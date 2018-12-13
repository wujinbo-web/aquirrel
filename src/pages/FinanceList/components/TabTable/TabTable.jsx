import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import { API_URL } from './../../../../config';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import DeleteBalloon2 from './components/DeleteBalloon2';

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
      tabKey: 'all',
      visible: true,    //加载框是否显示
      dataMoney: {
        incomeMoney: "",
        payMoney: "",
        pool: "",
        pMoney: "",
      },
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '类目',
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        width: 60,
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        key: 'typeName',
        width: 60,
      },
      {
        title: '创建时间',
        dataIndex: 'startTime',
        key: 'startTime',
        with: 100,
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              {
                record.moneyState=="未结清"? <DeleteBalloon2
                  handleRemove={() => this.handleGathering(index, record)}
                />: record.moneyState
              }
              {
                record.moneyState=="未结清"? <DeleteBalloon
                  handleRemove={() => this.handleCancel(index, record)}
                />: ""
              }

            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    //获取首页数据
    this.getIndexData();
    this.getIndexHeader();
  }

  //获取首页数据
  getIndexData = () => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findByOrderId.do?orderId=${this.props.id}`)
      .then((response) => {
        console.log(response.data,"看看返回");
        let data=response.data.list.map((item)=>{
          return({
            id:item.id,
            name:item.name,
            money:item.money,
            startTime:item.startTime,
            moneyState:this.getMoneyStateName(item.moneyState),
            typeName: item.type==0?"收入":"支出",
            type:item.type
          });
        });

        this.setState({
          dataSource: {all: data},
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getIndexHeader = () => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?id=${this.props.id}`)
      .then((response)=>{
        //incomeMoney  收入  payMoney指出
        let data = response.data.data[0].order;
        let incomeMoney=data.incomeMoney;
        let payMoney=data.payMoney;
        let pool = data.pmoney - data.incomeMoney;
        let pMoney = data.pmoney;
        this.setState({ dataMoney: {incomeMoney, payMoney, pool, pMoney}, visible: false, });
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  //状态码转化
  getMoneyStateName = (status) => {
    if(status==0){
      return "未结清";
    } else if(status==1){
      return "已结清";
    } else if (status==2){
      return "已作废";
    } else{
      return "状态作废";
    }
  }

  //确认收款
  handleGathering = (index, record) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/updateMoneyState.do?id=${record.id}&moneyState=1`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success("确认成功");
          this.state.dataSource["all"][index].moneyState="已结清";
          this.setState({
            visible: false,
          });
          this.getIndexHeader();
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{console.log(error);})

  };

  //作废款项
  handleCancel = (index, record) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/updateMoneyState.do?id=${record.id}&moneyState=2`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success("确认成功");
          this.state.dataSource["all"][index].moneyState="已作废";
          this.setState({
            visible: false,
          });
          this.getIndexHeader();
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{console.log(error);})
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  getFormValues = (values) => {
    //{name: "213", type: "1", money: "112"}
    this.setState({visible: true});
    //参数
    //values.money: 金额, values.name: 名字, this.props.id: 订单id
    let query=(values.type==0?"":"&orderMoney.moneyState=1");
    axios
      .get(`${API_URL}/saveOrderMoney.do?orderMoney.orderId=${this.props.id}&orderMoney.name=${values.name}&orderMoney.money=${values.money}&orderMoney.type=${values.type+query}`)
      .then((response)=>{
        console.log(response.data);
        if(response.data.state=="success"){
          Toast.success(response.data.msg);
          this.getIndexData();
          this.getIndexHeader();
        }else{
          Toast.error(response.data.msg);
        }
        console.log(response.data);
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  render() {
    const { dataSource, dataMoney } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <h2 style={styles.formTitle}>
            当前订单id:{this.props.id};
            订单总收入:{dataMoney.incomeMoney};
            订单总支出:{dataMoney.payMoney};
            合同金额:{dataMoney.pMoney};
            剩余款项:{dataMoney.pool};
          </h2>
          <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
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
          <EditDialog record={{name:"",money:"",type:"0"}} getFormValues={this.getFormValues} />
          </Loading>
        </IceContainer>
      </div>
    );
  }
}
const styles = {
  addNewItem: {
    background: '#F5F5F5',
    height: 32,
    lineHeight: '32px',
    marginTop: 20,
    cursor: 'pointer',
    textAlign: 'center',
  },
  formTitle: {
    margin: '0 0 20px',
    fontSize: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color:'#2077FF',
  },
};
