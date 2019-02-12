import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class KailiaoTemplate extends Component {
  static displayName = 'KailiaoTemplate';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="purchase-type-page">
        <UserForm redirct={this.redirct} />
      </div>
    );
  }
  redirct = () => {
    this.props.history.push('/desgin/tempalteedit');
  }
}
