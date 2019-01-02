import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class FinanceInvoicingList extends Component {
  static displayName = 'FinanceInvoicingList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finance-invoicing-list-page">
        <TabTable
          id={this.props.location.search.split('=')[1]}
          goBack={this.goBack}
        />
      </div>
    );
  }
  goBack = () => {
    this.props.history.goBack();
  }
}
