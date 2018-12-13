import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class FinanceList extends Component {
  static displayName = 'FinanceList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finance-list-page">
        <TabTable id={sessionStorage.finance_orderId} />
      </div>
    );
  }
}
