import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import { API_URL } from './../../../../config';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';

const TabPane = Tab.TabPane;
const Toast = Feedback.toast;

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
      visible: true,
    };
    this.columns = [
      {
        title: '材料id',
        dataIndex: 'id',
        key: 'id',
        width: 70,
      },
      {
        title: '材料名',
        dataIndex: 'name',
        key: 'name',
        width: 70,
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: 70,
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 140,
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
    this.setState({visible: true});
    axios
      .get(`${API_URL}/qureyMaterialsBy.do`)
      .then((response) => {
        let data=response.data.data.map((item)=>{
          return ({id:item.id,name:item.name,size:item.size,count:item.count,remarks:item.remarks});
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
    this.setState({visible: true});
    const { dataSource, tabKey } = this.state;
    axios
      .get(`${API_URL}/updateMaterials.do?materials.id=${values.id}&materials.name=${values.name}&materials.size=${values.size}&materials.count=${values.count}&materials.remarks=${values.remarks}`)
      .then((response)=>{
        console.log(response.data);
        if(response.data.msg=="200"){
          dataSource[tabKey][dataIndex] = values;
          this.setState({
            dataSource,
            visible: false,
          });
          Toast.success("修改成功");
        }else{
          Toast.error(response.data.msg);
        }

      })
      .catch((error)=>{
        console.log(error);
      })

  };

  handleRemove = (value, index, record) => {
    this.setState({visible: true});
    const { dataSource, tabKey } = this.state;
    axios
      .get(`${API_URL}/deleteMaterials.do?id=${record.id}`)
      .then((response)=>{
        if(response.data.msg=="200"){
          dataSource[tabKey].splice(index, 1);
          this.setState({
            dataSource,
            visible: false,
          });
          Toast.success("删除成功");
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
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
