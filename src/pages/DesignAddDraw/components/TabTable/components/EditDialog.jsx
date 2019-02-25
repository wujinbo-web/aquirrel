import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Upload, Feedback } from '@icedesign/base';
import { API_URL } from '../../../../../config';

const FormItem = Form.Item;
const { ImageUpload } = Upload;
const Toast = Feedback.toast;



//图片上传默认样式
// defaultFileList={}
// [
//   {
//     name: "IMG.png",
//     status: "done",
//     downloadURL:
//       "https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg",
//     fileURL:
//       "https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg",
//     imgURL:
//       "https://img.alicdn.com/tps/TB19O79MVXXXXcZXVXXXXXXXXXX-1024-1024.jpg"
//   }
// ]

function beforeUpload(info) {
  console.log('beforeUpload callback : ', info);
}
//当图片发生改变时的回掉
function onChange(info) {
  console.log('onChane callback : ', info);
}

function onSuccess(res, file) {
  console.log('onSuccess callback : ', res, file,"成功");
}

function onError(file) {
  console.log('onError callback : ', file);
}

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
    console.log(this.props,"看看");
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      if(values.pic==""){
        Toast.error("请上传合同");
        return;
      }else if (values.pic.fileList[values.pic.fileList.length-1].imgURL==undefined ){
        Toast.error("上传中");
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
          查看图纸
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加图纸"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="操作：" {...formItemLayout}>
              <Upload
                listType="text-image"
                action={`${API_URL}/uploadFile.do`}
                name="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp, .doc, .ppt, .dwt, .dwg, .dws, .dxf"
                data={(file)=>{
                  return ({
                    dir: `design`,
                    fileFileName: file.name
                  });
                }}
                beforeUpload={beforeUpload}
                onChange={onChange}
                onSuccess={onSuccess}
                multiple
                formatter = {formatter}
                {...init('pic')}
                defaultFileList={this.props.record.pic == null ? "" :this.props.record.pic.split(',').map((url,index)=>{
                   return ({
                     name: "图纸"+(index+1),
                     status: "done",
                     downloadURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${url}`,
                     fileURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${url}`,
                     imgURL:`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${url}`
                   })
                 })}
              >
                <Button type="primary" style={{ margin: "0 0 10px" }}>
                  上传图纸
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
    display: 'inline-block',
    marginRight: '5px',
  },
};
