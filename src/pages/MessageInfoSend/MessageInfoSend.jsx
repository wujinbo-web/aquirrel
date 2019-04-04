import React, { Component } from 'react';
import MessageList from './components/MessageList';

export default class MessageInfoSend extends Component {
  static displayName = 'MessageInfoSend';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="message-info-page">
        <MessageList />
      </div>
    );
  }
}
