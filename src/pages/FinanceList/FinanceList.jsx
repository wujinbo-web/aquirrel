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
        <TabTable
          id={sessionStorage.finance_orderId}
          redirctDetail={this.redirctDetail}
          redirctInvoicingList={this.redirctInvoicingList}
          goBack = { this.goBack }
        />
      </div>
    );
  }
  redirctDetail = (id) => {
    this.props.history.push('/finance/detail?id='+id);
  }
  redirctInvoicingList = (id) => {
    this.props.history.push('/finance/invoicinglist?id='+id);
  }
  goBack = () => {
    this.props.history.goBack();
  }
}
