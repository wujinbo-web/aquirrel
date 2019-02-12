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
  redirct = (record) => {
    //id开料单
    sessionStorage.desgin2_kailiaoId = record.id;
    sessionStorage.desgin2_kailiaoName = record.name;
    sessionStorage.desgin2_kailiaoLength = record.length;
    sessionStorage.desgin2_kailiaoWidth = record.width;
    sessionStorage.desgin2_kailiaoHeight = record.height;
    sessionStorage.desgin2_kailiaoCount = record.count;
    sessionStorage.desgin2_kailiaoRemark = record.remark;
    sessionStorage.desgin2_kailiaoState = record.state;
    sessionStorage.desgin2_kailiaoRoomNum = record.room_num==null?"":record.room_num;
    sessionStorage.desgin2_kailiaoImg = record.img==null?"":record.img;
    this.props.history.push("/desgin/kailiaolist");
  }
}
