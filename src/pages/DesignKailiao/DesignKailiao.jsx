import React, { Component } from 'react';
import TabTable from './components/TabTable';

export default class DesignKailiao extends Component {
  static displayName = 'DesignKailiao';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="design-kailiao-page">
        <TabTable id={sessionStorage.design2_orderId} text={sessionStorage.design2_text} redirct={this.redirct} goBack={this.goBack} />
      </div>
    );
  }
  goBack= () =>{
    this.props.history.push('/design/info2');
  }
  redirct = (id,name,size,count,remark,state) => {
    //id开料单
    sessionStorage.desgin2_kailiaoId = id;
    sessionStorage.desgin2_kailiaoName = name;
    sessionStorage.desgin2_kailiaoSize = size;
    sessionStorage.desgin2_kailiaoCount = count;
    sessionStorage.desgin2_kailiaoRemark = remark;
    sessionStorage.desgin2_kailiaoState = state;
    this.props.history.push("/desgin/kailiaolist");
  }
}
