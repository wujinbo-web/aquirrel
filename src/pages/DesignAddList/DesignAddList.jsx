import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignAddList extends Component {
  static displayName = 'DesignAddList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-add-list-page">
        <TabTable
          id={sessionStorage.design_addlist_id}
          orderId={sessionStorage.design_addlist_orderId}
          name={sessionStorage.design_addlist_name}
          size={sessionStorage.design_addlist_size}
          count={sessionStorage.design_addlist_count}
          remarks={sessionStorage.design_addlist_remarks}
          redirct = {this.redirct}
          redirct2 = {this.redirct2}
        />
      </div>
    );
  }
  redirct = (record) => {
    sessionStorage.design_addlist_recordId = record.id;
    sessionStorage.desgin_addlist_materialNum = record.count;
    this.props.history.push('/design/adddetail');
  }
  redirct2 = () => {
    this.props.history.push('/design/adddraw');
  }
}
