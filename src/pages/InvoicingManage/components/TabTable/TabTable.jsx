import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Loading, Feedback, Pagination } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import AddType from './components/AddType';
import { queryMaterialsTypeList, saveMaterialsTypeList, deleteMaterialsTypeList, updateMaterialsTypeList, postUrl } from '@/api';
import { invoiceCompanyAdd, invoiceCompanyQuery, invoiceCompanyUpdate, invoiceCompanyDelete } from '@/api/apiUrl';

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
      visible: false,
    };
    this.columns = [
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '税号',
        dataIndex: 'TFN',
        key: 'TFN',
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
    this.getIndexData(this.state.current);
  }

  getIndexData = async (page) => {
    this.setState({ visible: true });
    const response = await postUrl(invoiceCompanyQuery);
    //response.data.total
    console.log();
    let data = response.data.CompanyList.map((item)=>{
      return ({ id: item.id, name: item.name, TFN: item.TFN });
    })

    this.setState({ dataSource: { all: data },total: response.data.total, visible: false });

  }

  getFormValues = async (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    const response = await postUrl(invoiceCompanyUpdate,{"company.name": values.name,"company.TFN": values.TFN,"company.id": values.id});
    console.log(response.data);
    if(response.data.state == "200"){
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
    const response = await postUrl(invoiceCompanyDelete,{id:record.id});
    if(response.data.state == "200"){
      Toast.success("删除成功");
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
      });
    }else{
      Toast.error("失败");
    }

  };


  addType = async (values) => {
    //values.name 类别名称
    const response = await postUrl(invoiceCompanyAdd,{"company.name":values.name,"company.TFN":values.TFN});
    console.log(response.data);
    if(response.data.state == "200"){
      Toast.success("添加成功");
      this.getIndexData(this.state.current);
    }else{
      Toast.error(response.data.infor);
    }
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <IceTitle text="开票管理" />
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
        </IceContainer>
        </Loading>
      </div>
    );
  }
}
