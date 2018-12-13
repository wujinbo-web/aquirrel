import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectPrefinish extends Component {
  static displayName = 'ProjectPrefinish';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-prefinish-page">
        <TabTable />
      </div>
    );
  }
}
