/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid, Select, DatePicker, Loading, Feedback,Table, Dialog } from '@icedesign/base';
import axios from 'axios';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import { API_URL } from '@/config';

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const { ImageUpload } = Upload;
const Toast = Feedback.toast;

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

export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        custonId: null,
        order: '',
        contractDate: "",
        address: "",
        signer: "",
        pmoney: "",
        drawing_address: "",
        successor: "", //对接人
        successorPhone: "",  //对接电话
        describe: "",
      },
      customData: [],  //客户下拉列表
      visible: true,  //加载框
      num: 1,

    };
  }

  componentDidMount = () => {
    axios
      .post(`${API_URL}/findCustomerList.do?pageSize=100&pageIndex=1`)
      .then((response)=>{
        this.setState({ visible: false });
        let customData=response.data.data.map((item)=>{
          return { label: item.customer.name, value: item.customer.id  }
        });
        this.setState({ customData });
      })
      .catch((error) => {
        console.log(error,"错误");
      });


  }

  onDragOver = () => {
    console.log('dragover callback');
  };

  onDrop = (fileList) => {
    console.log('drop callback : ', fileList);
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      // address 地址 \ custonId 客户id  \ contractDate 签约日期 GMT \ signer 签约人
      // order:
      //   file: {originFileObj: File(662167), fileName: "22.jpg", uid: "jo8f9ri7", name: "22.jpg", lastModified: 1541478344582, …}
      //   fileList: Array(2)  数组
      //   0:
      //     imgURL: "https://songshu-image.oss-cn-shanghai.aliyuncs.com/order/dd74b4ab6792491ea345ef27ee566cc6.jpg"
      //日期转化  GMT => 2018-10-08
      let date = new Date(values.contractDate);
      let contractDate=date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();

      //初始化合同图纸
      let fileAddress="";
      let drawing_address="";
      //判断有合同的情况
      if(values.order!="" && values.order.fileList[values.order.fileList.length-1].imgURL!=undefined){
        //https://songshu-image.oss-cn-shanghai.aliyuncs.com/order/2019_4_25/a68263f2723a480bb18cf819aa0710dbbjyh.png
        fileAddress = values.order.fileList.map((item)=>{
          return item.imgURL.split("https://songshu-image.oss-cn-shanghai.aliyuncs.com/")[1]
        }).join(",");
        console.log(fileAddress,"成了？");
      }
      //判断有图纸的情况
      if(values.drawing_address!=""&&values.drawing_address.fileList[values.order.fileList.length-1].imgURL!=undefined){
        drawing_address = values.drawing_address.fileList.map((item)=>{
          return item.imgURL.split("https://songshu-image.oss-cn-shanghai.aliyuncs.com/")[1]
        }).join(",");
      }


      let query=`order.order_describe=${values.describe}&order.orderState=12&order.successor=${values.successor}&order.successorPhone=${values.successorPhone}&order.drawingAddress=${drawing_address}&order.customerId=${values.custonId}&order.address=${values.address}&order.pmoney=${values.pmoney}&order.createTime=${contractDate}&order.signer=${values.signer}&order.fileAddress=${fileAddress}&order.text=`;
      axios
        .get(`${API_URL}/saveOrder.do?${query}`)
        .then((response)=>{
          if(response.data.state=="success"){
            Toast.success(response.data.msg);
            this.redirct()
          }else{
            Toast.error(response.data.msg);
          }
        })
        .catch((error)=>{})
     });
  };


  redirct = () => {
    this.props.redirct();
  }


  render() {
    const now = new Date();
    return (
      <div className="settings-form">
        <IceContainer>
          <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">

            <IceFormBinderWrapper
              value={this.state.value}
              onChange={this.formChange}
              ref="form"
            >
              <div style={styles.formContent}>

                <h2 style={styles.formTitle}>添加订单</h2>

                <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.label}>
                      选择客户：
                    </Col>
                    <Col span="10">
                        <IceFormBinder name="custonId" required  message="必传">
                          <Select
                            size="large"
                            placeholder="请选择..."
                            style={{width:"300px"}}
                            onChange={this.getValue}
                            dataSource={this.state.customData}
                          />
                        </IceFormBinder>
                        <IceFormError name="custonId" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.label}>
                      签约日期：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="contractDate" required  message="必传">
                        <DatePicker/>
                      </IceFormBinder>
                      <IceFormError name="contractDate" />
                    </Col>
                  </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    地址：
                  </Col>
                  <Col s="8" l="6">
                    <IceFormBinder name="address">
                      <Input size="large" placeholder="请输入订单地址" />
                    </IceFormBinder>
                    <IceFormError name="address" />
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    客户对接人：
                  </Col>
                  <Col s="8" l="6">
                    <IceFormBinder name="successor">
                      <Input size="large" placeholder="客户对接人" />
                    </IceFormBinder>
                    <IceFormError name="successor" />
                  </Col>
                </Row>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    对接人手机：
                  </Col>
                  <Col s="8" l="6">
                    <IceFormBinder name="successorPhone">
                      <Input size="large" placeholder="对接人联系方式" />
                    </IceFormBinder>
                    <IceFormError name="successorPhone" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                      签约人：
                  </Col>
                  <Col s="6" l="4">
                    <IceFormBinder name="signer">
                      <Input size="large" placeholder="请输入签约人" />
                    </IceFormBinder>
                    <IceFormError name="signer" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                      订单金额：
                  </Col>
                  <Col s="6" l="4">
                    <IceFormBinder name="pmoney">
                      <Input size="large" placeholder="请输入签约金额" />
                    </IceFormBinder>
                    <IceFormError name="pmoney" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    上传合同：
                  </Col>
                  <Col s="12" l="10" align="center">
                    <IceFormBinder name="order">
                      <Upload
                        listType="text-image"
                        action={`${API_URL}/uploadFile.do`}
                        name="file"
                        data={(file)=>{
                          return ({
                            dir: `order/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
                            type:1,
                            fileFileName: file.name
                          });
                        }}
                        beforeUpload={beforeUpload}
                        onChange={onChange}
                        onSuccess={onSuccess}
                        multiple
                        formatter = {formatter}
                        defaultFileList={[]}
                      >
                        <Button type="primary" style={{ margin: "0 0 10px" }}>
                          上传合同
                        </Button>
                      </Upload>
                    </IceFormBinder>
                    <IceFormError name="order" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    上传设计图纸：
                  </Col>
                  <Col s="12" l="10" align="center">
                    <IceFormBinder name="drawing_address" >
                      <Upload
                        listType="text-image"
                        action={`${API_URL}/uploadFile.do`}
                        name="file"
                        data={(file)=>{
                          return ({
                            dir: `design/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
                            type:2,
                            fileFileName: file.name
                          });
                        }}
                        beforeUpload={beforeUpload}
                        onChange={onChange}
                        onSuccess={onSuccess}
                        multiple
                        formatter = {formatter}
                        defaultFileList={[]}
                      >
                        <Button type="primary" style={{ margin: "0 0 10px" }}>
                          上传图纸
                        </Button>
                      </Upload>
                    </IceFormBinder>
                    <IceFormError name="order" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    备注：
                  </Col>
                  <Col s="12" l="10" align="center">
                      <IceFormBinder name="describe">
                        <Input size="large" placeholder="请填写备注" />
                      </IceFormBinder>
                  </Col>
                </Row>

              </div>
            </IceFormBinderWrapper>




          </Loading>
          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>

        </IceContainer>
      </div>
    );
  }
}




const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  button: {
    marginTop: "5px",
    marginRight: "5px"
  }
};
