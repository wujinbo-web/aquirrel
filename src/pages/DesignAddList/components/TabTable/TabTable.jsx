import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import DeleteBalloon2 from './components/DeleteBalloon2';
import { API_URL } from './../../../../config';

const TabPane = Tab.TabPane;
const Toast=Feedback.toast;

const tabs = [
  { tab: '全部', key: 'all' }
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
      record: {},
      visible: true,
    };
    this.columns = [
      {
        title: '开料单id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '最后操作人',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '状态',
        dataIndex: 'stateName',
        key: 'stateName',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              {
                record.state==0?<Button
                  size="small"
                  type="primary"
                  style={{ marginRight: "5px" }}
                  onClick={()=>{this.redirct(record)}}
                >
                  填写
                </Button>: ""
              }
              {
                record.state==0?<DeleteBalloon2
                  handleRemove={() => this.handleRemove(value, index, record)}
                />:""
              }
              {
                record.state==1?<DeleteBalloon
                  handleRemove={() => this.handleRemove2(value, index, record)}
                />:""
              }

            </span>
          );
        },
      },
    ];
  }
  redirct = (record) => {
    this.props.redirct(record);
  }
  componentDidMount() {
    this.getMainData();
  }

  getMainData = () => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/qureyOmdByMcId.do?measureCountId=${this.props.id}`)
      .then((response) => {
        let data=response.data.list.map((item)=>{
          return ({ id: item.id, count: item.count,name: item.name, time: item.time, state:item.state, stateName:this.getStateName(item.state)  });
        })
        this.setState({
          dataSource: {all: data},
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getStateName = (state) => {
    if(state==0){
      return "填写中";
    }else if(state==1){
      return "材料单生效";
    } else if(state==2){
      return "材料单已作废";
    }
  }

  getFormValues = (values) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/saveOrderMaterialsRecord.do?OrderMaterialsRecord.measureCountId=${this.props.id}&OrderMaterialsRecord.count=${values.number}`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success('添加成功');
          this.setState({ visible: false });
          this.getMainData();
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  //确认
  handleRemove = (value, index, record) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/updateOmdState.do?orderMaterialsRecordId=${record.id}&State=1`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success(response.data.msg);
          const { dataSource, tabKey } = this.state;
          dataSource[tabKey][index].stateName="材料单生效";
          dataSource[tabKey][index].state=1;
          this.setState({
            dataSource,
            visible: false,
          });
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  //作废
  handleRemove2 = (value, index, record) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/updateOmdState.do?orderMaterialsRecordId=${record.id}&State=2`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success(response.data.msg);
          const { dataSource, tabKey } = this.state;
          dataSource[tabKey][index].stateName="材料单已作废";
          dataSource[tabKey][index].state=2;
          this.setState({
            dataSource,
            visible: false,
          });
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource } = this.state;
    const id = this.props.id;
    const orderId = this.props.orderId;
    const name = this.props.name;
    const size = this.props.size;
    const count = this.props.count;
    const remarks = this.props.remarks;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <h1 style={{ textAlign: "center" }}>开料记录</h1>
          <h2 style={styles.formTitle}>订单id：{orderId}；产品名称：{name};规格：{size}；数量：{count}；备注：{remarks=="null"?"暂无":remarks}；</h2>
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
          <Button onClick={()=>{this.props.redirct2()}}>返回</Button>
          <EditDialog
            record={this.state.record}
            getFormValues={this.getFormValues}
          />
        </IceContainer>
        </Loading>
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
