import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducKuCun extends Component {
  static displayName = 'ProducKuCun';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-ku-cun-page">
        <TabTable />
      </div>
    );
  }
}
