/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { Input, Button, Radio, Switch, Grid, Select, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';

const Toast = Feedback.toast;
const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;



export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        msgType: 'personal',
        name: '',
        title: '',
        description: '',
      },
      person:[],  //渲染select数据
      msgType: "personal",
    };
  }

  componentDidMount = () => {
    axios
      .post(`${API_URL}/findCmsUserBySearch.do?&pageIndex=1`)
      .then((response)=>{
        if(response.data.state=="success"){
          console.log(response.data);
          let data=response.data.data.map((item)=>{
            return ({label: item.name, value: item.id});
          })
          console.log(data,"看看");
          this.setState({ person: data });
        }else{
          Toast.error(response.data.msg);
        }
        console.log(response.data,"客户接口");

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
    console.log('value', value);
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      console.log('errors', errors, 'values', values);
      let targetId; //目标Id
      if(values.msgType=="system"){//判断为系统消息
        let data=this.state.person.map((item)=>{   //[4,5,6]
          return item.value;
        })
        targetId=data.join(',');  //4,5,6
      }else{
        targetId=values.name;   // 4
      }
      axios
        .get(`${API_URL}/saveMessage.do?targetId=${targetId}&messageParent.messageHeader=${values.title}&messageParent.messageContent=${values.description}`)
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
    this.setState({ msgType: value });
    console.log(value);
  }

  getValue = (value) => {
    console.log(value);
  }
  render() {
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
                        {
                          localStorage.getItem("ice-pro-authority")=="admin" ? <Radio value="system">系统消息</Radio> : ""
                        }

                      </RadioGroup>
                    </IceFormBinder>
                    <IceFormError name="msgType" />
                  </Col>
                </Row>

                {
                  this.state.msgType=="system"?"":<Row style={styles.formItem}>
                    <Col xxs="6" s="3" l="3" style={styles.label}>
                        收件人：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="name" required message="必填">
                        <Select
                          size="large"
                          placeholder="请选择收件人..."
                          onChange={this.getValue}
                          dataSource={this.state.person}
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
                  <IceFormBinder name="title" required max={10} message="必填">
                    <Input size="large" placeholder="于江水" />
                  </IceFormBinder>
                  <IceFormError name="title" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  正文：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="description">
                    <Input size="large" multiple placeholder="请输入描述..." />
                  </IceFormBinder>
                  <IceFormError name="description" />
                </Col>
              </Row>
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
