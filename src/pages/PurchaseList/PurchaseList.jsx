import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class PurchaseList extends Component {
  static displayName = 'PurchaseList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-list-page">
        <TabTable />
      </div>
    );
  }
}
