import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { postDesignFindFloor, getDesignAddFloor, getDesignFindFloor } from './../../../../api';

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
    };
    this.columns = [
      {
        title: '楼层',
        dataIndex: 'floorNum',
        key: 'floorNum',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              {
                record.type==2?"已作废":<Button
                  size="small"
                  type="primary"
                  style={{marginRight:"5px"}}
                  onClick={()=>{this.props.redirectUrl(record)}}
                  >编辑</Button>
              }
              {
                record.type==1?<DeleteBalloon
                  handleRemove={() => this.handleRemove(value, index, record)}
                />:""
              }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getFloorData();
  }

  //获取查询数据
  getFloorData = async () => {
    try{
      //查询条件，订单id
      let data = await postDesignFindFloor(this.props.id);
      let data2 = data.data.list.map((item)=>{
        return({ id:item.id,floorNum: item.floorNum, orderId: item.orderId, type: item.type, remark: item.remark })
      });
      console.log(data2,"222");
      this.setState({ dataSource: { all: data2 } });
    }catch(err){
      Toast.error(err);
    }
  }

  //添加楼层
  getFormValues = async (values) => {
    try{
      let data = await getDesignAddFloor(this.props.id, values.number);
      if(data.data.state=="success"){
        Toast.success('添加成功');
        //重新获取下数据
        this.getFloorData();
      }else{
        Toast.error(data.data.msg);
      }
    }catch(err){
      Toast.error(err);
    }
    console.log(values);
  };

  //作废
  handleRemove = async (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    console.log(value,index,record);
    const data = await getDesignFindFloor(record.orderId, record.floorNum, record.id, 2);
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      dataSource[tabKey].splice(index, 1);
      this.setState({ dataSource });
    }else{
      Toast.error(data.data.msg);
    }
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource } = this.state;
    const { id, address } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h1 style={{textAlign: 'center'}}>订单楼层概况</h1>
          <h2>订单ID：{id}，地址：{address}</h2>
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
          <EditDialog getFormValues={this.getFormValues}/>
          <Button onClick={this.props.direction}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
