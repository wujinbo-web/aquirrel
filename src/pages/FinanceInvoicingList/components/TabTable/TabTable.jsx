import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Button } from '@icedesign/base';
import axios from 'axios';
import { API_URL } from '@/config';
import IceTitle from '@icedesign/title';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import AddInvoicingItem from './components/AddInvoicingItem';
import DeleteBalloon from './components/DeleteBalloon';
import data from './data';
import { Grid } from "@icedesign/base";
import { invoiceListQuery, invoiceAdd, invoiceDelete, invoiceUpdate, customsQuery } from '@/api/apiUrl';
import { postUrl } from '@/api';

const Toast = Feedback.toast;
const { Row, Col } = Grid;
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
      dataMoney: [],
      defaultData: {}, //开票默认信息
      tabKey: 'all',
    };
    this.columns = [
      {
        title: '需方单位',
        dataIndex: 'demanderCompany',
        key: 'demanderCompany',
      },
      {
        title: '需方税号',
        dataIndex: 'demanderTFN',
        key: 'demanderTFN',
      },
      {
        title: '开票单位',
        dataIndex: 'invoiceCompany',
        key: 'invoiceCompany',
      },
      {
        title: '开票单位税号',
        dataIndex: 'invoiceTFN',
        key: 'invoiceTFN',
      },
      {
        title: '开票金额',
        dataIndex: 'invoiceMoney',
        key: 'invoiceMoney',
        width: 60,
      },
      {
        title: '税率',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 60,
      },
      {
        title: '收款账户',
        dataIndex: 'receiptAccount',
        key: 'receiptAccount',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
            {
              record.deleteFlag == 0 ? <DeleteBalloon
                handleRemove={() => this.handleRemove(index, record)}
              /> : "已作废"
            }

            </span>
          );
        },
      },
    ];
  }

  componentDidMount (){
    this.getIndexData();
    this.getIndexHeader();
  }

  getIndexData = async () => {
    const response = await postUrl(invoiceListQuery,{orderId: this.props.id});

    let data = response.data.invoiceList.map((item)=>{
      return({
        id:item.id,
        demanderCompany: item.demanderCompany,
        demanderTFN:item.demanderTFN,
        invoiceCompany:item.invoiceCompany,
        invoiceTFN:item.invoiceTFN,
        invoiceMoney: item.invoiceMoney,
        taxRate: item.taxRate,
        receiptAccount: item.receiptAccount,
        deleteFlag: item.deleteFlag,
      })
    });
    this.setState( { dataSource:{all: data} } );
  }

  getIndexHeader = () => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?id=${this.props.id}`)
      .then(async (response)=>{
        //incomeMoney  收入  payMoney指出
        let name = response.data.data[0].name;
        let data = response.data.data[0].order;
        let incomeMoney=data.incomeMoney;
        let address=data.address;
        let pMoney = data.pmoney;
        let customerId = data.customerId;
        let invoiceMoney = data.invoiceMoney;
        const response2 = await postUrl(customsQuery, { id: customerId  });
        let data2 = response2.data.data[0].customer;

        this.setState({
          dataMoney: {name, address,incomeMoney, pMoney, customerId, invoiceMoney},
          visible: false,
          defaultData:{demanderCompany:data2.companyName, demanderTFN: data2.TFN }
        });

      })
      .catch((error)=>{
        console.log(error);
      })
  }

  // getFormValues = async (dataIndex, values) => {
  //   const response = await postUrl(invoiceUpdate,{
  //     "invoice.orderId": this.props.id,
  //     "invoice.id": values.id,
  //     "invoice.demanderCompany": values.demanderCompany,
  //     "invoice.demanderTFN": values.demanderTFN,
  //     "invoice.invoiceCompany": values.invoiceCompany,
  //     "invoice.invoiceMoney": values.invoiceMoney,
  //     "invoice.invoiceTFN": values.invoiceTFN,
  //     "invoice.receiptAccount": values.receiptAccount,
  //     "invoice.taxRate": values.taxRate
  //   });
  //   if(response.data.state=="200"){
  //     const { dataSource, tabKey } = this.state;
  //     dataSource[tabKey][dataIndex] = values;
  //     this.setState({
  //       dataSource,
  //     });
  //   }else{
  //     Toast.error("error");
  //   }
  // };

  handleRemove = async (index, record) => {
    const response = await postUrl(invoiceDelete,{id: record.id});
    if(response.data.state == "200"){
      Toast.success("成功");
      this.getIndexData();
      this.getIndexHeader();
      // const { dataSource, tabKey } = this.state;
      // dataSource[tabKey].splice(index, 1);
      // this.setState({
      //   dataSource,
      // });
    }else{
      Toast.error("删除失败");
    }
  };

  // handleTabChange = (key) => {
  //   this.setState({
  //     tabKey: key,
  //   });
  // };

  addInvoicingItem = async (values) => {
    const response = await postUrl(invoiceAdd,{
      "invoice.orderId": this.props.id,
      "invoice.demanderCompany": values.demanderCompany,
      "invoice.demanderTFN": values.demanderTFN,
      "invoice.invoiceCompany": values.invoiceCompany,
      "invoice.invoiceMoney": values.invoiceMoney,
      "invoice.invoiceTFN": values.invoiceTFN,
      "invoice.receiptAccount": values.receiptAccount,
      "invoice.taxRate": values.taxRate
    });
    if(response.data.state=="200"){
      Toast.success("添加成功");
      this.getIndexData();
      this.getIndexHeader();
    }else{
      Toast.error("error");
    }
  }

  render() {
    const { dataSource, dataMoney, defaultData } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <IceTitle text="发票概况" />
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
              <Col>已开票金额:{dataMoney.invoiceMoney}</Col>
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
          <AddInvoicingItem record={defaultData} getFormValues={this.addInvoicingItem} />
            <Button
              size="small"
              type="primary"
              onClick={()=>this.props.goBack()}
            >返回</Button>
        </IceContainer>
      </div>
    );
  }
}
