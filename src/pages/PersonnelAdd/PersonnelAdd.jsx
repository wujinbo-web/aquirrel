import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class PersonnelAdd extends Component {
  static displayName = 'PersonnelAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="personnel-add-page">
        <UserForm redirectUrl={this.redirectUrl}/>
      </div>
    );
  }
  redirectUrl = () => {
    this.props.history.push("/personnel/info");
  }
}
