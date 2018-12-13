import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class OrderInfo extends Component {
  static displayName = 'OrderInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="order-info-page">
        <TabTable redirctDetail={this.redirctDetail} />
      </div>
    );
  }
  redirctDetail = (id) => {
    sessionStorage.order_id=id;
    this.props.history.push('/order/detail');
  }
}
