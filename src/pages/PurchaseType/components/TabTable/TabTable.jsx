import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Loading, Feedback, Pagination, Button } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import AddType from './components/AddType';
import { queryMaterialsTypeList, saveMaterialsTypeList, deleteMaterialsTypeList, updateMaterialsTypeList } from '@/api';

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
        title: '材料厂家名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                type="primary"
                size="small"
                style={{marginRight: "5px"}}
                onClick={this.props.go.bind(this,`/purchase/type2?id=${record.id}&name=${record.name}`)}
              >查看二级分类</Button>
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
    this.getIndexData(this.state.current);
  }

  getIndexData = async (page) => {
    this.setState({ visible: true });
    const response = await queryMaterialsTypeList({ pageIndex: page });
    //response.data.total
    console.log(response.data);
    if(response.data.state=="success"){
      let data = response.data.data.map((item)=>{
        return ({ id: item.id, name: item.name });
      });
      this.setState({ dataSource: { all: data },total: response.data.total, visible: false });
    }
  }

  getFormValues = async (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    const response = await updateMaterialsTypeList({"materialsClass.name": values.name, "materialsClass.id": values.id});
    console.log(response.data);
    if(response.data.infor == "200"){
      Toast.success("修改成功");
      dataSource[tabKey][dataIndex] = values;
      this.setState({
        dataSource,
      });
    }else{
      Toast.error("失败");
    }

  };

  handleRemove = async (value, index, record) => {
    const { dataSource, tabKey } = this.state;
    const response = await deleteMaterialsTypeList({ id: record.id  });
    if(response.data.infor == "200"){
      Toast.success("删除成功");
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
      });
    }else{
      Toast.error("失败");
    }

  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  addType = async (values) => {
    //values.name 类别名称
    const response = await saveMaterialsTypeList({ "materialsClass.name": values.name });
    if(response.data.infor == "200"){
      Toast.success("添加成功");
      this.getIndexData(this.state.current);
    }else{
      Toast.error(response.data.infor);
    }
  }

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
          <AddType addType={this.addType} />
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
