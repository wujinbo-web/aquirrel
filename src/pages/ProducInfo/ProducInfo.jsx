import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducInfo extends Component {
  static displayName = 'ProducInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-info-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.produc_orderId=id;
    this.props.history.push("/produc/list");
  }
}
