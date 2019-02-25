import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Loading } from '@icedesign/base';
import axios from 'axios';
import { API_URL } from '../../../../config';

export default class MessageList extends Component {
  static displayName = 'MessageList';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      pageIndex: 1,
      visible: true,
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
  getMsgData = (pageIndex) => {
    this.setState({ visible: true });
    axios
      .get(`${API_URL}/findMessage.do?pageIndex=${pageIndex}&id=${sessionStorage.id}`)
      .then((response)=>{
        console.log(response.data.data);
        this.state.total=response.data.data.total;
        this.state.dataSource=response.data.data.list.map((item)=>{
          return ({ name:item[2].name, title: item[1].messageHeader, message: item[1].messageContent, datetime: item[1].createTime });
        });
        this.setState({visible: false});
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  renderItem = (item, idx) => {
    return (
      <div style={styles.item} key={idx}>
        <div style={styles.title}>
          <strong style={{fontSize:"16px", color:"black"}}>{item.name +":"}</strong> {item.title}
          <span style={styles.datetime}>{item.datetime}</span>
        </div>
        <div style={styles.message}>{item.message}</div>
      </div>
    );
  };

  render() {
    let dataSource = this.state.dataSource;
    return (
      <div className="message-list" style={styles.messageList}>
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
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
    fontSize: '12px',
    color: '#999',
    marginBottom: '10px',
  },
  paginationWarp: {
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageList: {},
};
