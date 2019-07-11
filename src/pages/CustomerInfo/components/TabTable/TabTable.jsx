import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Input, Button, Grid, Loading, Pagination, Feedback  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';
import { postUrl } from '@/api';
import { updateUserInfo } from '@/api/apiUrl';

const TabPane = Tab.TabPane;
const { Row, Col } = Grid;
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
      dataSource: {},   //数据
      tabKey: 'all',     //数据分类
      visible: true,    //加载框是否显示
      current: 1,    //当前页面
      total: 0,   //总页数
      name: "",   //搜索名
      phone: "",   //搜索手机号
    };
    this.columns = [
      {
        title: '用户名称',
        dataIndex: 'name',    //数据的字段名
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '用户手机',
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '用户地址',
        dataIndex: 'address',
        key: 'address',
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
  //挂载之后请求接口数据
  componentDidMount() {
    //接口
    this.getDataSource({name:this.state.name,phone:this.state.phone,pageIndex: 1});
  }
  //封装请求接口
  getDataSource = (params) => {
    this.setState({ visible: true });
    axios
      .post(`${API_URL}/findCustomerList.do?name=${params.name}&phone=${params.phone}&pageIndex=${params.pageIndex}`)
      .then((response)=>{
        console.log(response.data,"客户接口");
        let data=response.data.data.map((item)=>{
          return {
            name: item.customer.name,
            sex: item.customer.sex == 1 ? "男" : "女",
            tel: item.customer.phone,
            address: item.customer.address,
            listnum: item.ordersCount,
            id: item.customer.id,
            companyName: item.customer.companyName,
            TFN: item.customer.TFN
          }
        });
        this.setState({
          dataSource: {all: data},
          visible: false,
          current: Number(params.pageIndex),
          total: response.data.total,
        });
      })
      .catch((error) => {
        console.log(error,"错误");
      });
  }
  //获取表单数据 ，提交修改
  getFormValues = async (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    this.setState({ visible:true });

    let response = await postUrl(updateUserInfo,{
      "customer.TFN": values.TFN,
      "customer.name": values.name,
      "customer.companyName": values.companyName,
      "customer.id": values.id,
      "customer.sex": values.sex=="男"? 1 : 0,
      "customer.phone": values.tel,
      "customer.address": values.address,
      "customer.bank": values.bank,
      "customer.bankNum": values.bankNum,
      "customer.telephone": values.telephone,
    })
    if(response.data.state=="success"){
      //成功修改数据
      Toast.success("修改成功");
      dataSource[tabKey][dataIndex] = values;
      this.setState({
        dataSource,
      });
    }else{
      Toast.error(response.data.msg);
    }
    this.setState({ visible:false });
  };

  //当执行删除操作时
  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    //获取到删除的元素数组
    let deleData=dataSource[tabKey].splice(index, 1);
    //请求删除元素的接口
    this.setState({ visible:true });
    axios
      .get(`${API_URL}/deleteCustomer.do?id=${deleData[0].id}`)
      .then((response)=>{
        console.log(response.data);
        this.setState({ visible: false });
        if(response.data.state == "success"){
          Toast.success("删除成功");
          this.setState({
            dataSource,
          });
        }else {
          Toast.error(msg);
        }
      })
      .catch((error)=>{
        console.log(error,"错误");
      })
  };

  //当筛选条件改变时   ***暂时用不到
  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };
  //修改页码
  handleChange = (current) => {
   this.setState({
     current
   });
   //请求数据
   this.getDataSource({name:this.state.name,phone:this.state.phone,pageIndex: current});
  }
  //获取搜索名
  getSearchName = (value) => {
    this.setState({ name: value });
  }
  //获取搜索手机号
  getSearchPhone = (value) => {
    this.setState({ phone: value });
  }
  //点击搜索
  fnSearch = () => {
    this.getDataSource({name:this.state.name,phone:this.state.phone,pageIndex: this.state.current});
  }
  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <IceContainer>
          <Row>
            <Col xxs="6" s="4" l="2" align="center">
              用户名：
            </Col>
            <Col span="10">
              <Input size="large" placeholder="请输入要搜索的用户名" onChange={this.getSearchName} />
            </Col>
          </Row>
          <Row style={ { marginTop: "18px" } }>
            <Col xxs="6" s="4" l="2" align="center">
              手机号：
            </Col>
            <Col span="10">
              <Input size="large" placeholder="请输入要搜索的手机号" onChange={this.getSearchPhone} />
            </Col>
          </Row>
          <Row style={ { marginTop: "18px" } }>
            <Button type="primary" onClick={this.fnSearch}>搜索</Button>
          </Row>

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

          <Pagination current={this.state.current} onChange={this.handleChange} total={this.state.total} />
        </IceContainer>
      </div>
    );
  }
}
