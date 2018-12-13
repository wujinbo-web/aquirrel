import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class Orderadd extends Component {
  static displayName = 'Orderadd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="orderadd-page">
        <SettingsForm redirct={this.redirct} />
      </div>
    );
  }
  redirct = () => {
    let url=this.props.location.pathname.split('/')[1];
    this.props.history.push(`/${url}/info`);
  }
}
