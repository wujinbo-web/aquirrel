import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import TabTable from './components/TabTable';

export default class GoodsTypeManage extends Component {
  static displayName = 'GoodsTypeManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    console.log(this.props.history.location.search.slice(1));
  }

  render() {
    let data = this.props.history.location.search.slice(1);
    let id = data.split('&')[0].split('=')[1];
    let name = decodeURI(data.split('&')[1].split('=')[1]);
    return (
      <div className="goods-type-info-page">
        <IceContainer>
          {name}下品牌分类
        </IceContainer>
        <TabTable id={id} />
      </div>
    );
  }
}
