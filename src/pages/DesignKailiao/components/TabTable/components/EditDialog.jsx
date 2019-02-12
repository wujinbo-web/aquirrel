import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback  } from '@icedesign/base';
import { otherSizeQuery, otherSizeUpdate } from '@/api/apiUrl';
import { postUrl } from '@/api';

const Toast = Feedback.toast;
const FormItem = Form.Item;
const { Row, Col } = Grid;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      factoryList: [
        {label:"南京厂",value:1},
        {label:"滁州厂",value:2},
        {label:"山东厂",value:3},
      ],
      otherSize: [], //参数配置
      templateId: "",
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      /*处理部件数据*/
      // let err=false;
      // let partsData = this.state.partsData;
      // partsData.forEach((item)=>{
      //   if(item==""){err=true;return;}
      // });
      // if(err){
      //   Toast.error("部件名不能为空");
      //   return;
      // }
      this.props.getFormValues(values, this.state.templateId);
      this.setState({
        visible: false,
      });
    });
  };

  //获取模板的其他规格列表
  getOtherSize = async (value) => {
    let { templateId } = this.state;
    templateId = value;
    let response = await postUrl(otherSizeQuery,{templateId: value});
    let otherSize = response.data.data;
    this.setState({ otherSize, templateId });
  }
  //输入修改值
  changeOtherSize = (index, value) => {
    let { otherSize } = this.state;
    otherSize[index].size = value;
    this.setState({});
  }
  //失焦保存数据
  upDateOtherSize = async(value) => {
    let response = await postUrl(otherSizeUpdate, {
      "spec.name":value.name,
      "spec.size":value.size,
      "spec.templateId":value.templateId,
      "spec.id":value.id,
      "spec.vbname":value.vbname,
    });
    if(response.data.state!="success"){
      Toast.error(response.data.msg);
    }
  }

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { factoryList, otherSize } = this.state;
    const { goodsType, templateList } = this.props;
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen()}
        >
          新添开料单
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="工厂：" {...formItemLayout}>
              <Select
                style={{width:"200px"}}
                size="large"
                placeholder="请选择..."
                dataSource={factoryList}
                {...init('factoryId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="产品：" {...formItemLayout}>
              <Select
                style={{width:"100%"}}
                size="large"
                placeholder="请选择..."
                dataSource={goodsType}
                {...init('classId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="选择开料模板：" {...formItemLayout} >
              <Select
                style={{width:"100%"}}
                size="large"
                placeholder="请选择..."
                dataSource={templateList}
                onChange={this.getOtherSize}
              />
            </FormItem>
            <FormItem label="规格：" {...formItemLayout}>
              <Input
                style={{ width:"120px", marginRight:"5px" }}
                placeholder="规格a"
                {...init('length', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
              <Input
                style={{ width:"120px", marginRight:"5px" }}
                placeholder="规格b"
                {...init('width', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
              <Input
                style={{ width:"120px" }}
                placeholder="规格c"
                {...init('height', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

            <FormItem label="其他规格：" {...formItemLayout}>
              {
                otherSize.map((item,index)=>{
                  return(
                    <Input
                      key={index}
                      style={{ width:"120px", marginRight:"5px" }}
                      placeholder={item.name}
                      onChange={this.changeOtherSize.bind(this,index)}
                      onBlur={this.upDateOtherSize.bind(this,item)}
                    />
                  )
                })
              }

            </FormItem>

            <FormItem label="开料数：" {...formItemLayout}>
              <Input
                {...init('number', {
                  rules: [{ required: true, message: '必填选项' },{ pattern:/^[0-9]*$/, message: '请输入数字'}],
                })}
              />
            </FormItem>
            <FormItem label="备注：" {...formItemLayout}>
              <Input
                {...init('remark')}
              />
            </FormItem>


          </Form>
        </Dialog>
      </div>
    );
  }
}

const formItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
  addRow:{
    marginBottom:"5px",
  },
  addCol:{
    marginLeft:"90px",
  },
  addSpan:{
    display:"inline-block",
    marginRight:"10px",
    marginBottom:"5px",
  },
  addInput:{
    width:"100px",
    marginRight:"5px",
  }
};

/*添加部件名*/
// <hr/>
// <Row style={{ marginBottom:"5px" }} align="center">
//   <Col span="4" type="primary" style={{ textAlign: "right" }} >部件：</Col>
//   <Col><Button size="small" onClick={this.addParts}>+</Button></Col>
// </Row>
// <Row style={styles.addRow}>
//   <Col style={styles.addCol}>
//     {
//       partsData.map((item,index)=>{
//         return (<span style={styles.addSpan} key={index}>
//           <Input
//             style={styles.addInput}
//             value={item}
//             onChange={this.changeValue.bind(this, index)}
//           />
//           <Button size="small" shape="warning" onClick={()=>{this.reduceParts(index)}}>—</Button>
//         </span>);
//       })
//     }
//   </Col>
// </Row>

/*添加部件功能实现*/
// addParts = () => {
//   this.state.partsData.push("");
//   this.setState({});
// }
// changeValue = (index,value) => {
//   this.state.partsData[index]=value;
//   this.setState({});
// }
// reduceParts = (index) => {
//   this.state.partsData.splice(index, 1);
//   this.setState({});
// }
