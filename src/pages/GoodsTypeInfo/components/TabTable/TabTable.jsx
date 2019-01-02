import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';

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
      visible: true,
    };
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
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
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findProductClassByName.do?pageSize=20`)
      .then((response) => {
        // createTime: "2018-11-08 06:07:28"
        // description: "qqqq"
        // id: 1
        // name: "yizi"
        let data=response.data.data.map((item)=>{
          return ({ id:item.id, name: item.name, description: item.description })
        })
        this.setState({
          dataSource: {all: data},
          visible: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFormValues = (dataIndex, values) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    axios
      .get(`${API_URL}/updateProductClass.do?productClass.name=${values.name}&productClass.description=${values.description}&productClass.id=${values.id}`)
      .then((response)=>{
        if(response.data.state=="success"){
          dataSource[tabKey][dataIndex] = values;
          this.setState({
            dataSource,
            visible: false,
          });
        }else{
          Toast.error(response.data.msg);
        }
      })

  };

  handleRemove = (value, index) => {
    this.setState({ visible: true });
    const { dataSource, tabKey } = this.state;
    axios
      .get(`${API_URL}/deleteProductClass.do?id=${dataSource[tabKey][index].id}`)
      .then((response)=>{
        if(response.data.state=="success"){
          dataSource[tabKey].splice(index, 1);
          this.setState({
            dataSource,
            visible: false,
          });
        }else{
          Toast.error(response.data.msg);
        }
      })
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
        </IceContainer>
        </Loading>
      </div>
    );
  }
}
