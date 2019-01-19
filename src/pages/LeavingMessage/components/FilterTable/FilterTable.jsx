/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination,Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import FilterForm from './Filter';
import data from './data';
import { postUrl } from '@/api';
import { leavingMessageQuery, leavingMessageType,leavingMessageDelete } from '@/api/apiUrl';

const Toast = Feedback.toast;

export default class EnhanceTable extends Component {

  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      total:1,
      current:1,
    }
  }

  componentDidMount(){
    this.getIndexData();
  }

  getIndexData = async (pageIndex=1) => {
    const response = await postUrl(leavingMessageQuery,{ pageIndex, pageSize: 10 });
    let data = response.data;
    //data.total 总数  data.data
    let dataSource = data.data.map((item)=>{
      return ({ createTime:item.createTime, id:item.id,name:item.name,phoneNum:item.phoneNum,information:item.information,type:item.type })
    })
    this.setState({ dataSource, total:data.total });
  }

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.name}</span>
      </div>
    );
  };

  editItem = async (record,index, e) => {
    e.preventDefault();
    const response = await postUrl(leavingMessageType,{
      'leaveWord.name':record.name,
      'leaveWord.id':record.id,
      'leaveWord.phoneNum':record.phoneNum,
      'leaveWord.createTime':record.createTime,
      'leaveWord.information':record.information,
      'leaveWord.type':1,
    });
    if(response.data.state=="success"){
      let {dataSource}=this.state;
      dataSource[index].type=1;
      this.setState({dataSource});
    }else{
      Toast.error(response.data.message);
    }
  };

  deleteItem = async (record,index,e) => {
    e.preventDefault();
    const response = await postUrl(leavingMessageDelete,{id:record.id});
    if(response.data.state=="success"){
      let {dataSource} = this.state;
      dataSource.splice(index,1);
      this.setState({dataSource});
    }else{
      Toast.error(response.data.message);
    }
  }

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        style={styles.filterTableOperation}
      >
        {
          record.type==0?<a
            href="#"
            style={styles.operationItem}
            target="_blank"
            onClick={this.editItem.bind(this, record, index)}
          >
            已读
          </a>:""
        }

        <a
          href="#"
          style={styles.operationItem}
          target="_blank"
          onClick={this.deleteItem.bind(this, record, index)}
        >
          删除
        </a>

      </div>
    );
  };

  //修改页码
  handleChange = (current) => {
     this.getIndexData(current);
     this.setState({
       current
     });
   }

  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value==0?"未读":"已读"}
      </IceLabel>
    );
  };

  render() {
    let { dataSource,total,current } = this.state;
    return (
      <div className="filter-table">

        <IceContainer>
          <Table
            dataSource={dataSource}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column
              title="留言时间"
              dataIndex="createTime"
              width={150}
            />
            <Table.Column
              title="称呼"
              cell={this.renderTitle}
              width={100}
            />
            <Table.Column
              title="联系方式"
              dataIndex="phoneNum"
              width={150}
            />
            <Table.Column
              title="留言内容"
              dataIndex="information"
              width={300}
            />
            <Table.Column
              title="状态"
              dataIndex="type"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.paginationWrapper}>
            <Pagination total={total} current={current} onChange={this.handleChange} />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  filterTableOperation: {
    lineHeight: '28px',
  },
  operationItem: {
    marginRight: '12px',
    textDecoration: 'none',
    color: '#5485F7',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  paginationWrapper: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
