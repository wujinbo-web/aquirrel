import React, { Component } from 'react';
import FilterTable from './components/FilterTable';

export default class LeavingMessage extends Component {
  static displayName = 'LeavingMessage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="leaving-message-page">
        <FilterTable />
      </div>
    );
  }
}
