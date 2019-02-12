import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab, Button, Feedback, Pagination, Loading  } from '@icedesign/base';
import DeleteBalloon from './components/DeleteBalloon';
import CustomTable from './components/CustomTable';
import { postUrl } from '@/api';
import { templateListQuery, templateDelete } from '@/api/apiUrl';

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
      current: 1, //当前页码
      total: 0,  //项目总数
      visible: false,
    };
    this.columns = [
      {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        width: 200,
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <Button
                style={{ marginRight:"5px" }}
                type="primary"
                size="small"
                onClick={()=>this.props.redirct(record)}
              >
                编辑模板
              </Button>
              <DeleteBalloon handleRemove={this.handleRemove.bind(this,index)} />
            </span>
          );
        },
      },
    ];
  }


  //加载数据
  componentDidMount() {
    this.getIndexData(this.state.current);
  }

  //删除模板
  handleRemove = async (index) => {
    let { dataSource } = this.state;
    let response = await postUrl(templateDelete,{id:dataSource['all'][index].id});
    console.log(response.data);
    if(response.data.state=="success"){
      Toast.success(response.data.msg);
      dataSource['all'].splice(index,1);
      this.setState({});
    }else{
      Toast.error(response.data.msg);
    }
  }

  getIndexData = async (current) => {
    let response = await postUrl(templateListQuery,{ pageSize:10, pageIndex:current});
    this.setState({ dataSource:{ all: response.data.data }, total: response.data.total });
  }

  //野马切换
  handleChange = (current) => {
    //修改页码
    this.state.current=current;
    this.setState({});
     //请求数据

  }

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
          <Pagination current={this.state.current} onChange={this.handleChange} total={this.state.total} />
        </IceContainer>
        </Loading>
      </div>
    );
  }
}
