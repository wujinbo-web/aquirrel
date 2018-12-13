import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';

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
      current: 1, //当前页码
      total: 0,  //项目总数
      visible: true,
    };
    this.columns = [
      {
        title: '订单id',
        dataIndex: 'id',
        key: 'id',
        width: 70,
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
        title: '签约时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
      },
      {
        title: '财务状态',
        dataIndex: 'status2',
        key: 'status2',
        width: 80,
      },
      {
        title:"总单状态",
        dataIndex: 'status3',
        key: 'status3',
        width: 80,
      },
      {
        title: '操作',
        width: 200,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
            {
              record.text==""?<Button type="primary" style={{marginRight:"5px"}} onClick={()=>{this.props.redirct(record)}}>填写总单</Button>:<DeleteBalloon
                index={index}
                record={record}
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            }
            </span>
          );
        },
      },
    ];
  }
  //查找总订单接口
  getOrderData = (pageIndex) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?orderState=12&pageIndex=${pageIndex}`)
      .then((response)=>{
        console.log(response.data,"订单接口");
        let id,customer,signer,address,createTime,status,status2,status3;
        let fileAddress,orderState,financeState,installState,adminId,customerId,drawingAddress,text;
        if(response.data.state == "success"){
          //设置分页
          this.setState({total: response.data.Count});
          //数据组装
          let data=response.data.data.map((item)=>{
            status=this.getStatusName(item.order.orderState,item.order.installState); //订单状态（中文）
            status2=item.order.financeState?"已结清":"未结清";
            status3=item.order.text==""?"未填写":"已填写";
            id=item.order.id;  //订单id
            name=item.name; //客户名
            signer=item.order.signer; //签约人
            address=item.order.address;//地址
            createTime=item.order.createTime.slice(0,11);//签约日期
            //剩余参数
            fileAddress=item.order.fileAddress;
            orderState=item.order.orderState;
            financeState=item.order.financeState;
            installState=item.order.installState;
            adminId=item.order.adminId;
            customerId=item.order.customerId;
            drawingAddress = item.order.drawingAddress;
            text = item.order.text;
            return ({id,name,signer,address,createTime,status,status2,status3,fileAddress,orderState,financeState,installState,adminId,customerId, drawingAddress,text});
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
  //传入orderStatus订单状态和installState安装状态返回状态文字
  getStatusName = (orderStatus,installState) => {
    switch (orderStatus) {
      case 1:
        return "建立合同订单";
      case 12:
        return "收取定金（完成）";
      case 2:
        return "总单填写(完成)";
      case 3:
        return "测量完成";
      case 4:
        return "设计完成";
      case 5:
        return "生产完成";
      case 6:
        return "入库完成";
      case 7:
        return "出库完成";
      case 8:
        return "安装完成增项中";
      case 9:
        return "完成订单";
      default:
        return "状态出错2";
    }
  }
  //加载数据
  componentDidMount() {
    this.getOrderData(1);
  }
  //改变状态
  handleRemove = (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    let data=dataSource[tabKey][index];
    // data.id  订单id
    axios
      .get(`${API_URL}/updateOrderState.do?orderId=${data.id}&orderState=2`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success(response.data.msg);
          this.state.dataSource[tabKey].splice(index, 1);
          this.setState({
            dataSource,
          });
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  //野马切换
  handleChange = (current) => {
    //修改页码
    this.state.current=current;
    this.setState({});
     //请求数据
    this.getOrderData(this.state.current);
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
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
          <Pagination current={this.state.current} onChange={this.handleChange} total={this.state.total} />
        </IceContainer>
        </Loading>
      </div>
    );
  }
}
