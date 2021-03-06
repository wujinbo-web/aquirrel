import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { postUrl } from '@/api';
import { queryGoodsType, queryGoodsSeries } from '@/api/apiUrl';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      typeList: [],
      seriesList: [],
    };
    this.field = new Field(this);
  }

  //获取类别列表
  getTypeData = async () => {
    let response = await postUrl(queryGoodsType,{pageIndex: 1, pageSize: 9999});
    this.state.typeList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    console.log(this.state.typeList);
    this.setState({});
  }

  //获取系列列表
  getSeriesData = async () => {
    let response = await postUrl(queryGoodsSeries,{pageIndex: 1, pageSize: 9999});
    this.state.seriesList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //提交修改
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
    this.getTypeData();
    this.getSeriesData();
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
    const { typeList, seriesList } = this.state;
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

            <FormItem label="名字：" {...formItemLayout}>
              <Input
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="类别：" {...formItemLayout}>
              <Select
                dataSource={typeList}
                style={{ width: "100%" }}
                {...init('classId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="系列：" {...formItemLayout}>
              <Select
                dataSource={seriesList}
                style={{ width: "100%" }}
                {...init('deptId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="描述：" {...formItemLayout}>
              <Input
                {...init('description')}
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
