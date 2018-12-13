import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Dialog, Form, Input, Select, Field, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { API_URL } from '../../../../config';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;
const FormItem = Form.Item;

const tabs = [
  { tab: '全部', key: 'all' },
];

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.field = new Field(this);
    this.state = {
      dataSource: {},
      tabKey: 'all',
      visible: false, //新增弹出框
      listDataSource: [],  //产品分类下拉框
      visible2: true,
    };
    this.columns = [
      {
        title: '产品类别',
        dataIndex: 'name',
        key: 'name',
        width: 80,
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: 80,
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        width: 50,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 100,
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (value, index, record) => {
          return (
            <span>
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

      this.getMeasureData();
      this.getGoodsType();
  }
  //获取测量表数据
  getMeasureData = () => {
    this.setState({visible2: true});
    axios
      .get(`${API_URL}/findMeasurBy.do?orderId=${sessionStorage.design_orderId}&Floor=${sessionStorage.design_floorNum}&Room=${sessionStorage.design_roomNum}`)
      .then((response) => {
        console.log(response.data,"测量单数据");
          // classId: 0
          // count: 5          数量
          // deleteFlag: 0
          // fileAddress: null
          // floor: 2
          // id: 2
          // name: "柜子"       类别名
          // orderId: 1
          // remarks: null
          // room: "0"
          // size: "180*120"   规格
          // state: 0
          let data=response.data.list.map((item)=>{
            return ({name:item.name ,size:item.size ,count:item.count, remarks: item.remarks, id: item.id });
          });
          this.setState({ dataSource: {all: data}, visible2: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //获取商品列表
  getGoodsType = () => {
    axios
      .get(`${API_URL}/findProductClassByName.do`)
      .then((response)=>{
        console.log(response.data,"类目数据");
        // data:[
        //   {
        //     createTime："2018-11-08..."
        //     description: "描述"
        //     id：1  商品id
        //     name: "椅子"
        //   }
        // ]
        // pageIndex:1 当前页码
        // total:2  当前总数
        let data=response.data.data.map((item)=>{
          return({ label:item.name, value: item.id});
        });
        this.setState({ listDataSource: data });
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  handleRemove = (value, index) => {
    this.setState({visible2: true});
    const { dataSource, tabKey } = this.state;
    axios
      .get(`${API_URL}/deleteMeasure.do?id=${dataSource[tabKey][index].id}`)
      .then((response)=>{
        if(response.data.state=="success"){
          let data=dataSource[tabKey].splice(index, 1);
          this.setState({
            dataSource,
            visible2: false
          });
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
  };

  onOpen = () => {
    this.setState({visible: true});
  }

  //弹出框取消
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  //确认提交
  handleSubmit = () => {
    this.field.validate((error,values)=>{
      if(error!=null) return;
      // console.log(values);
      // classId: 2
      // count: "100"
      // size: "100*100"
      //remarks： "备注"
      let remarks=values.remarks;
      if(values.remarks==undefined){
        remarks="";
      }
      axios
        .get(`${API_URL}/saveMeasure.do?measure.orderId=${sessionStorage.design_orderId}&measure.name=${this.setGoodsTypeName(values.classId)}&measure.size=${values.size}&measure.count=${values.count}&measure.floor=${sessionStorage.design_floorNum}&measure.room=${sessionStorage.design_roomNum}&measure.classId=${values.classId}&measure.remarks=${remarks}`)
        .then((response)=>{
          if(response.data.state=="success"){
            this.setState({
              visible: false,
            });
            Toast.success(response.data.msg);
            this.getMeasureData();
          }else {
            Toast.error(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        })
    });
  };

  //类别ID转类别名称
  setGoodsTypeName = (id) => {
    let name;
    this.state.listDataSource.forEach((item)=>{
      if(item.value==id){
        name=item.label;
      };
    });
    return name;
  }

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };
returnFloor= () => {
  this.props.returnFloor();
}
  render() {
    const { init, getValue } = this.field;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible2} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <h2 style={styles.formTitle} >
            {`当前订单id：${sessionStorage.design_orderId},当前楼层：${sessionStorage.design_floorNum},当前房间号：${sessionStorage.design_roomNum}`}
          </h2>
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

          <Button type="primary" style={{ marginRight: "5px" }} onClick={  ()=>{this.onOpen()}  }>新增测量</Button>
          <Button type="primary" onClick={  ()=>{this.returnFloor()}  }>返回楼层</Button>
            <Dialog
              visible={this.state.visible}
              onOk={this.handleSubmit}
              closable="esc,mask,close"
              onCancel={this.onClose}
              onClose={this.onClose}
              title="新增测量项目"
            >
              <Form direction="ver" field={this.field}>
                <FormItem label="类目：" {...formItemLayout} required>
                  <Select
                    size="large"
                    placeholder="请选择..."
                    dataSource={this.state.listDataSource}
                    {...init('classId', {
                      rules: [{ required: true, message: '必填选项' }]
                    })}
                  />
                </FormItem>
                <FormItem label="规格：" {...formItemLayout} >
                  <Input
                    {...init('size', {
                        rules: [{ required: true, message: '必填选项' }],
                      })}
                  />
                </FormItem>
                <FormItem label="数量：" {...formItemLayout} >
                  <Input
                    {...init('count', {
                      rules: [{ required: true, message: '必填选项' }]
                    })}
                  />
                </FormItem>
                <FormItem label="备注：" {...formItemLayout} >
                  <Input
                    {...init('remarks', {
                      rules: [{ required: false, message: '必填选项' }]
                    })}
                  />
                </FormItem>
              </Form>
            </Dialog>
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
