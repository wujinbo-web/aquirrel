import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class PurchaseType extends Component {
  static displayName = 'PurchaseType';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-type-page" go={this.props.go}>
        <TabTable go={this.go} />
      </div>
    );
  }
  go = (url) => {
    this.props.history.push(url);
  }
}
