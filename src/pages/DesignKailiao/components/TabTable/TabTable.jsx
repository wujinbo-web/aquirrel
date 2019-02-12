import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import FindNote from './components/FindNote';
import { postkaiLiaojilu, getGoodsType, postAddMaterialsRecord, postUpdateState, postUrl } from '@/api';
import { templateQuery } from '@/api/apiUrl';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;

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
      total:1, //总数目
      current: 1,  //当前页码
      dataSource: {},
      goodsType: [],
      tabKey: 'all',
      templateList: []
    };
    this.columns = [
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: 120,
      },
      {
        title: '开料数',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        key: 'factoryName',
        width: 80,
      },
      {
        title: '最后操作时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '状态',
        dataIndex: 'stateName',
        key: 'stateName',
        width: 70,
      },
      {
        title: '操作',
        key: 'action',
        width: 280,
        render: (value, index, record) => {
          return (
            <span>
              {
                record.state==2?"":<Button
                  size="small"
                  type="primary"
                  style={{ marginRight: "5px" }}
                  onClick={()=>{this.props.redirct(record)}}
                >
                  编辑
                </Button>
              }
              {
                record.state==1?<DeleteBalloon
                  handleRemove={() => this.handleRemove(index, record)}
                />:""
              }
              {
                localStorage["ice-pro-authority"]=="admin"?<FindNote Id={record.id} />:""
              }

            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {

    this.getGoodsType();
    this.getIndexData(this.state.current);
    this.getTemplate();
  }

  //获取模板列表
  getTemplate = async () => {
    let response = await postUrl(templateQuery,{});
    let templateList = response.data.data.map(item => {
      return( {label:item.name, value:item.id} )
    });
    this.setState({ templateList });
  }

  //处理总单填写商品数据
  getGoodsType = async () => {
    let data;
    data = this.props.text.split('_').map((item)=>{
      return (JSON.parse(item))
    });
    let goodsType = this.uniq(data).map((item) => {
      return({label:item.name,value:item.classId});
    })
    this.setState({ goodsType });
  }
  //获取列表数据
  getIndexData = async (current) => {
    const data = await postkaiLiaojilu({orderId: this.props.id, pageIndex: current});
    let dataSource=data.data.data.map((item)=>{
      return({
        id: item.id,
        name: item.name,
        size: item.length + '*' + item.width + '*' + item.height,
        length:item.length,
        width:item.width,
        height:item.height,
        count: item.count,
        state: item.state, //0
        time: item.time, //"2018-12-02 03:22:07"
        remark: item.remark,
        stateName:this.getStateName(item.state),
        factoryName: this.getFactoryName(item.factoryId),
        room_num: item.roomNum,
        img: item.img,
      });
    })
    this.setState({ dataSource:{ all: dataSource }, total: data.data.total });
  }

  /*工具类函数*/
  //工厂列表
  getFactoryName = (id) => {
    let name;
    switch(id){
      case 1:
        name="南京厂"
        break;
      case 2:
        name="滁州厂"
        break;
      case 3:
        name="山东厂"
        break;
      default:
        name="出错了"
    }
    return name;
  }

  //开料单状态
  getStateName = (state) => {
    let name;
    switch(state){
      case 0:
        name="填写中"
        break;
      case 1:
        name="已生效"
        break;
      case 2:
        name="已作废"
        break;
      default:
        name="出错了"
    }
    return name;
  }

  //商品id转name
  getNameFromId = (id) => {
    const { goodsType } =this.state;
    let name;
    goodsType.forEach((item)=>{
      if(item.value==id){name=item.label}
    })
    return name;
  }

  //数组去重
  uniq = (array) => {
    let newArray = array.map((item, index) => {
      return item.classId;
    });
    let temp = []; //一个新的临时数组
    let dataNum = []; //存入需要保留的下标
    for(var i = 0; i < newArray.length; i++){
        if(temp.indexOf(newArray[i]) == -1){
            temp.push(newArray[i]);
            dataNum.push(i);
        }
    }
    return dataNum.map(item=>array[item]);
  }
  /*工具类函数 end*/

  //提交申请
  getFormValues = async (values, templateId) => {
    //values: name："床",size："30*30",number: 10,remark:"备注"
    //partsData : ["部件1"，"部件2"]
    let name = this.getNameFromId(values.classId);
    let params={
      "OrderMaterialsRecord.name": name,
      "OrderMaterialsRecord.count": values.number,
      "OrderMaterialsRecord.unproNum": values.number,
      "OrderMaterialsRecord.uninstallNum": 0,
      "OrderMaterialsRecord.orderId": this.props.id,
      "OrderMaterialsRecord.remark": values.remark?values.remark:"",
      "OrderMaterialsRecord.height": values.height,
      "OrderMaterialsRecord.width": values.width,
      "OrderMaterialsRecord.length": values.length,
      "OrderMaterialsRecord.factoryId": values.factoryId,
      "OrderMaterialsRecord.templateId": templateId,
      "OrderMaterialsRecord.room_num": "",
      "OrderMaterialsRecord.classId": values.classId,
    };
    const data = await postAddMaterialsRecord(params);
    console.log(data.data);
    //{"msg":"成功","state":"success","id":"084db49728e3461abbc65b0dbb269e77"}
    if(data.data.state=="success"){
      Toast.success(data.data.msg);
      values.name=name;
      values.id=data.data.id;
      values.count= values.number;
      values.room_num = "";
      values.state = 0;
      values.remark = values.remark?values.remark:"";
      values.img="";
      this.props.redirct(values);
    }
  };

  handleRemove = async (index, record) => {
    const data = await postUpdateState({orderMaterialsRecordId:record.id ,State:2});
    if(data.data.state=="success"){
      Toast.success("作废成功");
      this.state.dataSource["all"][index]["state"]=2;
      this.setState({});
    }
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };
  //切换页码
  handleChange = (current) => {
    this.getIndexData(current);
    this.setState({
        current
    });
  }


  render() {
    const { dataSource, goodsType, templateList, total } = this.state;
    const { id } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h2 style={{ textAlign: "center" }}>订单{id}开料记录单</h2>
          <div style={{ textAlign: "right" }}>
            <EditDialog goodsType={goodsType} templateList={templateList} getFormValues={this.getFormValues} />
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
          <Pagination
            current={this.state.current}
            onChange={this.handleChange}
            total={total}
            style={{float: "right"}}
          />
          <Button onClick={this.props.goBack}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
