import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Radio, Grid, Select } from '@icedesign/base';
import { invoiceCompanyQuery } from '@/api/apiUrl';
import { postUrl } from '@/api';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const { Group: RadioGroup } = Radio;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      companyData: [],
      companyList: [],
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      this.props.getFormValues(values);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = async (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
    });

    const response = await postUrl(invoiceCompanyQuery);
    let data = response.data.CompanyList.map((item)=>{
      return {name:item.name,TFN:item.TFN};
    });
    let data2 = response.data.CompanyList.map((item)=>{
      return {label:item.name,value:item.TFN};
    });
    this.setState({ companyData: data, companyList: data2 });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  changeData = (value) => {
    const { companyData } = this.state;
    let company;
    companyData.forEach((item)=>{
      if(item.TFN==value){
        company = item.name;
        return;
      }
    })
    this.field.setValues({invoiceCompany:company,invoiceTFN:value});
  }

  render() {
    const init = this.field.init;
    const { companyList } = this.state;
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 8,
      },
    };

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(index, record)}
        >
          添加发票
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
            <FormItem label="需方单位：" {...formItemLayout}>
              <Input
                {...init('demanderCompany', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="需方税号：" {...formItemLayout}>
              <Input
                {...init('demanderTFN', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="开票单位：" {...formItemLayout}>
              <Row>
                <Col>
                  <Input
                    {...init('invoiceCompany', {
                      rules: [{ required: true, message: '必填选项' }],
                    })}
                  />
                </Col>
                <Col>
                  <Select style={{ width: "100%" }} dataSource={companyList} onChange={this.changeData}/>
                </Col>
              </Row>

            </FormItem>

            <FormItem label="开票单位税号：" {...formItemLayout}>
              <Input
                {...init('invoiceTFN', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="开票金额：" {...formItemLayout}>
              <Input
                {...init('invoiceMoney', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,2})?$/, message: '请输入8位数字，小数后两位' }],
                })}
              />
            </FormItem>

            <FormItem label="税率：" {...formItemLayout2}>
              <Row>
                <Col>
                  <Input
                    {...init('taxRate', {
                      rules: [{ required: true, message: '必填选项' },{ pattern:/^\d{1,8}([\.]\d{0,2})?$/, message: '请输入8位数字，小数后两位' }],
                    })}
                  />
                </Col>
                <Col><div style={{ lineHeight: "28px"}}>%</div></Col>
              </Row>

            </FormItem>

            <FormItem label="收款账户：" {...formItemLayout}>
              <Input
                {...init('receiptAccount', {
                  rules: [{ required: true, message: '必填选项' }],
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
