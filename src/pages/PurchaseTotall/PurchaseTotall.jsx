import React, { Component } from 'react';
import TableFilter from './components/TableFilter';

export default class PurchaseTotall extends Component {
  static displayName = 'PurchaseTotall';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-totall-page">
        <TableFilter />
      </div>
    );
  }
}
