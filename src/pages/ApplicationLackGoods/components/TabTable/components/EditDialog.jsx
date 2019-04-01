import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Feedback, Upload  } from '@icedesign/base';
import { API_URL } from '@/config';

const FormItem = Form.Item;
const Toast = Feedback.toast;

function formatter(res) {
  return {
    code: res == '上传失败' ? '1' : '0',   //0代表成功
    imgURL: res,
    downloadURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${res}`,
    fileURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${res}`,
    imgURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${res}`
  };
}

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
      let address = values.address.fileList.map(item=>item.downloadURL).join(',');
      const { dataIndex } = this.state;
      this.props.getFormValues(address);
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
    let data = (file)=>{
      let now = new Date();
      return ({
        dir: `order/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
        type:1,
        fileFileName: file.name
      });
    }
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen(index, record)}
        >
          提交申请
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
            <FormItem label="上传订货单：" {...formItemLayout}>
              <Upload
                listType="text"
                action={`${API_URL}/uploadFile.do`}
                name="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                data={data}
                multiple
                formatter = {formatter}
                {...init('address', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              >
                <Button type="primary" style={{ margin: "0 0 10px" }}>
                  上传
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    marginRight: '5px',
    textAlign: 'right',
  },
};
