import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducList extends Component {
  static displayName = 'ProducList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-list-page">
        <TabTable id={sessionStorage.produc_orderId} redirct={this.redirct} goBack={this.goBack} />
      </div>
    );
  }
  goBack = () => {
    this.props.history.push('/produc/info');
  }
  redirct = (record,orderId) => {
    console.log(record,"看看");
    sessionStorage.produc_addlist_id=record.id;
    sessionStorage.produc_addlist_orderId=orderId;
    sessionStorage.produc_addlist_name=record.name;
    sessionStorage.produc_addlist_size=record.size;
    sessionStorage.produc_addlist_count=record.count;
    sessionStorage.produc_addlist_remarks=record.remarks;
    this.props.history.push('/produc/materiallist');
  }
}
