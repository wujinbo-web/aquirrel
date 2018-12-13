/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Button, Select, Feedback, Loading } from '@icedesign/base';
import axios from 'axios';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { API_URL } from '../../../../config';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        leadingId: '',
        description: '',
      },
      visible: false,
    };
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if(errors!=null) return;
      this.setState({ visible: true });
      axios
        .get(`${API_URL}/saveDepartment.do?department.departmentName=${values.name}&department.departmentHeadId=1&department.departmentDescription=${values.description}`)
        .then((response)=>{
          this.setState({ visible: false });
          if(response.data.state==="success"){
            Toast.success("message");
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
              <h2 style={styles.formTitle}>添加部门</h2>

              <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  部门名称：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required message="必填">
                    <Input
                      size="large"
                      placeholder="请输入部门名称"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  部门描述：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="description"
                  >
                    <Input
                      multiple
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="请输入部门描述"
                    />
                  </IceFormBinder>
                  <IceFormError name="description" />
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
