import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class FinanceExamine extends Component {
  static displayName = 'FinanceExamine';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finance-examine-page">
        <TabTable />
      </div>
    );
  }
}
