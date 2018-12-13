import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Input, Button, Grid, Loading, Pagination, Feedback, Select  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

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
      departmentId: "",
      name: "",   //搜索名
      account: "",   //搜索账号
      department: [],  //部门数据
    };
    this.columns = [
      {
        title: '人员id',
        dataIndex: 'id',    //数据的字段名
        key: 'id',
        width: 60,
      },
      {
        title: '账号',
        dataIndex: 'account',    //数据的字段名
        key: 'account',
        width: 120,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 60,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
        width: 100,
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
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
                departmentDate={this.state.department} //传入部门参数
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
    //获取部门接口数据
    axios
      .get(`${API_URL}/findAllDepartment.do`)
      .then((response)=>{
        if(response.data.state=="success"){
          let department = response.data.data.map((item)=>{
            return ({ label: item.departmentName, value: item.id,})
          });
          this.setState({ department });
          //读取完数据开始渲染
          this.getDataSource({
            departmentId:this.state.departmentId,
            account:this.state.account,
            name:this.state.name,
            pageIndex: this.state.current
          });
        }else {
          Toast.error(msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
    //获取人员接口数据
  }
  //封装请求接口
  getDataSource = (params) => {
    this.setState({ visible: true });
    axios
      .post(`${API_URL}/findCmsUserBySearch.do?departmentId=${params.departmentId}&name=${params.name}&account=${params.account}&pageIndex=${params.pageIndex}`)
      .then((response)=>{
        console.log(response.data,"客户接口");
        //将部门id转化为名字进行显示
        let department;
        let data=response.data.data.map((item)=>{
          this.state.department.forEach((list)=>{
            if(list.value==item.departmentId){
              department=list.label;
            }
          })
          return {
            account: item.account,
            name: item.name,
            sex: item.sex==1 ? "男" : "女" ,
            birthday: item.birthday.slice(0,11),
            department,
            departmentId:item.departmentId,
            id:item.id,
            password: item.password,
            roleId: item.roleId
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
  getFormValues = (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    //tabKey：all 代表全部数据
    console.log(values,"修改的数据");
    // account: "155444521"
    // birthday: "2018-11-7"
    // department: "财务部"
    // departmentId: 2
    // id: 21
    // name: "阿迪斯"
    // password: "11111111"
    // sex: "男"
    //id转化为名字
    this.state.department.forEach((list)=>{
      if(list.value==values.departmentId){
        values.department=list.label;
      }
    })
    this.setState({ visible:true });
    axios
      .get(`${API_URL}/updateCmsUser.do?cmsUser.account=${values.account}&cmsUser.name=${values.name}&cmsUser.password=${values.password}&cmsUser.id=${values.id}&cmsUser.birthday=${values.birthday}&cmsUser.sex=${values.sex=="男" ? "1" : "0"}&cmsUser.departmentId=${values.departmentId}&cmsUser.roleId=${values.roleId}`)
      .then((response)=>{
        this.setState({ visible: false });
        if(response.data.state=="success"){
          //成功修改数据
          Toast.success("修改成功");
          this.fnSearch();
          // dataSource[tabKey][dataIndex] = values;
          // this.setState({
          //   dataSource,
          // });
        }else{
          Toast.error(msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })

  };

  //当执行删除操作时
  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    //获取到删除的元素数组
    let deleData=dataSource[tabKey].splice(index, 1);
    //请求删除元素的接口
    this.setState({ visible:true });
    axios
      .get(`${API_URL}/deleteCmsUser.do?id=${deleData[0].id}`)
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
    console.log(current,"页码");
    this.state.current=current;
     this.setState({});
     //请求数据
     console.log(this.state.current,"请求的页面");
     this.getDataSource({departmentId:this.state.departmentId, account:this.state.account,name:this.state.name,pageIndex:this.state.current});
  }
  //获取搜索名
  getSearchName = (value) => {
    this.setState({ name: value });
  }
  //获取搜索手机号
  getSearchPhone = (value) => {
    this.setState({ phone: value });
  }
  //获取表单值
  getValue = (value) => {
    this.setState({departmentId:value});
  }
  //点击搜索
  fnSearch = () => {
    this.getDataSource({departmentId:this.state.departmentId, account:this.state.account,name:this.state.name,pageIndex:this.state.current});
  }
  getSearchName = (value) => {
    this.setState({name: value});
  }
  getSearchAccount = (value) => {
    this.setState({account: value});
  }
  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
            <Row>
              <Col xxs="6" s="4" l="2" align="center">
                名字：
              </Col>
              <Col span="10">
                <Input size="large" placeholder="请输入要搜索的名字" onChange={this.getSearchName} />
              </Col>
            </Row>
            <Row style={ { marginTop: "18px" } }>
              <Col xxs="6" s="4" l="2" align="center">
                账号：
              </Col>
              <Col span="10">
                <Input size="large" placeholder="请输入要搜索的账号" onChange={this.getSearchAccount} />
              </Col>
            </Row>
            <Row style={{ marginTop: "18px" }}>
              <Col xxs="6" s="3" l="3" align="center">
                选择部门：
              </Col>
              <Col span="10">
                  <Select
                    size="large"
                    placeholder="请选择..."
                    onChange={this.getValue}
                    dataSource={this.state.department}
                  />
              </Col>
            </Row>
            <Row style={ { marginTop: "18px" } }>
            <Button type="primary" onClick={this.fnSearch}>搜索</Button>
          </Row>

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
