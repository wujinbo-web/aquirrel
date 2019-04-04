import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Loading, Select, Feedback, Button } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import { postUrl } from '@/api';
import { updateUnread, deleteMessage, querySendMessage } from '@/api/apiUrl';

const Toast = Feedback.toast;

export default class MessageList extends Component {
  static displayName = 'MessageList';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      current: 1,
      visible: true,
      type: "",
    };
  }

  componentDidMount = () => {
    this.getMsgData();
  }

  //翻页
  handleChange = (current) => {
    this.state.current = current;
    this.getMsgData();
    this.setState({
       current
    });
  }

  //获取全部消息消息
  getMsgData = async () => {
    this.setState({ visible: true });
    let response = await postUrl(querySendMessage,{
      id:sessionStorage.id,
      pageIndex:this.state.current,
    })
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
      Toast.error(response.data.msg);
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

  //渲染组件
  renderItem = (item, idx) => {
    return (
      <div style={styles.item} key={idx}>
        <div style={styles.title}>
          <strong style={{fontSize:"18px", color:"black",marginRight:'10px'}}>
            {item.name +"(收件人):"}
          </strong>
          <span style={{ fontSize:"18px", color: 'black',  }}>{item.title}</span>
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
      {label: "全部消息",value: ""},
      {label: "已读消息",value: 0},
      {label: "未读消息", value: 1}
    ];
    return (
      <div className="message-list" style={styles.messageList}>
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">

        <IceContainer>
          <IceTitle>
            发件箱：
          </IceTitle>
          {dataSource.map(this.renderItem)}
          <div style={styles.paginationWarp}>
            <Pagination total={this.state.total} current={this.state.current} onChange={this.handleChange} />
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
    fontSize: '14px',
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
