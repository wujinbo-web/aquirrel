import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { queryMaterialsTypeList, postUrl } from '@/api';
import { queryPurchaseType } from '@/api/apiUrl';

const FormItem = Form.Item;

export default class AddGoods extends Component {
  static displayName = 'AddGoods';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      customData: [],
      pinPaiNow: [],
      classId: '',
    };
    this.field = new Field(this,{autoUnmount: true});
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex, classId } = this.state;
      this.props.addMaterialName(values, classId);
      this.setState({
        visible: false,
      });
    });
  };

  //更改厂家
  changeFactory = async (value) => {
    this.state.classId = value;
    let response = await postUrl(queryPurchaseType,{ pageSize: 999, factoryId: value })
    this.state.pinPaiNow = response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    });
    this.setState({});
  }

  onOpen = async () => {
    const response = await queryMaterialsTypeList({ pageSize: 999 });
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
    const { customData, pinPaiNow } = this.state;
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
            <FormItem label="材料规格" {...formItemLayout}>
              <Input
                {...init('size', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="生产厂家：" {...formItemLayout}>
              <Select
                  size="large"
                  placeholder="请选择..."
                  style={{width:"100%"}}
                  dataSource={customData}
                  onChange={this.changeFactory}
              />
            </FormItem>
            <FormItem label="厂家品牌：" {...formItemLayout}>
              <Select
                  size="large"
                  placeholder="请选择..."
                  style={{width:"100%"}}
                  dataSource={pinPaiNow}
                  {...init("deptId",{rules:[{required: true, message: '必填选项'}]})}
              />
            </FormItem>
            <FormItem label="价格：" {...formItemLayout}>
              <Input
                {...init('price', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,2})?$/, message: '请输入八位数字，小数点后面两位'}],
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
    display: 'block',
    textAlign:"right",
  },
};
