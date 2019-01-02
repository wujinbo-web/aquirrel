import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import FindDetail from './components/FindDetail';
import AddPutOut from './components/AddPutOut';
import { postQueryMaterials, postAddRecord, queryInOutMaterials, deleteInOutList } from './../../../../api';

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
        title: '创建者',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '详情',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <FindDetail record={record} index={index} />
              <DeleteBalloon handleRemove={()=>this.handleRemove(record,index)}  />
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getIndexData(this.state.current);

  }

  typeToName = (type) => {
    let name;
    switch (type) {
      case 0:
        name="进货审核中";
        break;
      case 1:
        name="审核通过";
        break;
      case 2:
        name="审核未通过";
        break;
      case 3:
        name="出货完成";
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
    const response = await queryInOutMaterials({ type: 3,pageIndex: current });
    let dataSource = response.data.data.map((item)=>{
      return ({id:item.id,createTime:item.createTime,checkTime:item.checkTime,name:item.name,typeName:this.typeToName(item.type)});
    });
    this.setState({
      dataSource: { all: dataSource },
      total: response.data.total,
      visible: false,
    });
  }

  //获取材料列表
  // getMaterialsList = async () => {
  //   this.setState({ visible: true });
  //   const response = await postQueryMaterials({pageSize:50});
  //   let materialsList = response.data.data.map((item)=>{
  //     return ({label:item[0].name,value:item[0].id});
  //   })
  //   this.setState({ materialsList, visible: false });
  // }

  //删除进货单记录
  handleRemove = async (record,index) => {
    //record id="1f7161bb11e1401da68451405c67dcad"
    let response = await deleteInOutList({ id: record.id });
    console.log(response.data);
    if(response.data.state == "success"){
      const { dataSource, tabKey } = this.state;
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
      });
    }else{
      Toast.error(response.data.msg);
    }

  };

  //添加出货记录单
  getFormValues = async (json) => {
    this.setState({ visible: true });
    let dataJson = json.map((item)=>{
      return JSON.stringify(item);
    })
    let data = dataJson.join(',');
    const response = await postAddRecord({ uuid:json[0].materialsRecordId,  type:3, json: `[${data}]` });
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
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <AddPutOut getFormValues={this.getFormValues}  />
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
