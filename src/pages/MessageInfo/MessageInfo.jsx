import React, { Component } from 'react';
import MessageList from './components/MessageList';

export default class MessageInfo extends Component {
  static displayName = 'MessageInfo';

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
