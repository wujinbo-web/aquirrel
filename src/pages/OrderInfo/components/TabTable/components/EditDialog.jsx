import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Upload } from '@icedesign/base';
import { API_URL } from '@/config';

const FormItem = Form.Item;
const aliOssUrl="https://songshu-image.oss-cn-shanghai.aliyuncs.com/";

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
      defaultOrderFileList: [],
      defaultDesignFileList: [],
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      //将数据转化为字符串  合同
      let orderFile = this.state.defaultOrderFileList.map(item=>{
        return item.imgURL.split(aliOssUrl)[1];
      }).join(',');
      //将数据转化为字符串  设计图
      let designFile = this.state.defaultDesignFileList.map(item=>{
        return item.imgURL.split(aliOssUrl)[1];
      }).join(',');


      const { dataIndex } = this.state;
      this.props.getFormValues(dataIndex, values, orderFile, designFile);
      this.setState({
        visible: false,
      });
    });
  };

  onOpen = (index, record) => {
    //判断不为空的时候转化将图片转化为upload的数据格式  合同
    if(record.fileAddress!=""){
      this.state.defaultOrderFileList=record.fileAddress.split(',').map(item=>{
        return({
          name:'合同',
          status: 'done',
          imgURL: aliOssUrl + item,
          downloadURL: aliOssUrl + item,
          fileURL: aliOssUrl + item,
        })
      });
    }
    //转化设计图
    if(record.drawingAddress!=""){
      this.state.defaultDesignFileList=record.drawingAddress.split(',').map(item=>{
        return({
          name:'设计图',
          status: 'done',
          imgURL: aliOssUrl + item,
          downloadURL: aliOssUrl + item,
          fileURL: aliOssUrl + item,
        })
      });
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

  //改变订单图片
  changeOrder = (info) => {
    this.state.defaultOrderFileList=info.fileList.map(item=>{
      return({
        name: '合同',
        status: 'done',
        imgURL: item.imgURL,
        downloadURL: item.imgURL,
        fileURL: item.imgURL,
      })
    })
    this.setState({});
  }
  //改变设计图图片
  changeDesign = (info) => {
    this.state.defaultDesignFileList=info.fileList.map(item=>{
      return({
        name: '合同',
        status: 'done',
        imgURL: item.imgURL,
        downloadURL: item.imgURL,
        fileURL: item.imgURL,
      })
    })
    this.setState({});
  }

  render() {
    const { init, getValue } = this.field;
    const { index, record } = this.props;
    const { defaultOrderFileList, defaultDesignFileList } = this.state;
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

            <FormItem label="备注" {...formItemLayout}>
              <Input 
                {...init('order_describe')}
              />
            </FormItem>

            <FormItem label="合同：" {...formItemLayout}>
              <Upload
                listType="text"
                action={`${API_URL}/uploadFile.do`}
                name="file"
                data={(file)=>{
                  let now = new Date();
                  return ({
                    dir: `order/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
                    type:1,
                    fileFileName: file.name
                  });
                }}
                multiple
                formatter = {formatter}
                onChange={this.changeOrder}
                defaultFileList={defaultOrderFileList}
              >
                <Button type="primary" size="small">上传合同</Button>
              </Upload>
            </FormItem>

            <FormItem label="设计图：" {...formItemLayout}>
              <Upload
                listType="text"
                action={`${API_URL}/uploadFile.do`}
                name="file"
                data={(file)=>{
                  let now = new Date();
                  return ({
                    dir: `design/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
                    type:1,
                    fileFileName: file.name
                  });
                }}
                multiple
                formatter = {formatter}
                onChange={this.changeDesign}
                defaultFileList={defaultDesignFileList}
              >
                <Button type="primary" size="small">上传设计图</Button>
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
