import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Button, Input } from '@icedesign/base';

export default class MessageItem extends Component {
  static displayName = 'MessageItem';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){

  }


  render() {
    let message="aaa";
    return <div className="message-item-page" >
      <IceContainer>
        <div style={styles.item}>
          <div style={styles.title}>
            Hello
            <span style={styles.datetime}>
              2019-4-8
              <Button
                size="small"
                shape="warning"
                style={{marginLeft:"10px"}}
              >删除</Button>
            </span>
          </div>
          <div style={styles.message} dangerouslySetInnerHTML={{__html:message}}></div>
        </div>

        <div style={styles.item}>
          <div style={styles.title}>
            我的回复:
            <span style={styles.datetime}>
              2019-4-8
            </span>
          </div>
          <div style={styles.message} dangerouslySetInnerHTML={{__html:message}}></div>
        </div>

        <div style={styles.item}>
          <Input style={styles.content} placeholder="请输入回复内容" />
          <p style={styles.wrap}>
            <Button type="primary" size="small">提交</Button>
          </p>
        </div>
      </IceContainer>
    </div>
  }
}
const styles = {
  content:{
    width: '600px',
    height: '80px',
    marginBottom: '10px'
  },
  item: {
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
};
