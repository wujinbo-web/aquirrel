import React, { Component } from 'react';
import SearchTable from './components/SearchTable';

export default class OrderSearchKailiao extends Component {
  static displayName = 'OrderSearchKailiao';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="order-search-kailiao-page">
        <SearchTable />
      </div>
    );
  }
}
