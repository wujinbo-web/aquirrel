import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Select, Grid, Pagination  } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import EditDialog2 from './components/EditDialog2';
import DeleteBalloon from './components/DeleteBalloon';
import { postkaiLiaojilu, getGoodsType, postAddMaterialsRecord, postUpdateState, postUpdataMaterialsRecord, updateOrderState,postUrl } from '@/api';
import { templateQuery } from '@/api/apiUrl';
import {API_URL} from '@/config';

const Toast = Feedback.toast;
const TabPane = Tab.TabPane;

const tabs = [
  { tab: '全部', key: 'all' },
];
const { Row, Col } = Grid;

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: {},
      goodsType: [],
      tabKey: 'all',
      current: 1,
      total:1,
      templateList: [],  //模板列表
    };
    this.columns = [
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '开料模板',
        dataIndex:'templateName',
        key:'templateName',
        width:80,
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: 100,
      },
      {
        title: '开料数',
        dataIndex: 'count',
        key: 'count',
        width: 70,
      },
      {
        title: '待生产',
        dataIndex: 'unproNum',
        key: 'unproNum',
        width: 70,
      },
      {
        title: '已生产',
        dataIndex: 'proNum',
        key: 'proNum',
        width: 70,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 90,
      },
      {
        title: '最后操作时间',
        dataIndex: 'time',
        key: 'time',
        width: 100,
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
        width: 230,
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog record={record} orderId={this.props.id}/>
              {
                record.state==2?"":<EditDialog2 index={index} record={record} getFormValues={this.getFormValues} />
              }
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getTemplateList();
  }

  //改变模板 查询数据
  changeTemplate = (value) => {
    this.getIndexData(value);
  }
  //批量下载表格
  intallExcel = () => {
    let { dataSource } = this.state;
    let recordIds = dataSource['all'].map(item=>item.id).join(',');
    window.location.href=`${API_URL}/materialsExcel.do?recordIds=${recordIds}`;
  }

  getTemplateList = async () => {
    let response = await postUrl(templateQuery);
    let templateList = response.data.data.map(item=>{
      return ({
        label:item.name,
        value:item.id
      })
    });
    templateList.unshift({label:"全部模板", value:""});
    this.setState({ templateList });
    //获取完列表再获取首页数据
    this.getIndexData();
  }

  templateIdToName = (id) => {
    let { templateList } = this.state;
    let name = "";
    templateList.forEach(item=>{
      if(item.value==id){
        name=item.label;
        return false;
      }
    })
    return name;
  }

  getFormValues = async (dataIndex, values) => {
    let params={
      "orderMaterialsRecord.id":values.id,
      "orderMaterialsRecord.proNum":Number(values.proNum)+Number(values.number),
      "orderMaterialsRecord.unproNum":Number(values.unproNum)-Number(values.number)
    };
    const data = await updateOrderState(params);
    if(data.data.state="success"){
      Toast.success("成功");
      this.state.dataSource["all"][dataIndex]["proNum"]=Number(values.proNum)+Number(values.number);
      this.state.dataSource["all"][dataIndex]["unproNum"]=Number(values.unproNum)-Number(values.number);
      this.setState({});
    }
  }

  getIndexData = async (id="") => {
    const data = await postkaiLiaojilu({orderId: this.props.id, templateId: id});
    let dataSource=data.data.data.map((item)=>{
      return({
        id: item.id,
        name: item.name,
        nameColor: item.nameColor,
        orderId: item.orderId,
        outNum: item.outNum,
        proNum: item.proNum,
        putNum: item.putNum,
        size: item.length+"*"+item.width+'*'+item.height,
        length: item.length,
        lengthColor: item.lengthColor,
        width: item.width,
        widthColor: item.widthColor,
        height: item.height,
        heightColor: item.heightColor,
        count: item.count,
        countColor: item.countColor,
        installNum: item.installNum,
        state: item.state, //0
        time: item.time, //"2018-12-02 03:22:07"
        remark: item.remark,
        remarkColor: item.remarkColor,
        stateName: item.state==2?"已作废":"生效单",
        unproNum: item.unproNum,
        uninstallNum: item.uninstallNum,
        templateName: this.templateIdToName(item.templateId),
        img: item.img==null?"":item.img,
      });
    })
    this.setState({
      dataSource:{ all: dataSource.filter(item=>item.state !=0) },
      total: data.data.total
    });
  }

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  //翻页
  handleChange(current) {
        this.setState({
            current
        });
  }

  render() {
    const { dataSource, goodsType, templateList } = this.state;
    const { id } = this.props;
    return (
      <div className="tab-table">
        <IceContainer>
          <h2 style={{ textAlign: "center" }}>订单{id}生产单</h2>
          <Row>
            <Col span="3" style={{lineHeight:"28px"}} >选择下载类别：</Col>
            <Col span="7" style={{lineHeight:"32px"}}>
              <Select
                style={{ width:"200px"}}
                dataSource={templateList}
                onChange={this.changeTemplate}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={this.intallExcel}>下载</Button>
            </Col>
          </Row>
        </IceContainer>
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
          <Pagination
            style={{float: "right"}}
            current={this.state.current}
            total={this.state.total}
            onChange={this.handleChange}
          />
          <Button onClick={this.props.goBack}>返回</Button>
        </IceContainer>
      </div>
    );
  }
}
