import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { queryMaterialsTypeList, postUrl } from '@/api'
import { queryPurchaseType } from '@/api/apiUrl'

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      factoryList: [],
      pinPaiList: [],
      factoryId: '',
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex, factoryId } = this.state;
      this.props.getFormValues(dataIndex, values, factoryId);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = async (index, record) => {
    const response = await queryMaterialsTypeList({ pageSize: 50 });
    let factoryList=response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    //更新品牌分类
    this.updatePinpai(record.classId);
    this.state.factoryId=record.classId;
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
      factoryList
    });
  };

  updatePinpai = async (factoryId) => {
    let response = await postUrl(queryPurchaseType,{pageSize: 999, factoryId});
    this.state.pinPaiList = response.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    });
    this.setState({});
  }

  changeValue = (value) => {
    this.state.factoryId=value;
    this.field.setValues({deptId: ""});
    this.updatePinpai(value);
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { index, record } = this.props;
    const { factoryList, pinPaiList, factoryId } = this.state;
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
            <FormItem label="生产厂家：" {...formItemLayout}>
              <Select
                style={{width:"100%"}}
                dataSource={factoryList}
                value={factoryId}
                onChange={this.changeValue}
              />
            </FormItem>
            <FormItem label="厂家品牌：" {...formItemLayout}>
              <Select
                style={{width:"100%"}}
                dataSource={pinPaiList}
                {...init('deptId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="材料名称：" {...formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
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
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,3})?$/, message: '请输入数字'}],
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
