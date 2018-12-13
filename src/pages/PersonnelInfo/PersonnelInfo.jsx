import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class PersonnelInfo extends Component {
  static displayName = 'PersonnelInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="customer-info-page">
        <TabTable />
      </div>
    );
  }
}
