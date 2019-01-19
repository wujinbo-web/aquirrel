import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class CustomerInfo extends Component {
  static displayName = 'CustomerInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="customer-info-page">
        <TabTable />
      </div>
    );
  }
}
