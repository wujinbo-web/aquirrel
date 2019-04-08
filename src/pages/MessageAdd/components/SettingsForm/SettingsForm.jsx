/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import { API_URL } from '@/config';
import { Input, Button, Radio, Switch, Grid, Select, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import { postUrl } from '@/api'
import { userList } from '@/api/apiUrl'
import BraftEditor from '@/components/BraftEditor'


const Toast = Feedback.toast;
const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const { Combobox } = Select;



export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        msgType: 'personal',
        name: [],
        title: '',
        description: '',
        styleType: 'normal'
      },
      person:[],  //渲染select数据  用户列表
      msgType: "personal",
      styleType: 'normal'
    };
  }

  componentDidMount() {
    this.getUserList();
  }

  //获取用户列表
  getUserList = async () => {
    let response = await postUrl(userList,{pageSize: 999});
    if(response.data.state=="success"){
      let data=response.data.data.map((item)=>{
        return ({label: item.name, value: item.id});
      }).filter(item=>item.value!=sessionStorage.id)
      this.setState({ person: data });
      console.log(data,"看看");
    }else{
      Toast.error(response.data.msg);
    }
  }

  //修改表单数据
  formChange = (value) => {
    console.log(value);
    this.setState({
      value,
    });
  };

  //发送消息
  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      console.log(values);
      if(errors)return;

      let targetId; //目标Id
      if(values.msgType=="system"){//判断为系统消息
        let data=this.state.person.map((item)=>{   //[4,5,6]
          return item.value;
        }).filter(item=>item!=sessionStorage.id);
        targetId=data.join(',');  //4,5,6
      }else if(values.msgType=="personal"){
        targetId=values.name;   // 4
      }else{
        targetId=values.name.join(',');
      }
      axios
        .get(`${API_URL}/saveMessage.do?${values.msgType=="system"?`messageParent.type=3`:""}&targetId=${targetId}&messageParent.messageHeader=${values.title}&messageParent.messageContent=${values.description}&messageParent.cmsUserId=${sessionStorage.id}`)
        .then((response)=>{
          if(response.data.state=="success"){
            Toast.success(response.data.msg);
            this.props.redirectUrl();
          }else{
            Toast.error(response.data.msg);
          }
        })
        .catch((error)=>{
          console.log(error);
        })
    });
  };

  //修改消息类型
  changeMsg = (value) => {
    if(value=="personal"){
      this.state.value.name=[];
    }
    this.setState({ msgType: value });
  }

  //修改样式类型
  changeStyle = (value) => {
    this.setState({ styleType: value });
  }

  render() {
    let { msgType, styleType } = this.state;
    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>发送消息</h2>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    消息类型：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="msgType">
                      <RadioGroup onChange={this.changeMsg} value={this.state.msgType}>
                        <Radio value="personal">个人消息</Radio>
                        <Radio value="somePersonal">多人消息</Radio>
                        {
                          localStorage.getItem("ice-pro-authority")=="admin" ? <Radio value="system">系统消息</Radio> : ""
                        }

                      </RadioGroup>
                    </IceFormBinder>
                    <IceFormError name="msgType" />
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    消息样式：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="styleType">
                      <RadioGroup onChange={this.changeStyle} value={this.state.styleType}>
                        <Radio value="normal">普通文本</Radio>
                        <Radio value="chaowenben">样式文本</Radio>
                      </RadioGroup>
                    </IceFormBinder>
                    <IceFormError name="styleType" />
                  </Col>
                </Row>

                {
                  this.state.msgType=="system"?"":
                  <Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.label}>
                        收件人：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="name" required message="必填">
                        <Combobox
                          dataSource={this.state.person}
                          placeholder="请选择收件人"
                          style={{width:"400px"}}
                          filterLocal={false}
                          fillProps="label"
                          multiple={msgType=="personal"?false:true}
                        />
                      </IceFormBinder>
                      <IceFormError name="name" />
                    </Col>
                  </Row>
                }


              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  标题：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="title" required message="必填">
                    <Input size="large" placeholder="标题" />
                  </IceFormBinder>
                  <IceFormError name="title" />
                </Col>
              </Row>

              {
                styleType=="normal"?
                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    正文：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="description" required message="必填">
                      <Input size="large" multiple placeholder="请输入描述..." />
                    </IceFormBinder>
                    <IceFormError name="description" />
                  </Col>
                </Row>
                :
                <Row style={styles.formItem}>
                  <Col xxs="6" s="3" l="3" style={styles.label}>
                    正文：
                  </Col>
                  <Col s="12" l="16" style={{border:"1px solid #ccc"}}>
                    <IceFormBinder name="description" required message="必填">
                      <BraftEditor />
                    </IceFormBinder>
                    <IceFormError name="description" />
                  </Col>
                </Row>
              }


            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                发送
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
};
