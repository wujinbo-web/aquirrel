import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading } from '@icedesign/base';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import { postUrl } from '@/api';
import { addLackGoods, queryLackGoods, deleteAplication, dealAplication } from '@/api/apiUrl';

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
      dataSource: {all:[{id:1,name:22,signer:"sad"}]},
      tabKey: 'all',
      current: 1, //当前页码
      total: 0,  //项目总数
      visible: false,
    };
    this.columns = [
      {
        title: '申请人',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '申请时间',
        dataIndex: 'pTime',
        key: 'pTime',
      },
      {
        title: '申请文档',
        key: 'excelAddress',
        render:(value, index, record)=>{
          return(<span>
            {
              record.excelAddress?record.excelAddress.split(',').map((item,index)=>{
                return <a href={item} key={index} style={{ marginRight:"5px" }} >下载文档{index+1}</a>
              }):""
            }
          </span>)
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        key: 'options',
        render:(key, index, record)=>{
          return(
            <span>
              <Button
                shape="warning"
                size="small"
                style={{marginRight:"5px"}}
                onClick={this.deleteItem.bind(this, index, record)}
              >删除</Button>
            {
              record.state == 0 ? <Button type="primary" size="small" onClick={this.dealAplication.bind(this,index,record)}>处理申请</Button> : ""
            }

            </span>
          )
        }
      }
    ];
  }

  //处理申请
  dealAplication = async (index, record) => {
    let response = await postUrl(dealAplication,{"urgent.id": record.id ,"urgent.state": 1});
    if(response.data.state=="success"){
      let { dataSource } = this.state;
      dataSource['all'][index].state=1;
      dataSource['all'][index].status='已处理';
      this.setState({ dataSource });
      Toast.success("处理成功");
    }else{
      Toast.error(response.data.msg);
    }
  }

  //加载数据
  componentDidMount() {
    this.getIndexData(this.state.current);
  }

  //删除项
  deleteItem = async(index, record) => {
    let response = await postUrl(deleteAplication,{id: record.id});
    if(response.data.state=="success"){
      let { dataSource } = this.state;
      dataSource['all'].splice(index, 1);
      this.setState({dataSource});
      Toast.success("删除成功");
    }else{
      Toast.error(response.data.msg);
    }
  }

  getIndexData = async (current) => {
    this.setState({ visible: true });
    let response = await postUrl(queryLackGoods,{pageIndex:current, pageSize:10});
    this.state.total = response.data.total;
    let data = response.data.data.map(item=>{
      return({
        id: item.id,
        name: item.name,
        pTime:item.pTime,
        state:item.state,
        excelAddress: item.excelAddress,
        status: item.state==0?"未处理":"已处理"
      })
    })
    this.state.dataSource = { all: data };
    this.setState({ visible: false });
  }

  //野马切换
  handleChange = (current) => {
    //修改页码
    this.state.current=current;
    this.setState({});
  }

  //添加申请
  getFormValues = async (address) => {
    let response = await postUrl(addLackGoods,{"urgent.name":sessionStorage.name, "urgent.excelAddress":address});
    if(response.data.state=="success"){
      Toast.success('添加成功');
      this.getIndexData(this.state.current);
    }else{
      Toast.errpr(response.data.msg);
    }
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="tab-table">
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <EditDialog getFormValues={this.getFormValues}  />
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
