import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback } from '@icedesign/base';
import { getUuid, queryMaterialsTypeList, postQueryMaterials } from '@/api';
import { factoryList } from '@/tool/factoryList';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      json:[],
      uuid:"",
      customData: [],
      materialsList: [],
      classId: '',
      factory: 1,
    };
  }

  handleSubmit = () => {
    const { uuid, json, factory } = this.state;
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
    this.props.getFormValues(json, factory);
    this.setState({
      visible: false,
    });
  };

  onOpen = async () => {
    //获取uuid
    const response = await getUuid();
    this.setState({
      visible: true,
      uuid: response.data.uuid,
      json:[{name:"",materialsRecordId:response.data.uuid,materialsMainId:"",count:""}]
    });
    //获取分类列表
    const response2 = await queryMaterialsTypeList({ pageSize: 500 });
    let customData=response2.data.data.map((item)=>{
      return({ label: item.name, value: item.id });
    })
    customData.splice(0,0,{label:"全部分类", value: ""});
    this.setState({
      customData,
    });
  };

  //改变类别获取材料列表
  getMaterialsList = (value) => {
    this.state.classId=value;
    this.setState({});
    this.updateList();
  }
  //更新列表
  updateList = async () => {
    const response = await postQueryMaterials({pageSize:500,classId:this.state.classId,factoryId:this.state.factory});
    let materialsList = response.data.data.map((item)=>{
      return ({label:item[0].name,value:item[0].id});
    })
    this.setState({ materialsList });
  }

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

  getFactory = (value) => {
    this.state.factory = value;
    this.setState({});
    if(this.state.classId == "")return false;
    this.updateList();
  }


  render() {
    const { json, customData, materialsList } = this.state;
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
          添加出货单
        </Button>
        <Dialog
          style={{ width: 800 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加出货单"
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
                <Col>
                  <Select
                    size="large"
                    placeholder="请选择类别..."
                    style={{width:"200px"}}
                    onChange={this.getMaterialsList.bind(this)}
                    dataSource={customData}
                  />
                </Col>
                <Col>
                  <Select
                    size="large"
                    placeholder="请选择..."
                    style={{width:"200px"}}
                    onChange={this.setPutInCount.bind(this,index,"materialsMainId")}
                    dataSource={materialsList}
                  />
                </Col>
                <Col>
                  <Input
                    placeholder="请输入出货数"
                    style={{ height:"30px",lineHeight:"30px" }}
                    value={item.count}
                    htmlType="number"
                    onChange={this.setPutInCount.bind(this,index,"count")}
                  />
                </Col>
                <Col>

                  <Button size="small" shape="warning" onClick={this.reduceItem.bind(this,index)}>—</Button>
                </Col>
              </Row>
            );
          })
        }


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

// <Button size="small" type='primary' style={{"marginRight": '5px'}} onClick={this.addItem.bind(this,index)}>+</Button>
