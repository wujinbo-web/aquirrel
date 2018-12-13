import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Loading, Dialog, Table  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
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
      kailiaoData: [],
      visible: true,
      visible2: false, //弹窗
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
              <Button onClick={()=>{this.onOpen(record.id)}}>查看开料单</Button>
            </span>
          );
        },
      },
    ];
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


  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  onOpen = (id) => {
    axios
      .get(`${API_URL}/queryOrderMaterialsBymcId.do?recordId=${id}`)
      .then((response)=>{
        console.log(response.data,"看看数据");
        let data = response.data.list.map((item)=>{
          return ({name:item.name,size:item.size,count:item.count,materials:item.materials,demand:item.demand});
        })
        this.setState({
          kailiaoData: response.data.list,
          visible2: true,
        });
      })
      .catch((error)=>{
        console.log(error);
      });

  };

  onClose = () => {
    this.setState({
      visible2: false
    });
  };

  render() {
    const { dataSource, kailiaoData } = this.state;
    const id = this.props.id;
    const orderId = this.props.orderId;
    const name = this.props.name;
    const size = this.props.size;
    const count = this.props.count;
    const remarks = this.props.remarks;
    const footer = (
      <a onClick={this.onClose} href="javascript:;">
        Close
      </a>
    );
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
          <Dialog
            style={{ width: 640 }}
            visible={this.state.visible2}
            footer={footer}
            onClose={this.onClose}
            title="开料单"
          >
            <Table dataSource={kailiaoData} >
              <Table.Column title="部件名" dataIndex="name"/>
              <Table.Column title="规格" dataIndex="size"/>
              <Table.Column title="数量" dataIndex="count"/>
              <Table.Column title="材料" dataIndex="materials"/>
              <Table.Column title="要求" dataIndex="demand"/>
            </Table>
          </Dialog>
          <Button onClick={()=>{this.props.redirct()}}>返回</Button>
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
