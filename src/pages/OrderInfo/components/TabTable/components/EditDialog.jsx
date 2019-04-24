import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Upload } from '@icedesign/base';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      defaultList: [],
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
    const { getValue } = this.field;
    const aliOssUrl = 'https://songshu-image.oss-cn-shanghai.aliyuncs.com/';
    if(getValue('fileAddress')!=undefined){
      this.state.defaultList=[
        {
          name:'合同',
          status: "done",
          imgURL:aliOssUrl+getValue('fileAddress'),
          downloadURL:aliOssUrl+getValue('fileAddress')
        }];
    }
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
    const { init, getValue } = this.field;
    const { defaultList } = this.state;
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
            <FormItem label="签约人：" {...formItemLayout}>
              <Input
                {...init('signer')}
              />
            </FormItem>
            <FormItem label="签约金额：" {...formItemLayout}>
              <Input
                {...init('pmoney')}
              />
            </FormItem>

            <FormItem label="地址：" {...formItemLayout}>
              <Input
                {...init('address')}
              />
            </FormItem>

            <FormItem label="客户对接人：" {...formItemLayout}>
              <Input
                {...init('successor')}
              />
            </FormItem>

            <FormItem label="对接电话：" {...formItemLayout}>
              <Input
                {...init('successorPhone')}
              />
            </FormItem>

            <FormItem label="合同：" {...formItemLayout}>
              <Upload
                listType="text"
                action=""
                defaultFileList={defaultList}
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
