import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class PurchasePutIn extends Component {
  static displayName = 'PurchasePutIn';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-put-in-page">
        <TabTable />
      </div>
    );
  }
}
