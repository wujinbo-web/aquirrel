import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class CustomerAdd extends Component {
  static displayName = 'CustomerAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (

      <div className="customer-add-page">
          <UserForm redirectUrl={this.redirectUrl} />
      </div>

    );
  }

  redirectUrl = () => {
    this.props.history.push("/customer/info");
  }
}
