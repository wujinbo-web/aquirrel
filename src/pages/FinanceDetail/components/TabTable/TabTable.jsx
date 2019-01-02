import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Feedback, Button } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import AddItem from './components/AddItem';
import { financeDetailQuery, financeDetailDelete, financeDetailAdd, financeListQuery } from '@/api/apiUrl';
import { postUrl } from '@/api';
import { Grid } from "@icedesign/base";

const { Row, Col } = Grid;
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
      headData : {},
      dataSource: [],
      tabKey: 'all',
    };
    this.columns = [
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <DeleteBalloon
                handleRemove={() => this.handleRemove(index, record)}
              />
            </span>
          );
        },
      },
    ];
  }

  componentDidMount (){
    this.getHeadData();
    this.getIndexData();
  }

  getHeadData = async () => {
    const response = await postUrl(financeListQuery,{ id:this.props.id});
    let data = response.data.orderMoney;
    this.setState({ headData: data });
  }

  getIndexData = async () => {
    const response = await postUrl(financeDetailQuery,{ parentId: this.props.id });
    let data = response.data.data.map((item)=>{
      return({id:item.id,createTime:item.createTime,money:item.money,typeName:item.type==0?"收入":"支出",remark:item.remark});
    });
    this.setState({ dataSource: { all: data } });
  }

  getFormValues = async (values) => {
    const response = await postUrl(financeDetailAdd,{"detailMoney.parentId":this.props.id,"detailMoney.money":values.money,"detailMoney.remark":values.remark,"detailMoney.type":values.type});
    if(response.data.state=="200"){
      this.getIndexData();
      this.getHeadData();
    }else{
      Toast.error("err,请重试");
    }
  };

  handleRemove = async (index,record) => {
    const response = await postUrl(financeDetailDelete,{id: record.id});
    console.log(response);
    if(response.data.state=="200"){
      const { dataSource, tabKey } = this.state;
      dataSource[tabKey].splice(index, 1);
      this.setState({
        dataSource,
      });
      this.getHeadData();
    }else{
      Toast.error("err,请重试");
    }
  };
  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource, headData } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <IceTitle text={headData.name+"概况"} />
            <div
              style={{
                background:'#eee',
                fontSize: '20px',
                color:'#666',
                height:'100px',
                textAlign:'center',
                paddingTop:'40px'
              }}
          >
            <Row>
              <Col>预计金额:{headData.money}</Col>
              <Col>实际收入:{headData.inMoney}</Col>
              <Col>实际支出:{headData.payMoney}</Col>
            </Row>
          </div>
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
          <AddItem record={{remark:"",type:0,money:""}} getFormValues={this.getFormValues} />
            <Button
              size="small"
              type="primary"
              onClick={()=>this.props.goBack()}
            >返回</Button>
        </IceContainer>
      </div>
    );
  }
}
