import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class GoodsTypeAdd extends Component {
  static displayName = 'GoodsTypeAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="goods-type-add-page" >
        <UserForm go={this.go} />
      </div>
    );
  }
  go = (url) => {
    this.props.history.push(url);
  }
}
