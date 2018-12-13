import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class ProducMaterialList extends Component {
  static displayName = 'ProducMaterialList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="produc-material-list-page">
        <TabTable
          id={sessionStorage.produc_addlist_id}
          orderId={sessionStorage.produc_addlist_orderId}
          name={sessionStorage.produc_addlist_name}
          size={sessionStorage.produc_addlist_size}
          count={sessionStorage.produc_addlist_count}
          remarks={sessionStorage.produc_addlist_remarks}
          redirct = {this.redirct}
        />
      </div>
    );
  }
  redirct = () => {
    this.props.history.push('/produc/list');
  }
}
