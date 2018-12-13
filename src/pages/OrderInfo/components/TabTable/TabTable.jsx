import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';

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
      visible:true,
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
        width: 200,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                onClick={()=>{this.redirctDetail(record)}}
                style={{ marginRight: "5px" }}
              >查看详情</Button>
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
  // <EditDialog
  //   index={index}
  //   record={record}
  //   getFormValues={this.getFormValues}
  // />
  //查找总订单接口
  getOrderData = (pageIndex) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findOrder.do?pageIndex=${pageIndex}`)
      .then((response)=>{
        console.log(response.data,"订单接口");
        //接口数据
        // Count:3  订单总数
        // data:[
        //   {
        //     name:"小名",  客户姓名
        //     order: {
        //       id：6  订单id
        //       signer：xxx 签约人
        //       createTime：签约时间
        //       address:xxxx   客户地址
        //       fileAddress:xxx 合同图片
        //       orderState:0  订单状态
        //       financeState:0 财务状态
        //       installState:0 安装状态
        //       adminId:操作者id ；customerId：客户id  deleteFlag: s是否删除；firstTime；secondTime；thirdTime；fourthTime；fifthTime ；
        //     },
        //     phone:"xxxx"  客户电话
        //   }
        // ]
        // pageIndex:1 当前页码
        // state:"success" 状态

        let id,customer,signer,address,createTime,status,status2;
        let fileAddress,orderState,financeState,installState,adminId,customerId,firstTime,secondTime,thirdTime,fourthTime,fifthTime;

        if(response.data.state == "success"){
          //设置分页
          this.setState({total: response.data.Count});
          //数据组装
          let data=response.data.data.map((item)=>{
            status=this.getStatusName(item.order.orderState,item.order.installState); //订单状态（中文）
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
            firstTime=item.order.firstTime;
            secondTime=item.order.secondTime;
            thirdTime=item.order.thirdTime;
            fourthTime=item.order.fourthTime;
            fifthTime=item.order.fifthTime;
            return ({id,name,signer,address,createTime,status,status2,fileAddress,orderState,financeState,installState,adminId,customerId,firstTime,secondTime,thirdTime,fourthTime,fifthTime});
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
        return "总单填写（完成）";
      case 3:
        return "测量完成";
      case 4:
        return "设计完成";
      case 5:
        return "生产完成";
      case 6:
        return "生产部入库完成";
      case 7:
        return "生产部出库完成";
      case 8:
        return "工程部入货完成";
      case 9:
        return "工程部出货完成";
      case 10:
        return "安装完成增项中";
      case 11:
        return "完成订单";
      default:
        return "状态出错2";
    }
  }
  //加载数据
  componentDidMount() {
    this.getOrderData(1);
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

  //分类切换 暂时用不到
  // handleTabChange = (key) => {
  //   this.setState({
  //     tabKey: key,
  //   });
  // };
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
