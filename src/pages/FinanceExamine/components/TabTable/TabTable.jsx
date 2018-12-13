import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import FindDetail from './components/FindDetail';
import Success from './components/Success';
import Faier from './components/Faier';
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
        title: '记录id',
        dataIndex: 'id',
        key: 'id',
      },
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
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '状态',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '详情',
        key: 'action',
        width: '260',
        render: (value, index, record) => {
          return (
            <span>
              <FindDetail record={record} index={index} />
            </span>
          );
        },
      },
    ];
  }

  // <Success handleRemove={ () => this.success(index,record)} />
  // <Faier handleRemove={ () => this.faier(index,record) }/>
  //
  // //通过回调
  // success = async (index,record) => {
  //   this.setState({visible:true});
  //   //record.id   type=1
  //   const response = await upDateInOutMaterialsState({ id: record.id, type: 1 });
  //   if(response.data.state=="success"){
  //     Toast.success("已通过");
  //     this.state.dataSource["all"].splice(index,1);
  //     this.setState({visible:false});
  //   }else{
  //     Toast.error(response.data.msg);
  //   }
  // }
  //
  // //拒绝回调
  // faier = async (index,record) => {
  //   this.setState({visible:true});
  //   //record.id   type=2
  //   const response = await upDateInOutMaterialsState({ id: record.id, type: 2 });
  //   if(response.data.state=="success"){
  //     Toast.success("已拒绝");
  //     this.state.dataSource["all"].splice(index,1);
  //     this.setState({visible:false});
  //   }else{
  //     Toast.error(response.data.msg);
  //   }
  // }

  componentDidMount() {
    this.getIndexData(this.state.current);
  }

  typeToName = (type) => {
    let name;
    switch (type) {
      case 0:
        name="待收货";
        break;
      case 1:
        name="已收货";
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
        name:item.name,
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
