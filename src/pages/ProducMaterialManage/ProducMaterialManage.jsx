import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducMaterialManage extends Component {
  static displayName = 'ProducMaterialManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-material-manage-page">
        <TabTable />
      </div>
    );
  }
}
