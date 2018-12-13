import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignMeasure extends Component {
  static displayName = 'DesignMeasure';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-measure-page">
        <TabTable returnFloor={this.returnFloor} />
      </div>
    );
  }
  returnFloor = () => {
    this.props.history.push("/design/roomInfo");
  }
}
