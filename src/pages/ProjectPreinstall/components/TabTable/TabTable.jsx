import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Dialog, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';
import getStatusName from '@/tool/getStatusName';

const TabPane = Tab.TabPane;
const Toast = Feedback.toast;

const tabs = [
  { tab: '全部', key: 'all' },
  // { tab: '已发布', key: 'inreview' },
  // { tab: '审核中', key: 'released' },
  // { tab: '已拒绝', key: 'rejected' },
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
        width: 100,
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
        width: 90,
      },
      {
        title: '财务状态',
        dataIndex: 'status2',
        key: 'status2',
        width: 90,
      },
      {
        title: '操作',
        width: 320,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                style={{ marginRight: "5px"}}
                 record={record}
                 onClick={ () => { this.setLinkToList(record) }}
              >
                查看订单
              </Button>
              <EditDialog  record={record} getFormValues={ this.getFormValues } />
              {
                record.orderState==9?<DeleteBalloon
                  handleRemove={() => this.ensureMeasure(value, index, record)}
                />:""
              }

            </span>
          );
        },
      },
    ];
  }
  getFormValues = (dataIndex, values) => {


    this.setState({ visible: true });
    //values.append  备注
    //values.id  增项
    //增项接口
    axios
      .get(`${API_URL}/updateOrderAppend.do?id=${values.id}&append=${values.append}`)
      .then((response)=>{
        this.setState({ visible: false });
        if(response.data.state=="success"){
          Toast.success("成功");
        }else{
          Toast.error("添加失败");
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  //跳转列表页
  setLinkToList = (record) => {
    this.props.redirectUrl(record.id);
  }
  //确认订单
  ensureMeasure = (value, index, record) => {

    this.setState({ visible: true });
    const { dataSource } = this.state;
    //修改订单状态
    axios
      .get(`${API_URL}/updateOrderState.do?orderId=${record.id}&orderState=11`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success("确认成功");
          dataSource['all'].splice(index, 1);
          this.setState({visible: false});
        }else {
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  //查找总订单接口
  getOrderData = (pageIndex) => {
    this.setState({ visible: true });
    //测量订单
    axios
      .get(`${API_URL}/findOrder.do?orderState=3,9&installState=0&pageIndex=${pageIndex}`)
      .then((response)=>{
        let id,customer,signer,address,createTime,status,status2;
        let fileAddress,orderState,financeState,installState,adminId,customerId,append;
        if(response.data.state == "success"){
          //设置分页
          this.setState({total: response.data.Count});
          //数据组装
          let data=response.data.data.map((item)=>{
            status=getStatusName(item.order.orderState,item.order.installState); //订单状态（中文）
            status2=item.order.financeState?"已结清":"未结清";
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
            append = item.order.append;
            return ({id,name,signer,address,createTime,status,status2,fileAddress,orderState,financeState,installState,adminId,customerId,append});
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
  //加载数据
  componentDidMount() {
    this.getOrderData(1);
  }
  //页码切换
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
