import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field } from '@icedesign/base';

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
          编辑
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="总入库数：" {...formItemLayout}>
              <Input
                {...init('putNum', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^[0-9]*$/, message: '请输入数字'}],
                })}
              />
            </FormItem>

            <FormItem label="总出库数：" {...formItemLayout}>
              <Input
                {...init('outNum', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^[0-9]*$/, message: '请输入数字'}],
                })}
              />
            </FormItem>

            <FormItem label="单价：" {...formItemLayout}>
              <Input
                {...init('price', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,2})?$/, message: '请输入数字'}],
                })}
              />
            </FormItem>

            <FormItem label="单位：" {...formItemLayout}>
              <Input
                {...init('unit')}
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