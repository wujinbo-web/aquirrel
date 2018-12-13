import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignInfo2 extends Component {
  static displayName = 'DesignInfo2';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-info2-page">
        <TabTable redirectUrl={this.redirectUrl} />
      </div>
    );
  }
  redirectUrl = (id,text) => {
    sessionStorage.design2_orderId=id;
    sessionStorage.design2_text=text;
    this.props.history.push("/desgin/lailiao");
  }
}
