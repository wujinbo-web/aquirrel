import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Table } from '@icedesign/base';
import { postQueryKailiao } from './../../../../../api';
import {API_URL} from './../../../../../config';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      dataSource:[],
    };
  }

  //获取列表数据
  getIndexData = async (recordId) => {
    const data = await postQueryKailiao({ recordId: recordId });
    //data.data.list//count: null// countColor: "0"// demand: null// demandColor: "0"// id: 36// materials: null  材料名// materialsColor: "0"// name: "角"  部件名
    // nameColor: "0"// recordId: "084db49728e3461abbc65b0dbb269e77"// size: null// sizeColor: "0"
    let dataSource = data.data.list.map((item,index)=>{
      return({
        index:index+1,
        name:item.name,
        size:item.size,
        count:item.count,
        materials: item.materials,
        demand: item.demand,
        id: item.id,
        nameColor: item.nameColor,
        sizeColor: item.sizeColor,
        materialsColor: item.materialsColor,
        demandColor: item.demandColor,
        countColor: item.countColor,
      })
    })
    this.setState({ dataSource });
  }

  onOpen = (record) => {
    this.getIndexData(record.id)
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //下载excel表格
  installExcel = async () => {
    const { record,orderId } = this.props;
    window.location.href=`${API_URL}/materialsExcel.do?orderId=${orderId}&recordId=${record.id}`;
  }

  render() {
    const { dataSource } = this.state;
    const { record,orderId } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const footer = (
      <a onClick={this.onClose} href="javascript:;">
        Close
      </a>
    );
    const render = (key, value,index,record) => {
      return <div style={{ color: record[key]==0 ? "black" : "red" }}>{value}</div>;
    }
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(record)}
          style={{ marginRight: "5px" }}
        >
          查看开料
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          closable="esc,mask,close"
          onClose={this.onClose}
          footer={footer}
          title="开料单"
        >
          <h2>
            订单：{orderId},
            产品名称:{record.name},
            规格:<span style={{color:record.sizeColor==1?"red":""}}>{record.size}</span>,
            数量:<span style={{color:record.sizeCount==1?"red":""}}>{record.count}</span>,
            备注:<span style={{color:record.sizeRemark==1?"red":""}}>{record.remark}</span>
          </h2>
          <Table dataSource={dataSource}>
            <Table.Column title="序号" dataIndex="index" width={60}/>
            <Table.Column title="部件名称" dataIndex="name" width={90} cell={render.bind(this,"nameColor")}/>

            <Table.Column title="材料规格" dataIndex="size" cell={render.bind(this,"sizeColor")} />
            <Table.Column title="数量" dataIndex="count" width={60} cell={render.bind(this,"countColor")} />
            <Table.Column title="材料" dataIndex="materials" cell={render.bind(this,"materialsColor")} />
            <Table.Column title="工艺要求" dataIndex="demand" cell={render.bind(this,"demandColor")} />

          </Table>
          <Button style={{ marginTop:"5px" }}  onClick={this.installExcel} >下载表格</Button>
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
