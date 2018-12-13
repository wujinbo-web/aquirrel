/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { Grid, Input, Button, Select, DatePicker } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;

export default class Filter extends Component {
  static displayName = 'Filter';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        startTime:"",
        endTime:"",
      },
    };
  }

  GMTToStr = (time) => {
    if(time =="")return "";
    let date = new Date(time)
    let Str=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return Str
  }

  formChange = (value) => {
    this.props.getIndexData(this.GMTToStr(value.startTime), this.GMTToStr(value.endTime), value.factoryId);
    this.setState({
      value,
    });
  };

  render() {
    return (
      <IceFormBinderWrapper
        value={this.state.value}
        onChange={this.formChange}
        ref="form"
      >
        <Row wrap gutter="20" style={styles.formRow}>

          <Col l="8">
            <div style={styles.formItem}>
              <span style={styles.formLabel}>开始日期：</span>
              <IceFormBinder triggerType="onBlur">
                <DatePicker
                  name="startTime"
                  size="large"
                  style={{ width: '200px' }}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="date" />
              </div>
            </div>
          </Col>

          <Col l="8">
            <div style={styles.formItem}>
              <span style={styles.formLabel}>结束日期：</span>
              <IceFormBinder triggerType="onBlur">
                <DatePicker
                  name="endTime"
                  size="large"
                  style={{ width: '200px' }}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="date" />
              </div>
            </div>
          </Col>

          <Col l="8">
            <div style={styles.formItem}>
              <span style={styles.formLabel}>选择工厂：</span>
              <IceFormBinder triggerType="onBlur">
                <Select
                  name="factoryId"
                  style={{width:"200px"}}
                  size="large"
                  placeholder="请选择..."
                  dataSource={[{label:"全部",value:""},{label:"南京厂",value:1},{label:"滁州厂",value:2},{label:"山东厂",value:3}]}
                />
              </IceFormBinder>
              <div style={styles.formError}>
                <IceFormError name="text" />
              </div>
            </div>
          </Col>

        </Row>
      </IceFormBinderWrapper>
    );
  }
}

const styles = {
  container: {
    margin: '20px',
    padding: '0',
  },
  title: {
    margin: '0',
    padding: '20px',
    fonSize: '16px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: 'rgba(0,0,0,.85)',
    fontWeight: '500',
    borderBottom: '1px solid #eee',
  },
  formRow: {
    padding: '10px 20px',
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  formLabel: {
    minWidth: '70px',
  },
};
