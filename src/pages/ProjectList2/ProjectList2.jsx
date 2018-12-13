import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProjectList2 extends Component {
  static displayName = 'ProjectList2';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="project-list2-page">
        <TabTable id={sessionStorage.project_orderId2}  goBack={this.goBack}/>
      </div>
    );
  }
  goBack = () => {
    this.props.history.push("/project/putout");
  }
}
