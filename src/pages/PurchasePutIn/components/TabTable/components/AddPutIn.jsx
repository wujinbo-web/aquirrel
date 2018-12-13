import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback } from '@icedesign/base';
import { getUuid } from './../../../../../api';

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
      remark: "",
    };
  }

  handleSubmit = () => {
    const { uuid, json } = this.state;
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
    this.props.getFormValues(json,this.state.remark);
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
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //id转名字
  transformName = (id) => {
    let name;
    const { materialsList } = this.props;
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

  //添加备注
  changeRemark = (value) => {
    this.state.remark = value;
    this.setState({});
  }

  render() {
    const { materialsList } = this.props;
    const { json } = this.state;
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
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="添加进货单"
        >
        <Button
          size="small"
          type="primary"
          style={{ marginBottom: "5px" }}
          onClick={this.addItem}
        >添加</Button>
        {
          json.map((item,index)=>{
            return (
              <Row key={index}>
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
                    placeholder="请输入进货数"
                    style={{ height:"30px",lineHeight:"30px" }}
                    value={item.count}
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
          <Row style={{ lineHeight: "28px" }}>
              进货备注:<Input onChange={this.changeRemark} />
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
