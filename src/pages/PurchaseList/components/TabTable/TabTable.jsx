import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading, Pagination, Select, Grid, Input, Button  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import AddGoods from './components/AddGoods';
import DeleteBalloon from './components/DeleteBalloon';
import { postQueryMaterials, postAddMaterials, postDeleteMaterials, postUpdateMaterials, queryMaterialsTypeList } from '@/api';
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
      factory: 1,  //工厂id
      name: "",  //模糊搜索的名字
    };
    this.columns = [
      {
        title: '类别',
        dataIndex: 'typeName',
        key: 'typeName',
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
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 80,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 80,
      },
      {
        title: '合计',
        dataIndex: 'priceCount',
        key: 'priceCount',
        width: 100,
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                index={index}
                record={record}
                getFormValues={this.getFormValues}
              />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getTypeData();
  }

  //修改页码
  handleChange = (current) => {
    let { classId, factory, name } = this.state;
    this.state.current=current;
     this.setState({});
     //请求数据
     this.getIndexData(this.state.current,classId, factory, name);
  }

  //获取查询数据
  getIndexData = async (pageIndex,classId,factoryId=1,name) => {
    this.setState({visible:true});
    const data = await postQueryMaterials({pageIndex,classId,factoryId,name});
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
          unit: item[0].unit,
        });
      });
      this.setState({ dataSource:{all:dataSource},total: data.data.total,visible:false, });
    }
  }

  //获取列别
  getTypeData = async () =>{
    let { current, classId, factory, name } = this.state;
    this.setState({ visible: true });
    const response = await queryMaterialsTypeList({ pageSize: 50 });
    console.log(response);
    let customData=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    customData.splice(0,0,{label:"全部分类", value: ""});
    this.setState({
      visible:false,
      customData,
    });
    this.getIndexData(current,classId,factory,name);
  }

  //修改入库数出库数
  getFormValues = async (dataIndex, values) => {
    let { factory } = this.state;
    console.log(factory,"？？");
    //id: 17,name: "钢铁直男2",nowNum: 0,outNum: "3",putNum: "3"
    this.setState({visible:true});
    let params = {
      "materialsMain.id": values.id,
      "materialsMain.name":values.name,
      "materialsMain.putNum":values.putNum,
      "materialsMain.outNum":values.outNum,
      "materialsMain.nowNum":Number(values.putNum) - Number(values.outNum),
      "materialsMain.price":values.price,
      "materialsMain.classId":values.classId,
      "materialsMain.factoryId":factory,
      "materialsMain.unit":values.unit,
    };
    const response = await postUpdateMaterials(params);
    if(response.data.msg=="200"){
      Toast.success("修改成功");
      const { dataSource, tabKey } = this.state;

      dataSource[tabKey][dataIndex] = values;
      dataSource[tabKey][dataIndex].priceCount=Number(values.price) * Number(values.putNum);
      dataSource[tabKey][dataIndex].nowNum = Number(values.putNum) - Number(values.outNum);
      this.setState({
        dataSource,
      });
    }else{
      Toast.success(response.data.msg);
    }
    this.setState({visible:false});
  };

  //删除材料
  handleRemove = async (value, index, record) => {
    this.setState({visible:true});
    //record.id
    const response = await postDeleteMaterials({ id: record.id });
    if(response.data.msg=="200"){
      const { dataSource, tabKey } = this.state;
      Toast.success("成功");
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
      });
    }else{
      Toast.error("失败");
    }
    this.setState({visible:false});
  };

  //无用
  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  //添加名字
  addMaterialName = async (values) => {
    this.setState({visible:true});
    const response = await postAddMaterials(
      {
        "materialsMain.name":values.name,
        "materialsMain.classId": values.type,
        "materialsMain.price": values.price,
      }
    );
    if(response.data.msg=="200"){
      Toast.success("添加成功");
      //查询一遍
      this.getIndexData(this.state.current,this.state.classId,this.state.factory);
    }else {
      Toast.error(response.data.msg);
    }
    this.setState({visible:false});
  }

  changeSearch = (type, value) => {
    if(type=="type"){
      this.state.classId=value;
    }else if (type=="factory"){
      this.state.factory=value;
    }
    this.setState({});
    this.getIndexData(this.state.current,this.state.classId, this.state.factory, this.state.name);
  }

  render() {
    const { dataSource, customData } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <h2 style={{textAlign:"center"}}>材料库</h2>
          <Row style={{ marginBottom: "10px" }}>
            <Col span="2" style={{lineHeight:"32px", textAlign: "center"}}>
              类别：
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
          <Row>
            <Col span="2" style={{lineHeight:"32px", textAlign: "center"}}>
              名称：
            </Col>
            <Col span="4">
              <Input
                placeholder="请输入商品名称"
                onChange={(value)=>{this.setState({name: value})}}
                style={{ width: "100%", marginRight: "10px" }}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={this.changeSearch}>模糊搜索</Button>
            </Col>
          </Row>

          <AddGoods addMaterialName={this.addMaterialName} />
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
