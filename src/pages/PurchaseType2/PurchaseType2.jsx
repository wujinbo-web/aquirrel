import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class GoodsTypeManage extends Component {
  static displayName = 'GoodsTypeManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="goods-type-info-page">
        <TabTable />
      </div>
    );
  }
}
