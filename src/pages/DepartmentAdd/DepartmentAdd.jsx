import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class DepartmentAdd extends Component {
  static displayName = 'DepartmentAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="department-add-page">
        <UserForm redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = () => {
    this.props.history.push("/department/info");
  }
}
