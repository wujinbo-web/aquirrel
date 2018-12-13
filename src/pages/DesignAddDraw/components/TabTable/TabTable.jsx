import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Loading, Button } from '@icedesign/base';
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
        title: '产品id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '类名',
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
        title: '总数量',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '已开料数',
        dataIndex: 'porderNum',
        key: 'porderNum',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                size="small"
                type="primary"
                onClick={()=>{this.redirct(record)}}
              >
                开料
              </Button>
            </span>
          );
        },
      },
    ];
  }

  redirct = (record) => {
    this.props.redirct(record,this.props.id);
  }
  componentDidMount() {
    this.setState({ visible: true })
    axios
      .get(`${API_URL}/searchMeasureCountByOrderId.do?orderId=${this.props.id}`)
      .then((response) => {
        console.log(response.data.data);
        // 0:
        //   count: "2"    总数
        //   deletFlag: 0
        //   fileAddress: null  图片地址
        //   id: 8
        //   name: "yizi"   类别名
        //   orderId: 12    //订单id
        //   remarks: null      //备注
        //   size: "500*200"      //规格
        let data=response.data.data.map((item)=>{
          return ({
            id:item.measureCount.id,
            name:item.measureCount.name,
            size:item.measureCount.size,
            count:item.measureCount.count,
            pic:item.measureCount.fileAddress,
            remarks: item.measureCount.remarks,
            producedNum: item.measureCount.producedNum,
            porderNum:item.measureCount.porderNum,  //已开料数
            unproducedNum: item.measureCount.unproducedNum,
            installedNum: item.measureCount.installedNum,
            uninstalledNum:item.measureCount.uninstalledNum
          })
        })
        console.log(data);
        this.setState({dataSource: {all: data}, visible: false});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirct2 = () => {
    this.props.redirct2();
  }

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const id = this.props.id;
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <h1 style={{ textAlign: "center" }}>待开料家具表</h1>
          <h2 style={styles.formTitle}>当前订单id：{id}</h2>
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
          <Button onClick={()=>{this.redirct2()}}>返回</Button>
        </IceContainer>
        </Loading>
      </div>
    );
  }
}

const styles = {
  addNewItem: {
    background: '#F5F5F5',
    height: 32,
    lineHeight: '32px',
    marginTop: 20,
    cursor: 'pointer',
    textAlign: 'center',
  },
  formTitle: {
    margin: '0 0 20px',
    fontSize: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color:'#2077FF',
  },
};
