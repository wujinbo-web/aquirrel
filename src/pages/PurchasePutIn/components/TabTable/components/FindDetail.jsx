import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Table } from '@icedesign/base';
import { queryInOutMaterialsDetail } from './../../../../../api';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataSource: [],
    };
  }

  onOpen = async (record) => {
    //请求详情数据
    const response = await queryInOutMaterialsDetail({ materialsRecordId: record.id });
    let dataSource = response.data.data.map((item)=>{
      return ({
        name: item.name,
        count: item.count,
        trueNum: item.trueNum,
      });
    })
    this.setState({
      visible: true,
      dataSource,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { record } = this.props;
    const { dataSource } = this.state;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(record)}
        >
          查看
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.onClose}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="查看进货单"
        >
          <Table dataSource={dataSource}>
             <Table.Column title="材料" dataIndex="name"/>
             <Table.Column title="数量" dataIndex="count"/>
             <Table.Column title="实际到货数" dataIndex="trueNum"/>
          </Table>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
};
