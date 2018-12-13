import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectList extends Component {
  static displayName = 'ProjectList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-list-page">
        <TabTable id={sessionStorage.project_orderId} goBack={this.goBack}/>
      </div>
    );
  }
  goBack = () => {
    this.props.history.push("/project/putin");
  }
}
