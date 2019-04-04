import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading, Pagination, Button, Select, Input } from '@icedesign/base';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { postUrl } from '@/api';
import { queryGoods, deleteGoods, updateGoods, queryGoodsType, queryGoodsSeries } from '@/api/apiUrl';

const TabPane = Tab.TabPane;
const Toast=Feedback.toast;

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
      current: 1, //当前页码
      visible: true,
      total: 1,  //总数
      typeList: [],  //类型列表
      seriesList: [],  //系列列表
      shaixuan: {
        name:'',
        typeId: '',
        seriesId: '',
      },
    };
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品类别',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '商品系列',
        dataIndex: 'seriesName',
        key: 'seriesName',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
    this.getIndexData();
    this.getTypeData();
    this.getSeriesData();
  }

  //获取首页数据
  getIndexData = async () => {
    this.setState({ visible: true });
    let { shaixuan } = this.state;
    let response = await postUrl(queryGoods, {
      name: shaixuan.name,
      pageIndex: this.state.current,
      pageSize: 10,
      classId: shaixuan.typeId,
      deptId: shaixuan.seriesId,
    });
    if(response.data.state=="success"){
      let data = response.data.data.map(item=>{
        return({
          id: item[0].id,
          name: item[0].name,
          classId: item[0].classId,
          deptId: item[0].deptId,
          description: item[0].description,
          typeName: item[1].name,
          seriesName: item[2].name,
        })
      });
      this.setState({
        dataSource: { all: data },
        visible: false,
        total: response.data.total,
      })
    }
  }

  //获取类别列表
  getTypeData = async () => {
    let response = await postUrl(queryGoodsType,{pageIndex: 1, pageSize: 9999});
    this.state.typeList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //获取系列列表
  getSeriesData = async () => {
    let response = await postUrl(queryGoodsSeries,{pageIndex: 1, pageSize: 9999});
    this.state.seriesList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //修改数据
  getFormValues = async (dataIndex, values) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    let response = await postUrl(updateGoods,{
      "productClass.id": values.id,
      "productClass.name": values.name,
      "productClass.classId": values.classId,
      "productClass.deptId": values.deptId,
      "productClass.description":values.description,
    });
    this.setState({ visible: false });
    if(response.data.state=="success"){
      Toast.success("修改成功");
      this.getIndexData();
    }else{
      Toast.error(response.data.msg);
    }
  };

  //删除商品
  handleRemove = async (value, index, record) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    let response = await postUrl(deleteGoods,{ id: record.id });
    if (response.data.state=="success") {
      Toast.success("删除成功");
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
        visible: false,
      });
    }else{
      Toast.error("网络异常，请刷新重试");
    }
  };

  //切换页码
  handleChange = (current) => {
    this.state.current = current;
    this.getIndexData();
    this.setState({});
  }

  //搜索值改变
  changeValue = (type, value) => {
    this.state.shaixuan[type]=value;
    this.setState({});
  }

  //重置筛选
  reset = () => {
    this.state.shaixuan={name:"",typeId: "",seriesId:""};
    this.setState({})
    this.getIndexData();
  }

  render() {
    const { dataSource, typeList, seriesList, shaixuan } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <div style={styles.shaixuan}>
            筛选条件：
            <Input
              value={shaixuan.name}
              placeholder="请输入商品名"
              style={styles.shaixuan_input}
              onChange={this.changeValue.bind(this,"name")}
            />
            <Select
              placeholder="请选择类别"
              dataSource={typeList}
              value={shaixuan.typeId==""?null:shaixuan.typeId}
              style={styles.shaixuan_select}
              onChange={this.changeValue.bind(this,"typeId")}
            />
            <Select
              placeholder="请选择系列"
              dataSource={seriesList}
              value={shaixuan.seriesId==""?null:shaixuan.seriesId}
              style={styles.shaixuan_select}
              onChange={this.changeValue.bind(this,"seriesId")}
            />
          <Button type="primary" size="small" onClick={this.getIndexData} style={styles.btn}>搜索</Button>
            <Button type="default" size="small" onClick={this.reset} >重置</Button>
          </div>
        </IceContainer>
        <IceContainer>
          <Tab >
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
          <Pagination current={this.state.current} total={this.state.total} onChange={this.handleChange} />
        </IceContainer>
        </Loading>
      </div>
    );
  }
}
const styles={
  shaixuan:{
    padding: "20px",
  },
  shaixuan_input:{
    height: "27px",
    marginRight: "10px",
    marginLeft: "5px",
  },
  shaixuan_select:{
    width:"200px",
    marginRight: "10px",
    verticalAlign: "middle",
  },
  btn:{
    marginRight:"10px"
  }
}
