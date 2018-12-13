import React, { Component } from 'react';
import { Button, Table, Feedback, Input  } from '@icedesign/base';
import IceContainer  from '@icedesign/container';
import { Grid } from '@icedesign/base';
import { postQueryKailiao, postUpdateKailiao, postDeleteKailiao, postAddAparts, postUpdateState, postUpdateKaiList } from './../../api';
import AddItem from './components/AddItem';
import { API_URL } from './../../config';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

export default class DesignKailiaoList extends Component {
  static displayName = 'DesignKailiaoList';

  constructor(props) {
    super(props);
    this.state = {
      orderId:sessionStorage.design2_orderId,
      kailiaoId: sessionStorage.desgin2_kailiaoId,
      kailiaoName: sessionStorage.desgin2_kailiaoName,
      kailiaoSize: sessionStorage.desgin2_kailiaoSize,
      kailiaoCount: sessionStorage.desgin2_kailiaoCount,
      kailiaoRemark: sessionStorage.desgin2_kailiaoRemark,
      kailiaoState: sessionStorage.desgin2_kailiaoState,
      dataSource: [],
    };
  }

  componentDidMount(){
    this.getIndexData();
  }

  //确认开料
  enSureKailiao = async () => {
    const data = await postUpdateState({orderMaterialsRecordId:sessionStorage.desgin2_kailiaoId ,State:1});
    if(data.data.state=="success"){
      Toast.success("确认成功，进入生产部等待生产");
      this.props.history.push("/desgin/lailiao");
    }
  }

  //添加部件
  getFormValues = async (partsData) =>{
    const data = await postAddAparts({names:partsData.join(","),uuid:sessionStorage.desgin2_kailiaoId});
    if(data.data.state=="success"){
      Toast.success("添加成功");
      this.getIndexData();
    }
  }

  //获取列表数据
  getIndexData = async () => {
    const data = await postQueryKailiao({ recordId: sessionStorage.desgin2_kailiaoId });
    //data.data.list//count: null// countColor: "0"// demand: null// demandColor: "0"// id: 36// materials: null  材料名// materialsColor: "0"// name: "角"  部件名
    // nameColor: "0"// recordId: "084db49728e3461abbc65b0dbb269e77"// size: null// sizeColor: "0"
    let dataSource = data.data.list.map((item,index)=>{
      return({
        index:index+1,
        name:item.name,
        size:item.size,
        count:item.count,
        materials: item.materials,
        demand: item.demand,
        id: item.id,
      })
    })
    this.setState({ dataSource });
  }

  //渲染表格输入框
  renderName = (valueKey, value, index, record) => {
    //console.log(valueKey, value, index, record,"看看");
    //size, undefined, 0,recoed
    if(valueKey=="option"){
      return (
        <Button size="small" shape="warning" onClick={this.deleteItem.bind(this,index,record, valueKey)}>删除</Button>
      )
    }else{
      return (
        <Input
          style={{width:"100%"}}
          value={this.state.dataSource[index][valueKey]==null ? "" :this.state.dataSource[index][valueKey]}
          onChange={this.changeTabelData.bind(this, index, record, valueKey)}
          onBlur={this.changeTabelDataApi.bind(this, index, record, valueKey)}
        />
      );
    }

  }

  //删除项
  deleteItem = async (index, record, valueKey) => {
    console.log(index, record, valueKey);
    const data = await postDeleteKailiao({id: record.id});
    console.log(data);
    if(data.data.state=="success"){
      Toast.success("操作成功");
      this.state.dataSource.splice(index, 1);
      this.setState({});
    }
  }

  //监控数据变化
  changeTabelData = (index, record, valueKey, value) => {
    //0 ,{} "siez" 2
    this.state.dataSource[index][valueKey]=value;
    this.setState({});
  }

  //失焦请求数据
  changeTabelDataApi = async (index, record, valueKey) =>{
    //0, {}, size
    let params,key;
    if(valueKey=="size"){
      params={id:record.id,recordId:sessionStorage.desgin2_kailiaoId, size: record[valueKey] };
      key="Size";
    }else if (valueKey=="count"){
      params={id:record.id,recordId:sessionStorage.desgin2_kailiaoId, count: record[valueKey] };
      key="Count";
    }else if (valueKey=="materials"){
      params={id:record.id,recordId:sessionStorage.desgin2_kailiaoId, materials: record[valueKey] };
      key="Materials";
    }else if (valueKey=="demand"){
      params={id:record.id,recordId:sessionStorage.desgin2_kailiaoId, demand: record[valueKey] };
      key="Demand";
    }else if (valueKey=="name"){
      params={id:record.id,recordId:sessionStorage.desgin2_kailiaoId, name: record[valueKey] };
      key="Name";
    }
    const data = await postUpdateKailiao(params,key);
    console.log(data);
  }

  //监控记录单数据变化
  changeData = (type, value) => {
    if(type=="size"){
      this.setState({kailiaoSize: value});
    }else if (type=="count"){
      this.setState({kailiaoCount: value});
    }else if (type=="remark"){
      this.setState({kailiaoRemark: value});
    }
  }

  //失焦修改
  changeDataApi = async (type) => {
    const { kailiaoName, kailiaoSize, kailiaoCount, kailiaoRemark } =this.state;
    let params,key;
    if (type=="size"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, size: kailiaoSize };
      key="Size";
    }else if (type=="count"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, count: kailiaoCount };
      key="Count";
    }else if (type=="remark"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, remark: kailiaoRemark };
      key="Remark";
    }
    const data = await postUpdateKaiList(params,key);
    if(data.data.state=="success"){
      if(type=="size"){
        sessionStorage.desgin2_kailiaoSize=kailiaoSize;
      }else if (type=="count"){
        sessionStorage.desgin2_kailiaoCount=kailiaoCount;
      }else if (type=="remark"){
        sessionStorage.desgin2_kailiaoRemark=kailiaoRemark;
      }
    }

  }

  //下载excel表格
  installExcel = async () => {
    const { orderId, kailiaoId} = this.state;
     window.location.href=`${API_URL}/materialsExcel.do?orderId=${orderId}&recordId=${kailiaoId}`;
  }

  render() {
    const { dataSource,orderId, kailiaoId, kailiaoName, kailiaoSize, kailiaoCount, kailiaoRemark, kailiaoState} = this.state;
    return (
      <div className="design-kailiao-list-page" >
        <IceContainer>
          <h2 style={styles.tabelH2}>产品开料单{kailiaoState==0?"(编辑中)":"(已同步生产部)"}</h2>
          <Row style={styles.tabelRow}>
            <Col span="3" style={styles.tabelCol}>订单id:{orderId}</Col>
            <Col span="4" style={styles.tabelCol}>产品名称:{kailiaoName}</Col>
            <Col span="4" style={styles.tabelCol}>
              规格:<Input
              style={{width:"80px"}}
              value={kailiaoSize}
              onChange={this.changeData.bind(this,"size")}
              onBlur={this.changeDataApi.bind(this, "size")}
              />
            </Col>
            <Col span="3" style={styles.tabelCol}>
              数量:<Input
              style={{width:"50px"}}
              value={kailiaoCount}
              onChange={this.changeData.bind(this,"count")}
              onBlur={this.changeDataApi.bind(this, "count")}
              />
            </Col>
            <Col span="7" style={styles.tabelCol}>
              备注:<Input
              style={{width:"180px"}}
              value={kailiaoRemark}
              onChange={this.changeData.bind(this,"remark")}
              onBlur={this.changeDataApi.bind(this, "remark")}
              />
            </Col>
            <Col style={styles.tabelCol}><AddItem getFormValues={this.getFormValues} /></Col>
          </Row>
          <Table dataSource={dataSource}>
            <Table.Column title="序号" dataIndex="index" width={60} />

            <Table.Column title="部件名称" dataIndex="name" cell={this.renderName.bind(this,"name")} width={110}/>
            <Table.Column title="材料规格" dataIndex="size" cell={this.renderName.bind(this,"size")} width={160}/>
            <Table.Column title="数量" dataIndex="count" cell={this.renderName.bind(this,"count")} width={90}/>
            <Table.Column title="材料" dataIndex="materials" cell={this.renderName.bind(this,"materials")}/>
            <Table.Column title="工艺要求" dataIndex="demand" cell={this.renderName.bind(this,"demand")}/>

            <Table.Column title="操作" dataIndex="option" cell={this.renderName.bind(this,"option")} width={80}/>
          </Table>
          <Button onClick={()=>{this.props.history.push('/desgin/lailiao')} } style={styles.ensureBtn2}>返回</Button>
          <Button style={{ marginLeft: "5px"}} onClick={this.installExcel}>下载表格</Button>
          {
            kailiaoState == 0 ? <Button
              style={styles.ensureBtn}
              size="small"
              type="primary"
              onClick={this.enSureKailiao}
              >确认开料</Button>: ""
          }

        </IceContainer>
      </div>);
  }
}
const styles={
  ensureBtn2:{
    marginTop:"10px",
  },
  ensureBtn: {
    marginTop:"10px",
    float:"right",
  },
  tabelCol:{
    paddingLeft: "20px",
    borderRight: "1px solid #EEEFF3",
    lineHeight:"40px",
  },
  tabelRow:{
    padding: "5px 0",
    border: "1px solid #EEEFF3",
    borderBottom:"none",
  },
  tabelH2: {
    textAlign: "center",
  },
}
