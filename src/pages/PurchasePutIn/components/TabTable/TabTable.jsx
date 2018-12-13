import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import FindDetail from './components/FindDetail';
import AddPutIn from './components/AddPutIn';
import WriteList from './components/WriteList';
import { postQueryMaterials, postAddRecord, queryInOutMaterials, upDateInOutMaterialsState } from './../../../../api';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;

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
      materialsList: [], //材料列表
      current: 1,
      total:0,
      visible: false,
    };
    this.columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '到货时间',
        dataIndex: 'checkTime',
        key: 'checkTime',
      },
      {
        title: '创建者',
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '状态',
        dataIndex: 'typeName',
        key: 'typeName',
        width: 100,
      },
      {
        title: '详情',
        key: 'action',
        width: 210,
        render: (value, index, record) => {
          return (
            <span>
              <FindDetail record={record} index={index} />
              {
                record.type==0?<WriteList record={record} index={index} writeList={this.writeList} />:""
              }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getMaterialsList();
    this.getIndexData(this.state.current);

  }

  //确认收货
  writeList = async (dataSource) => {
    let dataSource2 = dataSource.map((item)=>{
      return(JSON.stringify(item));
    })
    let json = `[${dataSource2.join(",")}]`;
    const response = await upDateInOutMaterialsState({ type:1, id:dataSource[0].materialsRecordId, json });
    if(response.data.state == "success"){
      Toast.success(response.data.msg);
      this.getIndexData(this.state.current);
    }else{
      Toast.error(response.data.msg);
    }
  }

  typeToName = (type) => {
    let name;
    switch (type) {
      case 0:
        name="待收货";
        break;
      case 1:
        name="确认收货";
        break;
      default:
        name= "状态错误";
        break;
    }
    return name;
  }

  //获取首页数据
  getIndexData = async (current) => {
    this.setState({ visible: true });
    const response = await queryInOutMaterials({ type: 5,pageIndex: current });
    let dataSource = response.data.data.map((item)=>{
      return ({
        id:item.id,
        createTime:item.createTime,
        checkTime:item.checkTime,
        name:item.name,
        type:item.type,
        typeName:this.typeToName(item.type),
        remark: item.remark,
      });
    });
    this.setState({
      dataSource: { all: dataSource },
      total: response.data.total,
      visible: false,
    });
  }

  //获取材料列表
  getMaterialsList = async () => {
    this.setState({ visible: true });
    const response = await postQueryMaterials({pageSize:50});
    let materialsList = response.data.data.map((item)=>{
      return ({label:item[0].name,value:item[0].id});
    })
    this.setState({ materialsList, visible: false });
  }

  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].splice(index, 1);
    this.setState({
      dataSource,
    });
  };

  //添加进货记录单
  getFormValues = async (json,remark) => {
    this.setState({ visible: true });
    let dataJson = json.map((item)=>{
      return JSON.stringify(item);
    })
    let data = dataJson.join(',');
    const response = await postAddRecord({
      uuid:json[0].materialsRecordId,
      type:0,
      json: `[${data}]`,
      remark  ,
    });
    if(response.data.state=="success"){
      Toast.success(response.data.msg);
      this.getIndexData(this.state.current);
    }else{
      Toast.error(response.data.msg);
    }
    this.setState({ visible: false });
  }

  //没用
  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  //修改页码
  handleChange = (current) => {
    this.state.current=current;
     this.setState({});
     //请求数据
     this.getIndexData(this.state.current);
  }

  render() {
    const { dataSource, materialsList } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <AddPutIn getFormValues={this.getFormValues} materialsList={materialsList} />
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
