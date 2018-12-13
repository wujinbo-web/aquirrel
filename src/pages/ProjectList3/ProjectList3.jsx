import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectList3 extends Component {
  static displayName = 'ProjectList3';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-list3-page">
        <TabTable id={sessionStorage.project_orderId3}  goBack={ this.goBack } />
      </div>
    );
  }
  goBack = () => {
    this.props.history.push("/project/preinstall");
  }
}
