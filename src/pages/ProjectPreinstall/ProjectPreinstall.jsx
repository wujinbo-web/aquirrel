import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectPreinstall extends Component {
  static displayName = 'ProjectPreinstall';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-preinstall-page">
        <TabTable redirectUrl={this.redirectUrl}/>
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.project_orderId3=id;
    this.props.history.push("/project/list3");
  }
}
