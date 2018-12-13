import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class FinanceInfo extends Component {
  static displayName = 'FinanceInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finance-info-page" >
        <TabTable redirctUrl={this.redirctUrl} />
      </div>
    );
  }
  redirctUrl = (id) => {
    sessionStorage.finance_orderId=id;
    this.props.history.push('/finance/list');
  }
}
