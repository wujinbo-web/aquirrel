/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import axios from "axios";
import { API_URL } from './../../../../config';

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const Toast = Feedback.toast;


export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        size: '',
        count: '',
        content: '',
      },
    };
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
      //values.name:材料名 .size:规格 .count:库存量 .content备注
      console.log('errors', errors, 'values', values);
      axios
        .post(`${API_URL}/saveMaterials.do?materials.name=${values.name}&materials.size=${values.size}&materials.count=${values.count}&materials.remarks=${values.content}`)
          .then((response)=>{
            if(response.data.msg=="200"){
              Toast.success("添加成功");
              this.state.value={
                name: '',
                size: '',
                count: '',
                content: '',
              };
              this.setState({});
            }else{
              Toast.error(response.data.msg);
            }
          })
          .catch((error)=>{
            console.log(error);
          })
    });
  };

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

              <h2 style={styles.formTitle}>添加材料</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  材料名：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required max={10} message="必填">
                    <Input size="large" placeholder="请输入材料名" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  规格：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="size" required max={10} message="必填">
                    <Input size="large" placeholder="请输入规格" />
                  </IceFormBinder>
                  <IceFormError name="size" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  添加库存：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="count" required max={10} message="必填">
                    <Input size="large" placeholder="请输入入库量" />
                  </IceFormBinder>
                  <IceFormError name="count" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  备注：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="content">
                    <Input size="large" placeholder="请输入备注" />
                  </IceFormBinder>
                  <IceFormError name="content" />
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
};
