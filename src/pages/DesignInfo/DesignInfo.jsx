import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignInfo extends Component {
  static displayName = 'DesignInfo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-info-page">
        <TabTable redirectUrl={this.redirectUrl} redirect={this.redirect} setLinkToEdit={this.setLinkToEdit} />
      </div>
    );
  }
  setLinkToEdit = (id) => {
    this.props.history.push("/design/editgeneral?id="+id);
  }
  redirectUrl = (id,address) => {
    sessionStorage.design_orderId=id;
    sessionStorage.design_address=address;
    this.props.history.push("/design/floor");
  }
  redirect = (url) => {
    this.props.history.push(url);
  }
}
