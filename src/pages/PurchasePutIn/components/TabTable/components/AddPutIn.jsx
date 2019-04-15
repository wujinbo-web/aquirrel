import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback, Upload } from '@icedesign/base';
import { getUuid, queryMaterialsTypeList, postQueryMaterials, postUrl } from '@/api';
import { queryPurchaseType } from '@/api/apiUrl';
import { API_URL } from '@/config';
import { factoryList } from '@/tool/factoryList';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Toast = Feedback.toast;
const aliOssUrl = 'https://songshu-image.oss-cn-shanghai.aliyuncs.com/';

function beforeUpload(info) {
  console.log('beforeUpload callback : ', info);
}
//当图片发生改变时的回掉
function onChange(info) {
  console.log('onChane callback : ', info);
}

function onError(file) {
  console.log('onError callback : ', file);
}

function formatter(res) {
  return {
    code: res == '上传失败' ? '1' : '0',   //0代表成功
    imgURL: res,
    downloadURL:`${aliOssUrl+res}`,
    fileURL:`${aliOssUrl+res}`,
    imgURL:`${aliOssUrl+res}`
  };
}

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      json:[],
      uuid:"",
      remark: "",
      file: '',
      materialsList: [],
      factory: 1,
      classId: "",
      deptList: [],
    };
  }

  //获取商品数据
  getIndexData= async ()=>{
    let { factory } = this.state;
    const response = await postQueryMaterials({pageSize:999, factoryId:factory });
    this.state.materialsList = response.data.data.map(item=>{
      //deptId 品牌ID
      return({
        label: item[1].name+'/'+ this.transformName2(item[0].deptId) +'/'+item[0].name,
        value: item[0].id,
        name: item[0].name,
      })
    });
    this.setState({});
  }

  //获取品牌数据
  getDeptData=async()=>{
    let response = await postUrl(queryPurchaseType,{pageSize: 999});
    this.state.deptList = response.data.data.map(item=>{
      return({
        label: item.name,
        id: item.id,
      })
    })
    this.setState({});
  }

  handleSubmit = () => {
    const { uuid, json, remark, file, factory } = this.state;
    //做空校验证
    let error=false;
    json.forEach((item)=>{
      for(var key in item){
        if(item[key]==""){
          return error=true;
        }
      }
    })
    if(error){
      Toast.error(`不能为空`);
      return false;
    }
    //做空校验证 end
    this.props.getFormValues(json, remark, file, factory);
    this.setState({
      visible: false,
    });
  };

  onOpen = async () => {
    this.getIndexData();
    this.getDeptData();
    //获取uuid
    const response = await getUuid();
    this.setState({
      visible: true,
      uuid: response.data.uuid,
      json:[{name:"",materialsRecordId:response.data.uuid,materialsMainId:"",count:""}]
    });

  };

  //改变厂家获取厂家商品
  // getMaterialsList = (value) => {
  //   this.state.classId=value;
  //   this.setState({});
  //   this.updateList();
  // }

  //更新品牌分类

  //更新列表
  // updateList = async () => {
  //   const response = await postQueryMaterials({pageSize:500,classId:this.state.classId,factoryId:this.state.factory});
  //   let materialsList = response.data.data.map((item)=>{
  //     return ({label:item[0].name,value:item[0].id});
  //   })
  //   this.setState({ materialsList });
  // }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //id转名字
  transformName = (id) => {
    let name;
    const { materialsList } = this.state;
    materialsList.forEach((item)=>{
      if(item.value==id){
        name = item.name;
      }
    })
    return name;
  }

  //品牌转化
  transformName2 = (id) => {
    let name;
    const { deptList } = this.state;
    deptList.forEach((item)=>{
      if(item.value==id){
        name = item.label;
      }
    })
    return name;
  }

  //提取值
  setPutInCount = (index, key, value) => {
    let { json,uuid } = this.state;
    if(key=="materialsMainId"){
      this.state.json[index]["name"]=this.transformName(value);
    }
    this.state.json[index][key]=value;
    this.setState({name:"",materialsRecordId:uuid,materialsMainId:"",count:""});
  }

  //添加一个产品
  addItem = () => {
    const { uuid } = this.state;
    this.state.json.push({name:"",materialsRecordId:uuid,materialsMainId:"",count:""});
    this.setState({});
  }

  //删除某一个产品
  reduceItem = (index) =>{
    if(this.state.json.length==1){
      Toast.error("至少输入一种材料");
      return;
    }
    this.state.json.splice(index,1);
    this.setState({});
  }

  //添加备注
  changeRemark = (value) => {
    this.state.remark = value;
    this.setState({});
  }

  onSuccess = (res, file) => {
    console.log('onSuccess callback : ', res, file,"成功");
    this.state.file = file.imgURL.split(aliOssUrl)[1];
    this.setState({});
  }

  getFactory = (value) => {
    this.state.factory = value;
    this.setState({});
    if(this.state.classId == "")return false;
    this.updateList();
  }

  render() {
    const { json, customData, materialsList } = this.state;
    const data = new Date();
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen()}
        >
          添加进货单
        </Button>
        <Dialog
          style={{ width: 800 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加进货单"
        >
        <Row>
          <Col span="3" style={{ lineHeight:"32px", textAlign:"center" }}>工厂:</Col>
          <Col span="18">
            <Select
              size="large"
              placeholder="请选择工厂"
              style={{width:"200px"}}
              defaultValue={[ { label:"南京厂", value: 1 } ]}
              dataSource={factoryList}
              onChange={this.getFactory}
            />
          </Col>
        </Row>
        <Button
          size="small"
          type="primary"
          style={{ marginBottom: "5px" }}
          onClick={this.addItem}
        >添加货物</Button>
          {
            json.map((item,index)=>{
              return (
                <Row key={index}>
                  <Col span="12">
                    <Select
                      showSearch
                      size="large"
                      style={{width: "100%"}}
                      placeholder="请选择材料..."
                      onChange={this.setPutInCount.bind(this,index,"materialsMainId")}
                      dataSource={materialsList}
                    />
                  </Col>
                  <Col>
                    <Input
                      placeholder="请输入进货数"
                      style={{ height:"30px",lineHeight:"30px" }}
                      value={item.count}
                      htmlType="number"
                      onChange={this.setPutInCount.bind(this,index,"count")}
                    />
                  </Col>
                  <Col>
                    <Button size="small" shape="warning" style={{ marginLeft: "5px" }} onClick={this.reduceItem.bind(this,index)}>—</Button>
                  </Col>
                </Row>
              );
            })
          }
          <Row style={{ lineHeight: "28px", marginBottom: '5px' }}>
              进货备注: <Input type="text" onChange={this.changeRemark}/>
          </Row>
          <Row style={{ lineHeight: "28px" }}>
            文件附件：
            <Upload
              listType="text-image"
              action={`${API_URL}/uploadFile.do`}
              name="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp, .doc, .ppt, .dwt, .dwg, .dws, .dxf"
              data={(file)=>{
                return ({
                  dir: `remark/${data.getFullYear()}_${data.getMonth()+1}_${data.getDate()}`,
                  type:2,
                  fileFileName: file.name
                });
              }}
              beforeUpload={beforeUpload}
              onChange={onChange}
              onSuccess={this.onSuccess}
              formatter = {formatter}
              defaultFileList={[]}
            >
              <Button type="primary" style={{ margin: "0 0 10px" }}>
                上传文件
              </Button>
            </Upload>
          </Row>

        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: 'block',
    marginRight: '5px',
    textAlign:"right",
  },
};
