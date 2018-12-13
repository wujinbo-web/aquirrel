import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducPutout extends Component {
  static displayName = 'ProducPutout';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-putout-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.produc_orderId3=id;
    this.props.history.push("/produc/list3");
  }
}
