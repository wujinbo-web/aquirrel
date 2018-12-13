import React, { Component } from 'react';
import { Table, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import TableFilter from './TableFilter';
import { queryKailiaoCount } from './../../../../api';

const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      pageName: `Page${index}`,
      eventName: '点击事件',
      eventId: `1000${index}`,
      num: `986262${index}`,
      date: '2018-08-28',
      type: '遗漏埋点',
    };
  });
};

export default class SearchTable extends Component {
  static displayName = 'SearchTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
    };
  }

  componentDidMount(){
    this.getIndexData("2018-12-1","2018-12-7");
  }

  getIndexData = async (startTime, endTime, factoryId="") => {
    const response = await queryKailiaoCount({ startTime, endTime, factoryId });
    let dataSource = response.data.list.map((item)=>{
      return ({ name: item.name, size: item.size, count: item.count });
    });
    this.setState({ dataSource });
  }

  renderOper = () => {
    return (
      <div>
        <a style={styles.link}>详情</a>
        <span style={styles.separator} />
        <a style={styles.link}>申请权限</a>
      </div>
    );
  };

  render() {
    const { dataSource } = this.state;

    return (
      <IceContainer style={styles.container}>
        <h4 style={styles.title}>查询开料记录</h4>
        <TableFilter getIndexData={this.getIndexData} />
        <Table
          dataSource={dataSource}
          hasBorder={false}
          style={{ padding: '0 20px 20px' }}
        >
          <Table.Column title="产品名" dataIndex="name" />
          <Table.Column title="规格" dataIndex="size" />
          <Table.Column title="数量" dataIndex="count" />
        </Table>
      </IceContainer>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    padding: '0 0 20px',
  },
  title: {
    margin: '0',
    padding: '15px 20px',
    fonSize: '16px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: 'rgba(0,0,0,.85)',
    fontWeight: '500',
    borderBottom: '1px solid #eee',
  },
  link: {
    margin: '0 5px',
    color: 'rgba(49, 128, 253, 0.65)',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  separator: {
    margin: '0 8px',
    display: 'inline-block',
    height: '12px',
    width: '1px',
    verticalAlign: 'middle',
    background: '#e8e8e8',
  },
  pagination: {
    textAlign: 'right',
    marginRight: '20px',
  },
};
