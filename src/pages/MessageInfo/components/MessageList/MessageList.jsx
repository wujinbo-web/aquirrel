import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Loading, Select, Feedback, Button } from '@icedesign/base';
import axios from 'axios';
import { API_URL } from '@/config';
import { postUrl } from '@/api';
import { updateUnread, deleteMessage, querySendMessage, queryUnreadMessage } from '@/api/apiUrl';

const Toast = Feedback.toast;

export default class MessageList extends Component {
  static displayName = 'MessageList';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      pageIndex: 1,
      visible: true,
      type: 1
    };
  }

  componentDidMount = () => {
    this.getMsgData(this.state.pageIndex);
  }

  //翻页
  handleChange = (current) => {
    this.getMsgData(current);
    this.setState({
       pageIndex: current
    });
  }

  //获取全部消息消息
  getMsgData = (pageIndex) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/fingUnreadMessage.do?pageIndex=${pageIndex}&id=${sessionStorage.id}`)
      .then((response)=>{
        this.state.total=response.data.data.total;
        this.state.dataSource=response.data.data.list.map((item)=>{
          console.log(item[1].messageContent,"看看");
          return ({
            name:item[2].name,
            title: item[1].messageHeader,
            message: item[1].messageContent,
            datetime: item[1].createTime,
            status: item[0].state,
            id: item[0].id,
            cmsUserId:item[1].cmsUserId,
            targetId:item[0].targetId,
          });
        });
        this.setState({visible: false});
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  //获取已发信息 及 未读消息
  getSendMessage = async (type, pageIndex) => {
    this.setState({ visible: true });
    let response = await postUrl(type=="send"?querySendMessage:queryUnreadMessage,{id:sessionStorage.id, pageIndex, pageSize: 10, state:1});
    if(response.data.state=="success"){
      this.state.total=response.data.data.total;
      this.state.dataSource=response.data.data.list.map((item)=>{
        return ({
          name:item[2].name,
          title: item[1].messageHeader,
          message: item[1].messageContent,
          datetime: item[1].createTime,
          status: item[0].state,
          id: item[0].id,
          cmsUserId:item[1].cmsUserId,
          targetId:item[0].targetId,
        });
      });
      this.setState({visible: false});
    }else{
      Toast.error(response.data.state);
    }
  }

  //筛选列表
  changeSelect = (value) => {
    this.setState({ type: value });
    if(value==1){
      this.getMsgData(this.state.pageIndex);
    }else if(value==2){
      this.getSendMessage("unread",this.state.pageIndex);
    }else if(value==3){
      this.getSendMessage("send",this.state.pageIndex);
    }
  }

  //标记已读
  changeUnread = async (item,idx) => {
    if(this.state.type == 3)return false;
    let response = await postUrl(updateUnread, {id:item.id});
    let { dataSource } = this.state;
    if(response.data.state=="success"){
      dataSource[idx].status=0;
      this.setState({dataSource});
      Toast.success('标记成功');
    }else{
      Toast.error(response.msg);
    }
  }

  //删除消息
  deleteItem = async (item,idx) =>{
    let response = await postUrl(deleteMessage,{
      id:sessionStorage.id,
      "messageParent.cmsUserId":item.cmsUserId,
      "messageCmsUser.targetId":item.targetId,
      "messageCmsUser.id": item.id
    });
    let { dataSource } = this.state;
    if(response.data.state=="success"){
      dataSource.splice(idx, 1);
      this.setState({dataSource});
      Toast.success('删除成功');
    }else{
      Toast.error(response.msg);
    }
  }

  renderItem = (item, idx) => {
    return (
      <div style={styles.item} key={idx}>
        <div style={styles.title}>
          <strong style={{fontSize:"18px", color:"black",marginRight:'10px'}}>
            {item.name +":"}
          </strong>
          <span style={{ fontSize:"18px", color: 'black',  }}>{item.title}</span>
          {
            item.status==1?
            <a
              href="javascript:;"
              style={{marginLeft:"10px", padding:"0 5px", fontSize:"14px", color:"white" ,background:"red"}}
              onClick={this.changeUnread.bind(this,item,idx)}
            >未读</a>:""
          }
          <span style={styles.datetime}>
            {item.datetime}
            <Button
              size="small"
              shape="warning"
              style={{marginLeft:"10px"}}
              onClick={this.deleteItem.bind(this, item, idx)}
            >删除</Button>
          </span>

        </div>
        <div style={styles.message}>{item.message}</div>
      </div>
    );
  };

  render() {
    let dataSource = this.state.dataSource;
    let selectItem = [
      {label: "全部消息",value: 1},
      {label: "未读消息",value: 2},
      {label: "已发消息", value: 3}
    ];
    return (
      <div className="message-list" style={styles.messageList}>
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <div style={{lineHeight:"32px", width:"110px", float:"left"}}>
            消息筛选:
          </div>
          <Select
            dataSource={selectItem}
            style={{ width:"200px" }}
            placeholder="请选择筛选类型"
            onChange={this.changeSelect}
          />
        </IceContainer>
        <IceContainer>
          {dataSource.map(this.renderItem)}
          <div style={styles.paginationWarp}>
            <Pagination total={this.state.total} current={this.state.pageIndex} onChange={this.handleChange} />
          </div>
        </IceContainer>
        </Loading>
      </div>
    );
  }
}

const styles = {
  item: {
    borderBottom: '1px solid #eee',
    margin: '0 0 20px',
  },
  title: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '10px',
    position: 'relative',
  },
  datetime: {
    position: 'absolute',
    right: '10px',
    paddingTop: '10px',
    fontSize: '12px',
    color: '#999',
  },
  message: {
    fontSize: '16px',
    lineHeight:'30px',
    color: '#666',
    marginBottom: '10px',
    paddingTop: '10px',
    paddingRight: '210px',
    letterSpacing: '3px'
  },
  paginationWarp: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageList: {},
};
