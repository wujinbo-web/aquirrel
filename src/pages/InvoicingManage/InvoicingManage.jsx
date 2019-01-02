import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class InvoicingManage extends Component {
  static displayName = 'InvoicingManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-type-page">
        <TabTable />
      </div>
    );
  }
}
