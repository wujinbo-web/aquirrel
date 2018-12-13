import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback  } from '@icedesign/base';
import { queryLog } from '@/api';

const Toast = Feedback.toast;
const FormItem = Form.Item;
const { Row, Col } = Grid;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      text:"",
    };
    this.field = new Field(this);
  }

  getIndexData = async (recordId) => {
    const response = await queryLog({ recordId });
    let data = response.data.list.map((item)=>{
      return `操作人：${item.name},操作信息:${item.information},时间:${item.time}`;
    })
    this.state.text=data.join("<br/>");
    this.setState({});
  }

  onOpen = () => {
    this.getIndexData(this.props.Id);
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  render() {
    const init = this.field.init;
    const { text } = this.state;
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen()}
          style={{ marginLeft: "5px" }}
        >
          操作日志
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.onClose}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="查看日志"
        >
          <div dangerouslySetInnerHTML={{__html: text}}></div>
        </Dialog>
      </div>
    );
  }
}

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
  addRow:{
    marginBottom:"5px",
  },
  addCol:{
    marginLeft:"90px",
  },
  addSpan:{
    display:"inline-block",
    marginRight:"10px",
    marginBottom:"5px",
  },
  addInput:{
    width:"100px",
    marginRight:"5px",
  }
};
