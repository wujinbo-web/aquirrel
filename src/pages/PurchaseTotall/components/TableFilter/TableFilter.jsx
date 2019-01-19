import React, { Component } from 'react';
import CustomTable from './CustomTable';
import Filter from './Filter';
import { postUrl } from '@/api';
import { materialsTotal } from '@/api/apiUrl';
import GMTToString from '@/tool/gmtToString';

export default class TableFilter extends Component {
  static displayName = 'TableFilter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }
  componentDidMount (){
    this.getIndexData();
  }
  getIndexData = async (startTime="", endTime="") => {
    //如果日期为空，就查不到数据
    let response = await postUrl(materialsTotal,{startTime:startTime?GMTToString(startTime):"",endTime:startTime?GMTToString(endTime):""});
    let data = response.data.mcvList.map((item,index) => {
      return { index: index+1, className:item.className, totalPrice:item.totalPrice };
    })
    this.setState({ dataSource:data });
  }

  render() {
    return (
      <div>
        <Filter getIndexData={this.getIndexData} />
        <CustomTable dataSource={this.state.dataSource} />
      </div>
    );
  }
}
