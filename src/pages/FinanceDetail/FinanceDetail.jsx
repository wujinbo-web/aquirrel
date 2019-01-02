import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class FinanceDetail extends Component {
  static displayName = 'FinanceDetail';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finance-detail-page">
        <TabTable
          id={this.props.location.search.split('=')[1]}
          goBack = { this.goBack }
        />
      </div>
    );
  }
  goBack = () => {
    this.props.history.goBack();
  }
}
