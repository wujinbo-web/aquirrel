import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProudcPutin extends Component {
  static displayName = 'ProudcPutin';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="proudc-putin-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.produc_orderId2=id;
    this.props.history.push("/produc/list2");
  }
}
