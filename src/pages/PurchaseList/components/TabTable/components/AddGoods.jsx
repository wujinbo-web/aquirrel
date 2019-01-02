import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { queryMaterialsTypeList } from './../../../../../api';

const FormItem = Form.Item;

export default class AddGoods extends Component {
  static displayName = 'AddGoods';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customData: [],
    };
    this.field = new Field(this,{autoUnmount: true});
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex } = this.state;
      this.props.addMaterialName(values);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = async () => {
    const response = await queryMaterialsTypeList({ pageSize: 50 });
    let customData=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    this.setState({
      visible: true,
      customData,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { customData } = this.state;
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
          onClick={() => this.onOpen()}
        >
          添加材料
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
            <FormItem label="材料名称：" {...formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="材料类别：" {...formItemLayout}>
              <Select
                  size="large"
                  placeholder="请选择..."
                  style={{width:"200px"}}
                  dataSource={customData}
                  {...init("type",{rules:[{required: true, message: '必填选项'}]})}
              />
            </FormItem>
            <FormItem label="价格：" {...formItemLayout}>
              <Input
                {...init('price', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,2})?$/, message: '请输入八位数字，小数点后面两位'}],
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
    display: 'block',
    textAlign:"right",
  },
};
