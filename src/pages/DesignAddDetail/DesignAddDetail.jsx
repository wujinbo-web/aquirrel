import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignAddDetail extends Component {
  static displayName = 'DesignAddDetail';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-add-detail-page">
        <TabTable
          id={sessionStorage.design_addlist_id}
          recordId={sessionStorage.design_addlist_recordId}
          orderId={sessionStorage.design_addlist_orderId}
          name={sessionStorage.design_addlist_name}
          size={sessionStorage.design_addlist_size}
          count={sessionStorage.design_addlist_count}
          remarks={sessionStorage.design_addlist_remarks}
          recordId={sessionStorage.design_addlist_recordId}
          materialNum={sessionStorage.desgin_addlist_materialNum}
          redirct= {this.redirct}
        />
      </div>
    );
  }
  redirct = () => {
    this.props.history.push("/design/addlist");
  }
}
