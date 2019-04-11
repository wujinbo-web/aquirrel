import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Loading, Select, Feedback, Button } from '@icedesign/base';
import IceTitle from '@icedesign/title';
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
    let response = await postUrl(queryUnreadMessage,{
      id:sessionStorage.id,
      pageIndex:this.state.current,
      state: this.state.type,
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
          type: item[1].type,
        });
      });
      this.setState({visible: false});
    }else{
      Toast.error(response.data.msg);
    }
  }

  //筛选列表
  changeSelect = (value) => {
    this.state.type=value;
    this.getMsgData();
    this.setState({});
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
      Toast.error(response.data.msg);
    }
  }

  renderItem = (item, idx) => {
    return (
      <div style={styles.item} key={idx}>
        <div style={styles.title}>
          <strong style={{fontSize:"18px", color:"black",marginRight:'10px'}}>
            {
              item.type==3?"系统消息:":item.name +"(发件人):"
            }
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
        <div style={styles.message} dangerouslySetInnerHTML={{__html:item.message}}></div>
        {
          item.type==3?"":""
          // <Button
          //   style={styles.back}
          //   type="primary"
          //   size="small"
          //   onClick={this.props.go.bind(this,`/message/item?itemId=${1}&sendId=${1}&sendName=${1}&title=${1}&content=${1}`)}
          // >回复</Button>
        }

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
          <IceTitle>
            收件箱：
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
  back:{
    position: 'absolute',
    right: '20px',
    bottom: '10px',
  },
  item: {
    minWidth: '100px',
    position: 'relative',
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
