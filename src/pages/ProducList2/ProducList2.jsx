import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducList2 extends Component {
  static displayName = 'ProducList2';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-list2-page">
        <TabTable id={sessionStorage.produc_orderId2} goBack={this.goBack} />
      </div>
    );
  }
  goBack = () => {
    this.props.history.push("/produc/putin");
  }
}
