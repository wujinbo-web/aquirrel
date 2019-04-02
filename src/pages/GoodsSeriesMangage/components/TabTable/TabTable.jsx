import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Button, Feedback, Pagination, Loading } from '@icedesign/base';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import AddDialog from './components/AddDialog';
import { postUrl } from '@/api';
import { addGoodsSeries, queryGoodsSeries, updateGoodsSeries, deleteGoodsSeries } from '@/api/apiUrl';

const  Toast = Feedback.toast;

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state={
      current: 1,
      total: 1,
      visible: false,
      dataSource: [],
    };
    this.columns=[
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '系列',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark'
      },
    ];
  }

  //钩子
  componentDidMount(){
    this.getIndexData();
  }

  //查询数据
  getIndexData = async () => {
    this.setState({visible: true});
    let response = await postUrl(queryGoodsSeries,{ pageIndex: this.state.current, pageSize: 10});
    if(response.data.state=="success"){
      this.state.total=response.data.total;
      this.state.dataSource=response.data.data.map(item=>{
        return({
          id: item.id,
          name: item.name,
          remark: item.remark,
        })
      });
      this.setState({ visible: false });
    }else{
      Toast.error("网络异常，请刷新重试");
    }
  }

  //渲染操作列
  cellRender = (value, index, record) => {
    return (
      <span>
        <EditDialog getFormValues={this.editData} index={index} record={record} />
        <DeleteBalloon handleRemove={this.deleteData} index={index} id={record.id} />
      </span>
    )
  }

  //添加数据
  addData = async (values) => {
    this.setState({visible:false});
    let response = await postUrl(addGoodsSeries, {
      "pcDept.name": values.name,
      "pcDept.remark": values.remark,
    });
    if(response.data.state=="success"){
      Toast.success("添加成功");
      this.getIndexData();
    }else{
      Toast.error(response.data.msg);
    }
  }

  //编辑数据
  editData = async (index, values) => {
    let response = await postUrl(updateGoodsSeries,{
      "pcDept.id": values.id,
      "pcDept.name": values.name,
      "pcDept.remark": values.remark,
    });
    if(response.data.state=="success"){
      Toast.success("编辑成功");
      this.state.dataSource[index]={id:values.id,name:values.name,remark:values.remark};
      this.setState({});
    }else{
      Toast.error(response.data.msg);
    }
  }

  //删除数据
  deleteData = async (index, id) => {
    let response = await postUrl(deleteGoodsSeries,{id});
    if(response.data.state=="success"){
      Toast.success("删除成功");
      this.state.dataSource.splice(index, 1);
      this.setState({});
    }else{
      Toast.error(response.data.msg)
    }
  }

  //翻页
  changePag = (current) => {
    this.state.current=current;
    this.setState({});
    this.getIndexData();
  }

  render(){
    let { dataSource, current, total, visible } = this.state;
    return(
      <IceContainer>
        <Loading visible={visible}>
          <AddDialog getFormValues={this.addData}/>
          <Table
            dataSource={dataSource}
            style={{ marginBottom: "10px" }}
          >
            {
              this.columns.map((item,index)=>{
                return(
                  <Table.Column key={index} title={item.title} dataIndex={item.dataIndex} />
                )
              })
            }
            <Table.Column title="操作" cell={this.cellRender} />
          </Table>
          <Pagination current={current} total={total} onChange={this.changePag} />
        </Loading>
      </IceContainer>
    );
  }
}
