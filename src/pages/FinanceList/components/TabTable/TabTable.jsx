import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading, Button } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import axios from 'axios';
import { API_URL } from './../../../../config';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import DeleteBalloon2 from './components/DeleteBalloon2';
import { Grid } from "@icedesign/base";

const { Row, Col } = Grid;
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
        name:"",
        address: "",
        incomeMoney: "",
        payMoney: "",
        pool: "",
        pMoney: "",
      },
    };
    this.columns = [
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
        title: '实际收入',
        dataIndex: 'inMoney',
        key: 'inMoney',
        width: 60,
      },
      {
        title: '实际支出',
        dataIndex: 'payMoney',
        key: 'payMoney',
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
              <Button
                size="small"
                type="primary"
                onClick={()=>{this.props.redirctDetail(record.id)}}
              >查看详情</Button>
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
            inMoney: item.inMoney,
            payMoney: item.payMoney,
            startTime:item.startTime,
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
        let name = response.data.data[0].name;
        let data = response.data.data[0].order;
        let incomeMoney=data.incomeMoney;
        let address=data.address;
        let payMoney=data.payMoney;
        let pool = (data.pmoney*100 - data.incomeMoney*100)/100;
        let pMoney = data.pmoney;
        this.setState({ dataMoney: {name, address,incomeMoney, payMoney, pool, pMoney}, visible: false, });
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  //确认收款
  // handleGathering = (index, record) => {
  //   this.setState({ visible: true });
  //   axios
  //     .get(`${API_URL}/updateMoneyState.do?id=${record.id}&moneyState=1`)
  //     .then((response)=>{
  //       if(response.data.state=="success"){
  //         Toast.success("确认成功");
  //         this.state.dataSource["all"][index].moneyState="已结清";
  //         this.setState({
  //           visible: false,
  //         });
  //         this.getIndexHeader();
  //       }else{
  //         Toast.error(response.data.msg);
  //       }
  //     })
  //     .catch((error)=>{console.log(error);})
  //
  // };

  //作废款项
  // handleCancel = (index, record) => {
  //   this.setState({ visible: true });
  //   axios
  //     .get(`${API_URL}/updateMoneyState.do?id=${record.id}&moneyState=2`)
  //     .then((response)=>{
  //       if(response.data.state=="success"){
  //         Toast.success("确认成功");
  //         this.state.dataSource["all"][index].moneyState="已作废";
  //         this.setState({
  //           visible: false,
  //         });
  //         this.getIndexHeader();
  //       }else{
  //         Toast.error(response.data.msg);
  //       }
  //     })
  //     .catch((error)=>{console.log(error);})
  // };

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
    axios
      .get(`${API_URL}/saveOrderMoney.do?orderMoney.orderId=${this.props.id}&orderMoney.name=${values.name}&orderMoney.money=${values.money}`)
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
          <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
            <div style={{ display: "block", textAlign:"right",marginBottom:"-60px"}}>
              <Button
                size="small"
                type="primary"
                onClick={() => this.props.redirctInvoicingList(this.props.id)}
              >查看开票</Button>
            </div>
          <IceTitle text="财务概况" />
            <div
              style={{
                background:'#eee',
                fontSize: '20px',
                color:'#666',
                height:'100px',
                textAlign:'center',
                paddingTop:'40px'
              }}
          >
            <Row>
              <Col>客户:{dataMoney.name}</Col>
              <Col>地址:{dataMoney.address}</Col>
              <Col>实际收入:{dataMoney.incomeMoney}</Col>
              <Col>实际支出:{dataMoney.payMoney}</Col>
              <Col>合同金额:{dataMoney.pMoney}</Col>
              <Col>剩余款项:{dataMoney.pool}</Col>
            </Row>
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
          <EditDialog record={{name:"",money:""}} getFormValues={this.getFormValues} />
          <Button
            size="small"
            type="primary"
            onClick={()=>this.props.goBack()}
          >返回</Button>
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
};
