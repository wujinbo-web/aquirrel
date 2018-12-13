import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectPutout extends Component {
  static displayName = 'ProjectPutout';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-putout-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.project_orderId2=id;
    this.props.history.push("/project/list2");
  }
}
