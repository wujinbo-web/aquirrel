import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Loading } from '@icedesign/base';
import ContainerTitle from './ContainerTitle';
import axios from 'axios';
import { API_URL } from './../../../../config';

const { Row, Col } = Grid;

export default class Overview extends Component {
  static displayName = 'Overview';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      mockData: [],
      mockData2: [],
      visible: true,
    };
  }
  componentDidMount = () => {
    axios
      .get(`${API_URL}/sumToday.do`)
      .then((response)=>{
        let data=response.data.sum;
        // customerrNum: 1
        // endTodayOrderNum: 1
        // receipt: 0
        // todayOrderAddNum: 1
        // totalOrderEndNum: 1
        // totalOrderNum: 2
        // unReceipt: 0
        // userNum: 1
        this.state.mockData=[
          {
            title: '新增订单数',
            value: data.todayOrderAddNum,
          },
          {
            title: '完结订单数',
            value: data.endTodayOrderNum,
          },
          {
            title: '收款金额',
            value: data.receipt,
          },
        ];
        this.state.mockData2=[
          {
            title: '总订单数',
            value: data.totalOrderNum,
          },
          {
            title: '总完成数',
            value: data.totalOrderEndNum,
          },
          {
            title: '总员工数',
            value: data.userNum,
          },
          {
            title: '总客户数',
            value: data.customerrNum,
          },
        ];
        this.state.visible=false;
        this.setState({});
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  render() {
    const { mockData, mockData2 } = this.state;
    return (
      <div>
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
          <ContainerTitle title="今日概览" />
          <IceContainer style={styles.container}>
            <Row>
              <Col l="4" xxs="3">
                <div style={styles.item}>
                  <img src={require('./images/logo.png')} alt="" />
                </div>
              </Col>
              {mockData.map((item, index) => {
                return (
                  <Col l="4" key={index}>
                    <div style={styles.item}>
                      <p style={styles.itemTitle}>{item.title}</p>
                      <p style={styles.itemValue}>{item.value}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
          <ContainerTitle title="总统计" />
          <IceContainer style={styles.container}>
            <Row>
              {mockData2.map((item, index) => {
                return (
                  <Col l="4" key={index}>
                    <div style={styles.item}>
                      <p style={styles.itemTitle}>{item.title}</p>
                      <p style={styles.itemValue}>{item.value}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
        </Loading>
      </div>
    );
  }
}

const styles = {
  item: {
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    color: '#fff',
    fontSize: '14px',
  },
  itemValue: {
    color: '#fff',
    fontSize: '36px',
    marginTop: '10px',
  },
  container: {
    background: `url("${require("./images/bg.png")}") no-repeat 100%/100%`,
  },
};
