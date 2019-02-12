import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class KailiaoTemplateEdit extends Component {
  static displayName = 'KailiaoTemplateEdit';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-general-list-page">
        <TabTable redirct={this.redirct}  />
      </div>
    );
  }
  redirct = (value) => {
    this.props.history.push(`/desgin/tempalteeditdetail?id=${value.id}&name=${value.name}`);
  }
}
