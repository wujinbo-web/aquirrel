import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class GoodsSeriesMangage extends Component {
  static displayName = 'GoodsSeriesMangage';

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
