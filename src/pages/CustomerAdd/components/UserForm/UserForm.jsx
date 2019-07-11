/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import { Input, Grid, Button, Select, Radio, Feedback, Loading  } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { API_URL } from '../../../../config';

const Toast = Feedback.toast;
const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;


export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        sex: '1',  //性别默认是1 男
        phone: '',
        address: ''
      },
      visible: false,
    };
  }
  //表单数据提取
  formChange = (value) => {
    this.setState({
      value,
    });
  };
  //提交表单
  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if(errors!=null) return;
      this.setState({ visible: true });
      //请求接口
      axios
        .get(`${API_URL}/saveCustomer.do?customer.name=${values.name}&customer.sex=${values.sex}&customer.phone=${values.phone}&customer.address=${values.address}&customer.level=1`)
        .then((response)=>{
          this.setState({ visible: false });
          if(response.data.state==="success"){
            Toast.success("message");
            //执行由父组件传来的跳转
            this.props.redirectUrl();
          }else {
            Toast.error("message");
          }
        })
        .catch(error=>{
          console.log(error);
        })
    });
  };


  render() {
    return (
      <div className="user-form">
        <IceContainer>

          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
              <div style={styles.formContent}>

                <h2 style={styles.formTitle}>添加客户</h2>

                <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">


                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                      客户姓名：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="name" required message="必填">
                        <Input
                          size="large"
                          placeholder="请输入姓名"
                          style={{ width: '100%' }}
                        />
                      </IceFormBinder>
                      <IceFormError name="name" />
                    </Col>
                  </Row>



                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                      性别：
                    </Col>
                    <Col s="12" l="10" align="center" >
                      <IceFormBinder name="sex">
                        <RadioGroup value={this.state.value.sex} >
                            <Radio id="nan" value="1">
                              男
                            </Radio>
                            <Radio id="nv" value="0">
                              女
                            </Radio>
                        </RadioGroup>
                      </IceFormBinder>
                      <IceFormError name="sex" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                      手机号：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder
                        name="phone"
                      >
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="请输入手机号"
                        />
                      </IceFormBinder>
                      <IceFormError name="phone" />
                    </Col>
                  </Row>

                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                      地址：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="address" >
                        <Input
                          size="large"
                          placeholder="请输入地址"
                          style={{ width: '100%' }}
                        />
                      </IceFormBinder>
                      <IceFormError name="address" />
                    </Col>
                  </Row>

                </Loading>

              </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
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
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    marginBottom: 25,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
