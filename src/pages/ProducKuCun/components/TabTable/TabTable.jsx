import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading, Pagination, Select, Grid  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { postQueryMaterials, postAddMaterials, postDeleteMaterials, postUpdateMaterials, queryMaterialsTypeList } from '@/api';
import { queryPurchaseType } from '@/api/apiUrl';
import { postUrl } from '@/api';
import { factoryList } from '@/tool/factoryList';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;

const tabs = [
  { tab: '全部', key: 'all' }
];
const { Row, Col } = Grid;

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
      customData: [],
      classId: "",
      factory: 1,
      pinPaiNow: [],
      customData2: [],  //所有品牌列表
      deptId: "",
    };
    this.columns = [
      {
        title: '生产厂家',
        dataIndex: 'typeName',
        key: 'typeName',
        width: 80,
      },
      {
        title: '厂家品牌',
        dataIndex: 'deptName',
        key: 'deptName',
        width: 80,
      },
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '库存数量',
        dataIndex: 'nowNum',
        key: 'nowNum',
        width: 100,
      },
      {
        title: '总入库数',
        dataIndex: 'putNum',
        key: 'putNum',
        width: 100,
      },
      {
        title: '总出库数',
        dataIndex: 'outNum',
        key: 'outNum',
        width: 100,
      },
    ];
  }

  componentDidMount() {
    this.getTypeData();
  }

  //修改页码
  handleChange = (current) => {
    this.state.current=current;
     this.setState({});
     //请求数据
     this.getIndexData();
  }

  typeIdToName = (id) => {
    if(id==null)return "";
    let { customData2 } = this.state;
    return customData2.filter(item=>item.value==id)[0].label;
  }

  //获取 全部品牌类别类别
  getTypeData2 = async () =>{
    this.setState({ visible: true });
    const response = await postUrl(queryPurchaseType,{ pageSize: 999 });
    let customData2=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    this.setState({
      visible:false,
      customData2,
    });
  }

  //获取查询数据
  getIndexData = async () => {
    this.setState({visible:true});
    let { current, classId, factory } = this.state;
    const data = await postQueryMaterials({pageIndex: current,classId,factoryId:factory});
    if(data.data.state="success"){
      //data.data.total  总数  data.data.pageIndex 页码
      let dataSource = data.data.data.map((item)=>{
        return({
          id:item[0].id,
          name:item[0].name,
          nowNum:item[0].nowNum,
          putNum:item[0].putNum,
          outNum:item[0].outNum,
          typeName:item[1].name,
          price:item[0].price,
          priceCount: Number(item[0].price) * Number(item[0].putNum),
          classId: item[0].classId,
          deptId: item[0].deptId,
          deptName: this.typeIdToName(item[0].deptId),
        });
      });
      this.setState({ dataSource:{all:dataSource},total: data.data.total,visible:false, });
    }
  }

  getTypeData = async () =>{
    this.setState({ visible: true });
    const response = await queryMaterialsTypeList({ pageSize: 50 });
    let customData=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    customData.splice(0,0,{label:"全部分类", value: ""});
    this.setState({
      visible:false,
      customData,
    });
    this.getIndexData();
  }


  //无用
  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  changeSearch = (name, value) => {
    if(name=="type"){
      //选择了厂家
      this.state.deptId="";
      this.getPinPaiNow(value);
      this.state.classId=value;
    }else if(name=="type2"){
      this.state.deptId=value;
    }else if (name="factory"){
      this.state.factory=value
    }
    this.setState({});
    this.getIndexData();
  }

  getPinPaiNow = async (factoryId) => {
    const response = await postUrl(queryPurchaseType,{ pageSize: 999, factoryId });
    let pinPaiNow=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    pinPaiNow.splice(0,0,{label:'全部',value: ''});
    this.setState({
      visible:false,
      pinPaiNow,
    });
  }

  render() {
    const { dataSource, customData, pinPaiNow, deptId } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <h2 style={{textAlign:"center"}}>查看库存</h2>
            <Row>
              <Col span="2" style={{lineHeight:"32px", textAlign: "center"}}>
                材料厂家：
              </Col>
              <Col span="4">
                <Select
                  size="large"
                  placeholder="请选择..."
                  dataSource={customData}
                  onChange={this.changeSearch.bind(this,"type")}
                  style={{ width:"100%" }}
                />
              </Col>
              <Col span="2" style={{lineHeight:"32px", textAlign: "center"}}>
                厂家品牌：
              </Col>
              <Col span="4">
                <Select
                  size="large"
                  placeholder="请选择..."
                  dataSource={pinPaiNow}
                  value={deptId}
                  onChange={this.changeSearch.bind(this,"type2")}
                  style={{ width:"100%" }}
                />
              </Col>
              <Col span="2" style={{lineHeight:"32px", textAlign: "center"}}>
                工厂：
              </Col>
              <Col span="4">
                <Select
                  size="large"
                  placeholder="请选择..."
                  dataSource={ factoryList }
                  style={{ width:"100%" }}
                  defaultValue={[{label:"南京厂", value: 1}]}
                  onChange={this.changeSearch.bind(this,"factory")}
                />
              </Col>
            </Row>
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
