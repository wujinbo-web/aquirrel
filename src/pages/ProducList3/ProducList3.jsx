import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducList3 extends Component {
  static displayName = 'ProducList3';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-list3-page">
        <TabTable id={sessionStorage.produc_orderId3}  goBack={this.goBack} />
      </div>
    );
  }
  goBack = () => {
    this.props.history.push("/produc/putout");
  }
}
