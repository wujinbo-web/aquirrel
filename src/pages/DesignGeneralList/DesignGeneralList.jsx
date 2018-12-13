import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignGeneralList extends Component {
  static displayName = 'DesignGeneralList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-general-list-page">
        <TabTable redirct={this.redirct} />
      </div>
    );
  }
  redirct = (record) => {
    //  订单id
    sessionStorage.design_order_id = record.id;
    sessionStorage.design_drawingAddress = record.drawingAddress;
    sessionStorage.design_fileAddress = record.fileAddress;
    this.props.history.push('/design/addgeneral');
  }
}
