import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Table, Feedback } from '@icedesign/base';
import { queryInOutMaterialsDetail } from './../../../../../api';

const FormItem = Form.Item;
const Toast = Feedback.toast;

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
        materialsMainId: item.materialsMainId,
        materialsRecordId: item.materialsRecordId,
        remarks: item.remarks,
        id: item.id,
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

  //设置到货数量
  setTrueNum = (index, value) => {
    let { dataSource } = this.state;
    dataSource[index]["trueNum"]=value;
    this.setState({ dataSource });
  }

  renderName = (blank,index,record) => {
    // record {name: "黄色石头", count: 100, trueNum: null}
    return (
      <Input style={{ width: "100%" }} onChange={ this.setTrueNum.bind(this,index) } htmlType="number"  />
    )
  }

  onSubmitForm = () => {
    let { dataSource } = this.state;
    if(dataSource.filter(item=>(item.trueNum==null||item.trueNum=="")).length>0){
      Toast.error("到货数不能为空");
      return false;
    }
    this.props.writeList(dataSource);
    this.setState({
      visible: false,
    });
  }

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
          填写到货单
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.onSubmitForm.bind(this,record)}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="填写到货单"
        >
          <Table dataSource={dataSource}>
             <Table.Column title="材料" dataIndex="name"/>
             <Table.Column title="数量" dataIndex="count"/>
             <Table.Column title="实际到货数" dataIndex="trueNum" cell={this.renderName.bind(this)}/>
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
