import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Radio, Select } from '@icedesign/base';

const { Group: RadioGroup } = Radio;
const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex } = this.state;
      this.props.getFormValues(dataIndex, values);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //自定义校验
  isChecked = (rule, value, callback) => {
    let Bon1=Number(value) > 0;
    let Bon2=(Number(value) + Number(this.props.record.dputNum)  <= this.props.record.proNum);
    if( Bon1 && Bon2 ){
      callback();
    }else{
      console.log("失败");
      callback("入库数必须大于0小于生产数");
    }
  }

  render() {
    const init = this.field.init;
    const { index, record } = this.props;
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
          onClick={() => this.onOpen(index, record)}
        >
          入库
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="入库"
        >
          <Form direction="ver" field={this.field}>
            <h2>当前可入库最大数量:{Number(record.proNum)-Number(record.dputNum)}</h2>
            <FormItem label="请输入入库数：" {...formItemLayout}>
              <Input
                {...init('number', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^[0-9]*$/, message: '请输入数字' },{validator: this.isChecked}],  //required  不能为空
                })}
              />
            </FormItem>

          </Form>
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
