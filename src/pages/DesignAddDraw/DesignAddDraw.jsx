import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignAddDraw extends Component {
  static displayName = 'DesignAddDraw';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-add-draw-page">
        <TabTable id={sessionStorage.design2_orderId} redirct={this.redirct} redirct2={this.redirct2}/>
      </div>
    );
  }
  redirct = (record,id) => {
    //record.name 类名  count 数量 size 规格 remarks 备注
    //this.props.id 订单id
    sessionStorage.design_addlist_orderId=id;
    sessionStorage.design_addlist_id=record.id;
    sessionStorage.design_addlist_name=record.name;
    sessionStorage.design_addlist_size=record.size;
    sessionStorage.design_addlist_count=record.count;
    sessionStorage.design_addlist_remarks=record.remarks;
    this.props.history.push('/design/addlist');
  }

  redirct2 = () => {
    this.props.history.push('/design/info2');
  }
}
