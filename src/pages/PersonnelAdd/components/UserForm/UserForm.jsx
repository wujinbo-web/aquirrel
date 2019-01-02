/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import { Input, Grid, Button, Select, Radio, Feedback, DatePicker  } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { API_URL } from '../../../../config';

const { Row, Col } = Grid;
const Toast = Feedback.toast;
const { Group: RadioGroup } = Radio;


export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        account: '',
        birthday: '',
        name: '',
        sex: '1',
        departmentId: '',
        passwd: '',
        rePasswd: '',
      },
      departmentId: [],
      rule:[
        {label: "超级管理员",value: "admin"},
        {label: "普通管理员",value: "normAdmin"},
        {label: "财务", value:"finance"},
        {label: "设计", value:"measure"},
        {label: "生产", value:"product"},
        {label: "工程", value:"project"},
        {label: "采购", value:"purchase"},
        {label: "业务", value:"firm"},
      ]
    };
  }

  componentDidMount = () =>{
    //请求部门接口
    axios
      .get(`${API_URL}/findAllDepartment.do`)
      .then((response)=>{
        if(response.data.state=="success"){
          let departmentId=response.data.data.map((item)=>{
            return ({label:item.departmentName, value: item.id});
          })
          this.setState({ departmentId });
        }else{
          Toast.error(response.data.msg);
        }
      })
      .catch(error=>{
        console.log(error);
      })
  }

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入新密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  checkPasswd2 = (rule, values, callback, stateValues) => {
    if (values && values !== stateValues.passwd) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
        //values
        //account: "admin"
        // departmentId: 1
        // name: "adsds"
        // passwd: "11111111"
        // rePasswd: "11111111"
        // sex: "1"
        //添加人员接口
        //GMT转化日期
        let date = new Date(values.birthday);
        let birthday=date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();
        axios
          .get(`${API_URL}/saveCmsUser.do?cmsUser.roleId=${values.roleId}&cmsUser.account=${values.account}&cmsUser.name=${values.name}&cmsUser.password=${values.passwd}&cmsUser.birthday=${birthday}&cmsUser.sex=${values.sex}&cmsUser.departmentId=${values.departmentId}`)
          .then((response)=>{
            if(response.data.state=="success"){
              Toast.success("添加成功");
              console.log(this);
              this.props.redirectUrl();
            }else{
              Toast.error(response.data.msg);
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
              <h2 style={styles.formTitle}>添加用户</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  账号：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="account" required message="必填">
                    <Input
                      size="large"
                      placeholder="请输入登陆账号"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  <IceFormError name="account" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  姓名：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name">
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
                  选择部门：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="departmentId">
                    <Select
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="请选择..."
                      dataSource={this.state.departmentId}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  选择权限：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="roleId">
                    <Select
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="请选择..."
                      dataSource={this.state.rule}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  生日：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="birthday">
                    <DatePicker/>
                  </IceFormBinder>
                  <IceFormError name="birthday" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  密码：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="passwd"
                    required
                    validator={this.checkPasswd}
                  >
                    <Input
                      style={{ width: '100%' }}
                      htmlType="password"
                      size="large"
                      placeholder="请重新输入新密码"
                    />
                  </IceFormBinder>
                  <IceFormError name="passwd" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  确认密码：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="rePasswd"
                    required
                    validator={(rule, values, callback) =>
                      this.checkPasswd2(
                        rule,
                        values,
                        callback,
                        this.state.value
                      )
                    }
                  >
                    <Input
                      style={{ width: '100%' }}
                      htmlType="password"
                      size="large"
                      placeholder="两次输入密码保持一致"
                    />
                  </IceFormBinder>
                  <IceFormError name="rePasswd" />
                </Col>
              </Row>
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
