import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignFloor extends Component {
  static displayName = 'DesignFloor';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-floor-page">
        <TabTable
          id={sessionStorage.design_orderId}
          address={sessionStorage.design_address}
          redirectUrl={this.redirectUrl}
          direction = {this.direction}
        />
      </div>
    );
  }
  redirectUrl = (value) => {
    console.log(value,"看看");
    //楼层id 楼层  订单id sessionStorage.design_orderId
    sessionStorage.design_floorNumId=value.id;
    sessionStorage.design_floorRemark=value.remark;
    sessionStorage.design_floorNum=value.floorNum;
    this.props.history.push('/design/floormeasure');
  }
  direction = () => {
    this.props.history.push('/design/info');
  }
}
