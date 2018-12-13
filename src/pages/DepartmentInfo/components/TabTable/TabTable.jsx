import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';

const TabPane = Tab.TabPane;
const Toast = Feedback.toast;

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
      visible: true,
    };
    this.columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '部门描述',
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
    //查询部门数据
    axios
      .get(`${API_URL}/findAllDepartment.do`)
      .then((response) => {
        this.setState({visible:false});
        if(response.data.state=="success"){
          let data=response.data.data.map((item)=>{
            return ({name: item.departmentName, leadingId:item.departmentHeadId ,description:item.departmentDescription, id: item.id });
          });
          this.setState({
            dataSource: { all: data },
          });
        }else {
          Toast.error(msg);
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }
  //修改值
  getFormValues = (dataIndex, values) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    // description: "这是一个负责财务的部门"
    // id: 2
    // leadingId: "2"
    // name: "财务部"
    axios
      .get(`${API_URL}/updateDepartment.do?department.id=${values.id}&department.departmentName=${values.name}&department.departmentHeadId=${values.leadingId}&department.departmentDescription=${values.description}`)
      .then((response)=>{
          this.setState({ visible: false });
          if(response.data.state=="success"){
            Toast.success("修改成功")
            //页面修改
            dataSource[tabKey][dataIndex] = values;
            this.setState({
              dataSource,
            });
          }else{
            Toast.error(msg);
          }
      })
      .catch((error)=>{
        console.log(error);
      })
  };
  //移除当前项
  handleRemove = (value, index) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    //删除的项目参数
    let data=dataSource[tabKey].splice(index, 1);
    console.log(data);
    axios
      .get(`${API_URL}/deleteDepartment.do?id=${data[0].id}`)
      .then((response) => {
        this.setState({visible:false});
        if(response.data.state=="success"){
          Toast.success("删除成功");
          this.setState({
            dataSource,
          });
        }else {
          Toast.error(msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
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
          </Loading>
        </IceContainer>
      </div>
    );
  }
}
