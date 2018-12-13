import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducUseMaterials extends Component {
  static displayName = 'ProducUseMaterials';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-use-materials-page">
        <TabTable />
      </div>
    );
  }
}
