import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectPutIn extends Component {
  static displayName = 'ProjectPutIn';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-put-in-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id) => {
    sessionStorage.project_orderId=id;
    this.props.history.push("/project/list");
  }
}
