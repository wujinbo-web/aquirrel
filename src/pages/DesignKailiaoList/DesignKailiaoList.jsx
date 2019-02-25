import React, { Component } from 'react';
import { Button, Table, Feedback, Input, Upload  } from '@icedesign/base';
import IceContainer  from '@icedesign/container';
import { Grid } from '@icedesign/base';
import { postQueryKailiao, postUpdateKailiao, postDeleteKailiao, postAddAparts, postUpdateState, postUpdateKaiList, postUrl } from '@/api';
import { departUpdate } from '@/api/apiUrl';
import AddItem from './components/AddItem';
import { API_URL } from '@/config';

const aliOssUrl = "https://songshu-image.oss-cn-shanghai.aliyuncs.com/";
const { Row, Col } = Grid;
const { ImageUpload } = Upload;
const Toast = Feedback.toast;

function beforeUpload(info) {
  console.log('beforeUpload callback : ', info);
}
//当图片发生改变时的回掉
async function onChange(info) {
  let data = info.fileList.map(item=>item.imgURL?item.imgURL.split(aliOssUrl)[1]:"").join(',');
  let response = await postUpdateKaiList({
    orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, img: data
  },'Img');
  if(response.data.state=="success"){
    sessionStorage.desgin2_kailiaoImg = data;
  }

}

function onSuccess(res, file) {
  console.log('onSuccess callback : ', res, file,"成功");
}

function onError(file) {
  console.log('onError callback : ', file);
}

function formatter(res) {
  return {
    code: res == '上传失败' ? '1' : '0',   //0代表成功
    imgURL: res,
    downloadURL:aliOssUrl+res,
    fileURL:aliOssUrl+res,
    imgURL:aliOssUrl+res
  };
}

export default class DesignKailiaoList extends Component {
  static displayName = 'DesignKailiaoList';

  constructor(props) {
    super(props);
    this.state = {
      orderId:sessionStorage.design2_orderId,
      kailiaoId: sessionStorage.desgin2_kailiaoId,
      kailiaoName: sessionStorage.desgin2_kailiaoName,
      kailiaoLength: sessionStorage.desgin2_kailiaoLength,
      kailiaoWidth: sessionStorage.desgin2_kailiaoWidth,
      kailiaoHeight: sessionStorage.desgin2_kailiaoHeight,
      kailiaoCount: sessionStorage.desgin2_kailiaoCount,
      kailiaoRemark: sessionStorage.desgin2_kailiaoRemark,
      kailiaoState: sessionStorage.desgin2_kailiaoState,
      kailiaoRoomNum: sessionStorage.desgin2_kailiaoRoomNum,
      kailiaoImg: sessionStorage.desgin2_kailiaoImg,
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
        length: item.length,
        width:item.width,
        height:item.height,
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

  //失焦修改部件请求数据
  changeTabelDataApi = async (index, record, valueKey) =>{
    /*飘红未加，到时候要换接口的*/
    let { dataSource, kailiaoId } = this.state;
    let params = {
      "orderMaterials.recordId": kailiaoId,
      "orderMaterials.id": dataSource[index].id,
      "orderMaterials.name":dataSource[index].name?dataSource[index].name:"",
      "orderMaterials.length":dataSource[index].length?dataSource[index].length:"",
      "orderMaterials.width":dataSource[index].width?dataSource[index].width:"",
      "orderMaterials.height":dataSource[index].height?dataSource[index].height:"",
      "orderMaterials.count":dataSource[index].count?dataSource[index].count:"",
      "orderMaterials.materials":dataSource[index].materials?dataSource[index].materials:"",
      "orderMaterials.demand":dataSource[index].demand?dataSource[index].demand:"",
    };
    const data = await postUrl(departUpdate,params);
    console.log(data);
  }

  //监控记录单数据变化
  changeData = (type, value) => {
    if(type=="length"){
      this.setState({kailiaoLength: value});
    }else if(type=="width"){
      this.setState({kailiaoWidth: value});
    }else if(type=="height"){
      this.setState({kailiaoHeight: value});
    }else if (type=="count"){
      this.setState({kailiaoCount: value});
    }else if (type=="remark"){
      this.setState({kailiaoRemark: value});
    }else if(type="roomNum"){
      this.setState({kailiaoRoomNum: value});
    }
  }

  //失焦修改
  changeDataApi = async (type) => {
    const { kailiaoName, kailiaoHeight,kailiaoWidth,kailiaoLength, kailiaoCount, kailiaoRemark,kailiaoRoomNum } =this.state;
    let params,key;
    if (type=="length"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, length: kailiaoLength };
      key="Length";
    }else if (type=="width"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, width: kailiaoWidth };
      key="Width";
    }else if (type=="height"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, height: kailiaoHeight };
      key="Height";
    }else if (type=="count"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, count: kailiaoCount };
      key="Count";
    }else if (type=="remark"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, remark: kailiaoRemark };
      key="Remark";
    }else if (type=="roomNum"){
      params={orderMaterialsRecordId: sessionStorage.desgin2_kailiaoId, roomNum: kailiaoRoomNum };
      key="RoomNum";
    }
    const data = await postUpdateKaiList(params,key);
    if(data.data.state=="success"){
      if(type=="length"){
        sessionStorage.desgin2_kailiaoLength=kailiaoLength;
      }else if (type=="width"){
        sessionStorage.desgin2_kailiaoWidth=kailiaoWidth;
      }else if (type=="height"){
        sessionStorage.desgin2_kailiaoHeight=kailiaoHeight;
      }else if (type=="count"){
        sessionStorage.desgin2_kailiaoCount=kailiaoCount;
      }else if (type=="remark"){
        sessionStorage.desgin2_kailiaoRemark=kailiaoRemark;
      }else if (type=="roomNum"){
        sessionStorage.desgin2_kailiaoRoomNum=kailiaoRemark;
      }
    }

  }

  //下载excel表格
  installExcel = async () => {
    const { orderId, kailiaoId} = this.state;
     window.location.href=`${API_URL}/materialsExcel.do?recordIds=${kailiaoId}`;
  }

  render() {
    const now = new Date();
    const {
      dataSource,orderId, kailiaoId, kailiaoName,
      kailiaoLength, kailiaoWidth, kailiaoHeight,
      kailiaoCount, kailiaoRemark, kailiaoState,
      kailiaoRoomNum,kailiaoImg
    } = this.state;
    return (
      <div className="design-kailiao-list-page" >
        <IceContainer>
          <h2 style={styles.tabelH2}>产品开料单{kailiaoState==0?"(编辑中)":"(已同步生产部)"}</h2>
          <Row style={styles.tabelRow}>
            <Col span="3" style={styles.tabelCol}>订单id:{orderId}</Col>
            <Col span="7" style={styles.tabelCol}>产品名称:{kailiaoName}</Col>
            <Col span="7" style={styles.tabelCol}>
              规格:<Input
                style={{width:"60px",height:"20 px"}}
                value={kailiaoLength}
                onChange={this.changeData.bind(this,"length")}
                onBlur={this.changeDataApi.bind(this, "length")}
              />
              *
              <Input
                style={{width:"60px"}}
                value={kailiaoWidth}
                onChange={this.changeData.bind(this,"width")}
                onBlur={this.changeDataApi.bind(this, "width")}
              />
              *
              <Input
                style={{width:"60px"}}
                value={kailiaoHeight}
                onChange={this.changeData.bind(this,"height")}
                onBlur={this.changeDataApi.bind(this, "height")}
              />
            </Col>
            <Col span="4" style={styles.tabelCol}>
              数量:<Input
                style={{width:"70px"}}
                value={kailiaoCount}
                onChange={this.changeData.bind(this,"count")}
                onBlur={this.changeDataApi.bind(this, "count")}
              />
            </Col>

            <Col style={styles.tabelCol}><AddItem getFormValues={this.getFormValues} /></Col>
          </Row>
          <Row style={styles.tabelRow}>
            <Col span="3" style={styles.tabelCol2}>
              备注:
            </Col>
            <Col style={styles.tabelCol2}>
              <Input
                style={{width:"100%"}}
                value={kailiaoRemark}
                onChange={this.changeData.bind(this,"remark")}
                onBlur={this.changeDataApi.bind(this, "remark")}
              />
            </Col>
          </Row>
          <Row style={styles.tabelRow}>
            <Col span="3" style={styles.tabelCol2}>
              房间号:
            </Col>
            <Col style={styles.tabelCol2}>
              <Input
                style={{width:"100%"}}
                value={kailiaoRoomNum}
                onChange={this.changeData.bind(this,"roomNum")}
                onBlur={this.changeDataApi.bind(this, "roomNum")}
              />
            </Col>
          </Row>
          <Table dataSource={dataSource}>
            <Table.Column title="序号" dataIndex="index" width={60} />

            <Table.Column title="部件名称" dataIndex="name" cell={this.renderName.bind(this,"name")} width={110}/>
            <Table.Column title="规格a" dataIndex="length" cell={this.renderName.bind(this,"length")} width={90}/>
            <Table.Column title="规格b" dataIndex="width" cell={this.renderName.bind(this,"width")} width={90}/>
            <Table.Column title="规格c" dataIndex="height" cell={this.renderName.bind(this,"height")} width={90}/>
            <Table.Column title="数量" dataIndex="count" cell={this.renderName.bind(this,"count")} width={90}/>
            <Table.Column title="材料" dataIndex="materials" cell={this.renderName.bind(this,"materials")}/>
            <Table.Column title="工艺要求" dataIndex="demand" cell={this.renderName.bind(this,"demand")}/>

            <Table.Column title="操作" dataIndex="option" cell={this.renderName.bind(this,"option")} width={80}/>
          </Table>
          <div style={{ position: "relative", padding:"20px" }}>
            <Row>
              <Col span="2" style={{ lineHeight: "28px" }} >
                图纸:
              </Col>
              <Col span="7">
                <Upload
                  listType="text-image"
                  action={`${API_URL}/uploadFile.do`}
                  name="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp, .doc, .ppt, .dwt, .dwg, .dws, .dxf"
                  data={(file)=>{
                    return ({
                      dir: `kailiao/${now.getFullYear()}_${now.getMonth()+1}_${now.getDate()}`,
                      type:1,
                      fileFileName: file.name
                    });
                  }}
                  beforeUpload={beforeUpload}
                  onChange={onChange}
                  onSuccess={onSuccess}
                  multiple
                  formatter = {formatter}
                  defaultFileList={kailiaoImg.split(',').filter(item=>item==""?false:true).map(res=>{
                    if(res==" ")return false;
                    return{
                      code: 0,
                      imgURL: res,
                      downloadURL:aliOssUrl+res,
                      fileURL:aliOssUrl+res,
                      imgURL:aliOssUrl+res
                    };
                  })}
                >
                  <Button type="primary" style={{ margin: "0 0 10px" }}>
                    上传图纸
                  </Button>
                </Upload>
              </Col>
            </Row>
          </div>

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
    height:"32px",
    paddingLeft: "20px",
    borderRight: "1px solid #EEEFF3",
    lineHeight:"30px",
  },
  tabelCol2:{
    textAlign:"right",
    height:"32px",
    paddingLeft: "20px",
    lineHeight:"30px",
    paddingRight: "20px",
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
