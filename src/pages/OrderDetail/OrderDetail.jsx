import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Button, Upload, Loading, Table } from '@icedesign/base';
import { API_URL } from './../../config';
import axios from 'axios';
import { queryCountList } from './../../api';
import getStatusName from '@/tool/getStatusName';

const { Row, Col } = Grid;
const { ImageUpload } = Upload;

export default class OrderDetail extends Component {
  static displayName = 'OrderDetail';

  constructor(props) {
    super(props);
    this.state = {
      id: sessionStorage.order_id,
      dataSource: {
        name:'',
        phone:'',
        orderState: '',
        financeState: '',
        signer: '',
        address: '',
        createTime: '',
        fileAddress:'',
        drawingAddress:'',
        append: '',
        totalMoney: '',
        pmoney: '',
      },
      tableData:[],
      tableHead: [],
      visible: true,
    };
  }
  componentDidMount = () =>{
    this.getIndexData();
  }

  getIndexData = () => {
    axios
      .get(`${API_URL}/findOrder.do?id=${this.state.id}`)
      .then((response)=>{
        console.log(response.data,"数据");
        let arr=response.data.data[0];
        let dataSource={
          name:arr.name,
          phone: arr.phone,
          orderState:getStatusName(arr.order.orderState),
          financeState:arr.order.financeState==0?"未结清":"已结清",
          signer:arr.order.signer,
          address: arr.order.address,
          createTime: arr.order.createTime.slice(0,11),
          fileAddress:arr.order.fileAddress,
          append: arr.order.append,
          totalMoney: arr.order.totalMoney,
          pmoney: arr.order.pmoney,
          drawingAddress: arr.order.drawingAddress,
          successor: arr.order.successor,  //签约人
          successorPhone: arr.order.successorPhone,  //签约电话
        }

        if(arr.order.text==""){
          console.log("不做处理");
        }else{
          //如果
          this.getCountList();
        }
        this.setState({dataSource, visible: false });
      })
      .catch((error)=>{console.log(error);})
  }

  getCountList = async () => {
    const { id } = this.state;
    const response = await queryCountList({ orderId: id });
    //console.log(response.data.list);
    let arrayData = response.data.list.map((item)=>{
        return item.order;
    });
    //[{1F:11,2F:22,classId:3....},{1F:11,2F,.....}]
    let data=arrayData.map((item)=>{
      let key;
      let count=0;
      for(key in item){
        if(key!="name"&&key!="size"&&key!="remarks"&&key!="jputNum"&&key!="joutNum"&&key!="count"&&key!="classId"&&key!="installNum"&&key!="proNum"&&key!="dputNum"&&key!="doutNum"&&key!="uninstallNum"&&key!="unproNum"){
          count+=Number(item[key]);
        }
      }
      item.heji=count;
      return item;
    })
    console.log(data);
    //渲染导航条
    let component=[];
    let key;
    component.push("name");
    component.push("size");
    for( key in data[0]){
      if(key!="name"&&key!="jputNum"&&key!="joutNum"&&key!="dputNum"&&key!="doutNum"&&key!="heji"&&key!="proNum"&&key!="size"&&key!="remarks"&&key!="count"&&key!="classId"&&key!="installNum"&&key!="uninstallNum"&&key!="unproNum"){
        component.push(key);
      }
    }
    component.push('heji');
    component.push('remarks');
    component.push('count');
    component.push('proNum');
    component.push('unproNum');
    component.push('dputNum');
    component.push('doutNum');
    component.push('joutNum');
    component.push('installNum');
    component.push('uninstallNum');
    this.setState({tableData: data,tableHead:component});

  }

  getTabelHeadName = (key) =>　{
    if(key == "name"){
      return "名称";
    } else if (key == "size"){
      return "规格";
    } else if (key == "remarks"){
       return "备注";
    }else if (key == "heji"){
       return "合计";
    }else if (key == "count"){
       return "开料数";
    }else if (key == "unproNum"){
       return "待生产";
    }else if (key == "proNum"){
       return "已生产";
    }else if (key == "dputNum"){
       return "入库数";
    }else if (key == "doutNum"){
       return "出库数";
    }else if (key == "jputNum"){
       return "入货数";
    }else if (key == "joutNum"){
       return "出货数";
    }else if (key == "installNum"){
       return "安装数";
    }else if (key == "uninstallNum"){
       return "待安装";
    } else{
      return key
    }
  }

  render() {
    const id= this.state.id;
    const { tableData, tableHead } = this.state;
    let {name,phone,orderState,financeState,signer,address,createTime,fileAddress,append,totalMoney,pmoney, drawingAddress} = this.state.dataSource
    return (
      <div className="order-detail-page" >
        <Loading visible={this.state.visible} style={{display: 'block'}} shape="fusion-reactor">
        <IceContainer>
          <Row>
            <h2 style={{borderBottom: "1px solid #333", width:"100%", fontWeight:"blod"}}>订单id:{id}</h2>
          </Row>
          <Row>
            <Col l="6" style={{ marginRight: "20px" }}>
              <Row style={styles.item} >订单状态：{orderState}</Row>
              <Row style={styles.item} >财务状态：{financeState}</Row>
              <Row style={styles.item} >签约金额：{pmoney==null?"0":pmoney}元</Row>
            </Col>
            <Col l="6" style={{ marginRight: "20px" }}>
              <Row style={styles.item} >客户：{name}</Row>
              <Row style={styles.item} >手机：{phone}</Row>
            </Col>
            <Col l="6">
              <Row style={styles.item} >签约人：{signer}</Row>
              <Row style={styles.item} >地点：{address}</Row>
              <Row style={styles.item} >签约时间：{createTime}</Row>
            </Col>
          </Row>

          <Table dataSource={tableData}>
            {
              tableHead.map((key,index)=>{
                return (<Table.Column title={this.getTabelHeadName(key)} key={index} dataIndex={key}/>)
              })
            }
          </Table>
          <Row style={styles.title} >订单流程：</Row>
          <Row>
            <Col>
              <Row style={styles.item} l="6"><span style={orderState=="建立合同订单"?{color:"red",fontWeight:"bold"}: {}}>1 建立合同订单</span></Row>
              <Row style={styles.content}>
                下载合同：
                {
                  fileAddress.split(',').map((item,index)=>{
                    return (
                      <Button
                        key={index}
                        onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
                      >
                        合同{index+1}
                      </Button>
                    );
                  })
                }
                下载设计图：
                  {
                    drawingAddress.split(',').map((item,index)=>{
                      return (
                        <Button
                          key={index}
                          onClick={()=>{window.open(`https://songshu-image.oss-cn-shanghai.aliyuncs.com/${item}`)}}
                        >
                          设计图{index+1}
                        </Button>
                      );
                    })
                  }

              </Row>
              <Row style={styles.item} l="6"><span style={orderState=="总单填写（完成）"?{color:"red",fontWeight:"bold"}: {}}>2 总单填写（完成）</span></Row>
              <Row style={styles.content} l="6">
                <Button
                  onClick={()=>{
                    sessionStorage.design_orderId=id;
                    sessionStorage.design_address=address;
                    this.props.history.push('/design/floor');
                  }}
                >
                  查看测量表
                </Button>
              </Row>
              <Row style={styles.item} l="6"><span style={orderState=="测量完成"?{color:"red",fontWeight:"bold"}: {}}>3 测量完成</span></Row>
                <Row style={styles.content}>
                  <Button
                    onClick={()=>{
                      sessionStorage.design_orderId=id;
                      sessionStorage.design_address=address;
                      this.props.history.push('/design/floor');
                    }}
                  >
                    查看测量表
                  </Button>
                </Row>
              <Row style={styles.item} l="6"><span style={orderState=="设计完成"?{color:"red",fontWeight:"bold"}: {}}>4 设计完成</span></Row>
                <Row style={styles.content}>
                  <Button
                    onClick={()=>{
                      sessionStorage.design2_orderId=id;
                      this.props.history.push('/desgin/lailiao');
                    }}
                  >
                    查看开料单
                  </Button>
                </Row>
              <Row style={styles.item} l="6"><span style={orderState=="生产完成"?{color:"red",fontWeight:"bold"}: {}}>5 生产完成</span></Row>
                <Row style={styles.content}>
                  <Button
                    onClick={()=>{
                      sessionStorage.produc_orderId=id;
                      this.props.history.push('/produc/list');
                    }}
                  >
                    查看生产清单
                  </Button>
                </Row>
            </Col>
            <Col>
              <Row style={styles.item} l="6"><span style={orderState=="生产部入库完成"?{color:"red",fontWeight:"bold"}: {}}>6 生产部入库完成</span></Row>
                <Row style={styles.content}>
                  <Button
                    onClick={()=>{
                      sessionStorage.produc_orderId2=id;
                      this.props.history.push('/produc/putin');
                    }}
                  >
                    查看入库单
                  </Button>
                </Row>
              <Row style={styles.item} l="6"><span style={orderState=="生产部出库完成"?{color:"red",fontWeight:"bold"}: {}}>8 生产部出库完成</span></Row>
                <Row style={styles.content}>
                  <Button
                    onClick={()=>{
                      sessionStorage.produc_orderId3=id;
                      this.props.history.push('/produc/putout');
                    }}
                  >
                    查看出库单
                  </Button>
                </Row>
                <Row style={styles.item} l="6"><span style={orderState=="工程部收货完成"?{color:"red",fontWeight:"bold"}: {}}>9 工程部收货完成</span></Row>
                  <Row style={styles.content}>
                    <Button
                      onClick={()=>{
                        sessionStorage.project_orderId2=id;
                        this.props.history.push('/project/putout');
                      }}
                    >
                      查看收货单
                    </Button>
                  </Row>
                  <Row style={styles.item} l="6"><span style={orderState=="安装完成增项中"?{color:"red",fontWeight:"bold"}: {}}>10 安装完成增项中</span></Row>
                    <Row style={styles.content}>
                      <Button
                        onClick={()=>{
                          sessionStorage.project_orderId3=id;
                          this.props.history.push('/project/preinstall');
                        }}
                      >
                        查看出货单
                      </Button>
                    </Row>
              <Row style={styles.item} l="6"><span style={orderState=="完成订单"?{color:"red",fontWeight:"bold"}: {}}>11 完成订单</span></Row>
                <Row style={styles.content}>
                  增项:{append==null?"暂无":append}
                </Row>
            </Col>
          </Row>


        </IceContainer>
        </Loading>
      </div>
    );
  }
}
const styles = {
  money:{
    height: "30px",
    lineHeight: "30px",
    textAlign: "center",
    border: "1px solid #000",
  },
  title:{
    fontSize: "30px",
    marginTop: "10px",
  },
  content: {
    padding: "10px",
    height:"40px",
    lineHeight: "40px",
  },
  item:{
    fontSize: "16px",
    height: "30px",
    lineHeight: "30px",
    borderBottom: "1px solid #eee",
    color:"black",

  }
}
