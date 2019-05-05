import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '@/config';
import getStatusName from '@/tool/getStatusName';
import { postUrl } from '@/api';
import { updateOrderInfo } from '@/api/apiUrl';

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
      dataSource: { all: [] },
      tabKey: 'all',
      current: 1, //当前页码
      total: 0,  //项目总数
      visible:true,
    };
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width:50
      },
      {
        title: '客户',
        dataIndex: 'name',
        key: 'name',
        width: 70,
      },
      {
        title: '签约人',
        dataIndex: 'signer',
        key: 'signer',
        width: 70,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '客户对接人',
        dataIndex: 'successor',
        width: 100,
        key:'successor',
      },
      {
        title: '对接电话',
        dataIndex: 'successorPhone',
        key:'successorPhone',
        width: 120,
      },
      {
        title: '签约时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
      },
      {
        title: '财务状态',
        dataIndex: 'status2',
        key: 'status2',
        width: 100,
      },
      {
        title: '操作',
        width: 240,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                onClick={()=>{this.redirctDetail(record)}}
                style={{ marginRight: "5px" }}
              >查看详情</Button>
              <EditDialog record={record} index={index} getFormValues={this.submitEdit} />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        },
      },
    ];
  }
  redirctDetail = (record) => {
    this.props.redirctDetail(record.id);
  }
  //查找总订单接口
  getOrderData = () => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?pageIndex=${this.state.current}`)
      .then((response)=>{
        if(response.data.state == "success"){
          //设置分页
          this.setState({total: response.data.Count});
          //数据组装
          let data=response.data.data.map((item)=>{
            return ({
              id: item.order.id,
              name: item.name, //客户名,
              signer: item.order.signer, //签约人,
              address:item.order.address,//地址,
              createTime: item.order.createTime.slice(0,11),//签约日期,
              endTime: item.order.endTime,
              status: getStatusName(item.order.orderState,item.order.installState), //订单状态（中文）,
              status2: item.order.financeState?"已结清":"未结清",
              fileAddress: item.order.fileAddress,
              drawingAddress: item.order.drawingAddress,
              orderState: item.order.orderState,
              financeState: item.order.financeState,
              installState: item.order.installState,
              adminId: item.order.adminId,
              incomeMoney: item.order.incomeMoney,
              invoiceMoney: item.order.invoiceMoney,
              customerId: item.order.customerId,
              payMoney: item.order.payMoney,
              append: item.order.append,
              successor:item.order.successor,
              successorPhone: item.order.successorPhone,
              text: item.order.text,
              pmoney: item.order.pmoney,
            });
          })
          //渲染
          this.setState({
            dataSource: {all:data},
            visible: false,
          });
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  //编辑订单
  submitEdit = async (dataIndex,values,orderFile,designFile) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState({
      dataSource,
    });
    let response = await postUrl(updateOrderInfo,{
      "order.id":values.id,
      "order.signer":values.signer,
      "order.installState":values.installState,
      "order.orderState":values.orderState,
      "order.address":values.address,
      "order.customerId":values.customerId,
      "order.adminId":values.adminId==null?"":values.adminId,
      "order.append":values.append==null?"":values.append,
      "order.drawingAddress":designFile,
      "order.endTime":values.endTime==null?"":values.endTime,
      "order.fileAddress":orderFile,
      "order.financeState":values.financeState,
      "order.incomeMoney":values.incomeMoney,
      "order.invoiceMoney":values.invoiceMoney,
      "order.payMoney":values.payMoney,
      "order.successor":values.successor,
      "order.successorPhone":values.successorPhone,
      "order.text":values.text,
      "order.pmoney":values.pmoney,
    });
    if(response.data.state=="success"){
      Toast.success("编辑成功");

    }else{
      Toast.error(response.data.msg);
    }

    this.getOrderData();
  }

  //加载数据
  componentDidMount() {
    this.getOrderData();
  }
  //编辑表格
  getFormValues = (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState({
      dataSource,
    });
  };
  //删除
  handleRemove = (value, index) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    let data=dataSource[tabKey].splice(index, 1);
    // data.id  订单id
    axios
      .get(`${API_URL}/deleteOrder.do?id=${data[0].id}`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success(response.data.msg);
          this.setState({
            dataSource,
            visible: false,
          });
        }else{
          this.setState({ visible: false });
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  //页码切换
  handleChange = (current) => {
    //修改页码
    this.state.current=current;
    this.setState({});
     //请求数据
    this.getOrderData();
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item,index) => {
              return (
                <TabPane tab={item.tab} key={index}>
                  <CustomTable
                    dataSource={dataSource[this.state.tabKey]}
                    columns={this.columns}
                    hasBorder={false}
                  />
                </TabPane>
              );
            })}
          </Tab>
          <Pagination current={this.state.current} onChange={this.handleChange} total={this.state.total} />
          </Loading>
        </IceContainer>
      </div>
    );
  }
}
