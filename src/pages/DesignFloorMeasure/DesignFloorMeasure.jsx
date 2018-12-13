import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignFloorMeasure extends Component {
  static displayName = 'DesignFloorMeasure';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-floor-measure-page">
        <TabTable
          id={sessionStorage.design_orderId}
          floorNumId={sessionStorage.design_floorNumId}
          floorNum={sessionStorage.design_floorNum}
          remark={sessionStorage.design_floorRemark}
          direction = {this.direction}
        />
      </div>
    );
  }
  direction = () =>{
    this.props.history.push("/design/floor");
  }
}
