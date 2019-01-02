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
    const role =[
      {label: "超级管理员",value: "admin"},
      {label: "普通管理员",value: "normAdmin"},
      {label: "财务", value:"finance"},
      {label: "设计", value:"measure"},
      {label: "生产", value:"product"},
      {label: "工程", value:"project"},
      {label: "采购", value:"purchase"},
      {label: "业务", value:"firm"},
    ];

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
            <FormItem label="用户名：" {...formItemLayout}>
              <Input
                {...init('account', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
                })}
              />
            </FormItem>

            <FormItem label="姓名：" {...formItemLayout}>
              <Input
                {...init('name', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
                })}
              />
            </FormItem>

            <FormItem label="部门：" {...formItemLayout}>
              <Select
                style={{width:"150px"}}
                dataSource={this.props.departmentDate}
                {...init('departmentId', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
                })}
              />
            </FormItem>

            <FormItem label="当前权限权限：" {...formItemLayout}>
              <Select
                style={{width:"150px"}}
                dataSource={role}
                {...init('roleId', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
                })}
              />
            </FormItem>

            <FormItem label="性别：" {...formItemLayout}>
              <RadioGroup
                {...init('sex', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              >
                  <Radio id="nan" value="男">
                    男
                  </Radio>
                  <Radio id="nv" value="女">
                    女
                  </Radio>
              </RadioGroup>
            </FormItem>

            <FormItem label="生日：" {...formItemLayout}>
              <Input
                {...init('birthday', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
                })}
              />
            </FormItem>

            <FormItem label="密码：" {...formItemLayout}>
              <Input
                {...init('password', {    //title 字段名
                  rules: [{ required: true, message: '必填选项' }],  //required  不能为空
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
