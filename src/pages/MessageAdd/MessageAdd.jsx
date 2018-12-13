import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class MessageAdd extends Component {
  static displayName = 'MessageAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="message-add-page">
        <SettingsForm redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = () => {
    this.props.history.push('/message/info');
  }
}
