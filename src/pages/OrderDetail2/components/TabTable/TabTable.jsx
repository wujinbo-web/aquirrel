import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading } from '@icedesign/base';
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
        title: '对接人',
        dataIndex: 'successor',
        key: 'successor',
        width: 70,
      },
      {
        title: '对接电话',
        dataIndex: 'successorPhone',
        key: 'successorPhone',
      },
      {
        title: '备注',
        dataIndex: 'order_describe',
        key: 'order_describe',
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
        dataIndex: 'financeState',
        key: 'financeState',
        width: 120,
      },
      {
        title: '操作',
        width: 200,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                onClick={()=>{this.redirctDetail(record)}}
                style={{ marginRight: "5px" }}
              >查看详情</Button>
            </span>
          );
        },
      },
    ];
  }

  redirctDetail = (record) => {
    this.props.redirctDetail(record.id,record.drawingAddress,record.fileAddress);
  }
  //查找总订单接口
  getOrderData = (pageIndex) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?pageIndex=${pageIndex}`)
      .then((response)=>{
        let id,customer,signer,address,createTime,status,status2,drawingAddress,order_describe;
        let fileAddress,orderState,financeState,installState,adminId,customerId,successor,successorPhone;

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
            drawingAddress = item.order.drawingAddress;
            //剩余参数
            fileAddress=item.order.fileAddress;
            orderState=item.order.orderState;
            financeState=item.order.financeState?"已结清":"未结清";
            installState=item.order.installState;
            adminId=item.order.adminId;
            customerId=item.order.customerId;
            successor=item.order.successor;
            successorPhone=item.order.successorPhone;
            order_describe= item.order.order_describe;
            return ({
              id,
              name,
              signer,
              address,
              createTime,
              status,
              status2,
              fileAddress,
              orderState,
              financeState,
              installState,
              adminId,
              customerId,
              drawingAddress,
              successor,
              successorPhone,
              order_describe
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
        <IceContainer>
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
          <Pagination current={this.state.current} onChange={this.handleChange} total={this.state.total} />
          </Loading>
        </IceContainer>
      </div>
    );
  }
}
