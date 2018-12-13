import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback } from '@icedesign/base';
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
      materialList:[],
    };
    this.columns = [
      {
        title: '部件名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '材料',
        dataIndex: 'materials',
        key: 'materials',
      },
      {
        title: '要求',
        dataIndex: 'demand',
        key: 'demand',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <DeleteBalloon handleRemove={() => this.handleRemove(index, record)} />
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {

      //获取主数据
      this.getMainData();
      //获取材料列表
      this.getMaterialList();
  }
  //获取主数据
  getMainData = () => {
    axios
      .get(`${API_URL}/queryOrderMaterialsBymcId.do?recordId=${this.props.recordId}`)
      .then((response) => {
        console.log(response.data,"开料单数据");
        let data=response.data.list.map((item)=>{
          return ({ id: item.id, name: item.name, size: item.size, count:item.count, materials:item.materials, demand:item.demand });
        })
        this.setState({
          dataSource: {all: data},
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getMaterialList = () => {
    axios
      .get(`${API_URL}/qureyMaterialsBy.do`)
      .then((response) => {
        let data=response.data.data.map((item,index)=>{
          return ({ label:item.name, value:item.name});
        });
        this.setState({
          materialList: data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFormValues = (values) => {
    console.log(values);
    axios
      .post(`${API_URL}/saveOrderMaterials.do?orderMaterials.recordId=${this.props.recordId}&orderMaterials.name=${values.name}&orderMaterials.size=${values.size}&orderMaterials.count=${values.count}&orderMaterials.materials=${values.materials}&orderMaterials.demand=${values.demand}`)
      .then((response)=>{
        console.log(response.data);
        if(response.data.state=="success"){
          //清空json里面的值
          this.state.record={name: "",size: "", count: "",materials: "",demand: ""};
          this.setState({});
          Toast.success('添加成功');
          this.getMainData();
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  handleRemove = (index, record) => {
    //record.id  index 序列号
    console.log(index,record);
    axios
      .get(`${API_URL}/deleteOrderMaterials.do?id=${record.id}`)
      .then((response)=>{
        if(response.data.state=="success"){
          Toast.success("删除成功");
          const { dataSource, tabKey } = this.state;
          dataSource[tabKey].splice(index, 1);
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
    const recordId = this.props.recordId;
    const materialNum= this.props.materialNum;
    return (
      <div className="tab-table">
        <IceContainer>
          <h1 style={{ textAlign: "center" }}>开料单</h1>
          <h2 style={styles.formTitle}>订单id：{orderId}；产品名称：{name};规格：{size}；总数量：{count}；本次开料数：{materialNum}；备注：{remarks=="null"?"暂无":remarks}；</h2>
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
          <Button onClick={()=>{this.props.redirct()}}>返回</Button>
          <EditDialog
            materialList = {this.state.materialList}
            record={this.state.record}
            getFormValues={this.getFormValues}
          />
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
  formTitle: {
    margin: '0 0 20px',
    fontSize: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color:'#2077FF',
  },
};
