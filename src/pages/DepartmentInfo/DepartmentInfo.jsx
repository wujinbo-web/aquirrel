import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DepartmentInfo extends Component {
  static displayName = 'DepartmentInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="department-info-page">
        <TabTable />
      </div>
    );
  }
}
