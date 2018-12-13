import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class ProducMaterialAdd extends Component {
  static displayName = 'ProducMaterialAdd';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-material-add-page">
        <SettingsForm />
      </div>
    );
  }
}
