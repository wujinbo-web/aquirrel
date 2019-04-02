/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Button, Select, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { API_URL } from '@/config';
import axios from 'axios';
import { postUrl } from '@/api';
import { addGoods, queryGoodsSeries, queryGoodsType } from '@/api/apiUrl';

const { Row, Col } = Grid;
const Toast=Feedback.toast;

export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      typeList: [],
      seriesList: [],
      value: {
        name: '',
        type: null,
        series: null,
        description: '',
      },
    };
  }

  //改变的时候修改值
  formChange = (value) => {
    this.setState({
      value,
    });
  };

  //提交表单
  validateAllFormField = () => {
    this.refs.form.validateAll(async (errors, values) => {
      let response = await postUrl(addGoods, {
        "productClass.name": values.name,
        "productClass.classId": values.type,   //待定
        "productClass.depId": values.series,   //待定
        "productClass.description": value.description,
      });
      console.log(response.data);
    });
  };

  //获取类别列表
  getTypeData = async () => {
    let response = await postUrl(queryGoodsType,{pageIndex: 1, pageSize: 9999});
    this.state.typeList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //获取系列列表
  getSeriesData = async () => {
    let response = await postUrl(queryGoodsSeries,{pageIndex: 1, pageSize: 9999});
    this.state.seriesList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  render() {
    let { typeList, seriesList } = this.state;
    return (
      <div className="user-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>添加商品</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  商品名：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required message="必填">
                    <Input
                      size="large"
                      placeholder="请输入商品名"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  类别：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="type" required message="必填">
                    <Select dataSource={typeList} placeholder="请选择商品类别" style={{ width: '100%' }} />
                  </IceFormBinder>
                  <IceFormError name="type" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  系列：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="series" required message="必填">
                    <Select dataSource={seriesList} placeholder="请选择商品系列" style={{ width: '100%' }} />
                  </IceFormBinder>
                  <IceFormError name="series" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  描述：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="description">
                    <Input
                      size="large"
                      placeholder="请输入描述"
                      style={{ width: '100%' }}
                    />
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
