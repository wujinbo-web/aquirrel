import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback  } from '@icedesign/base';

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
      partsData:[""],  //["部件1","部件2"]
      factoryList: [
        {label:"南京厂",value:1},
        {label:"滁州厂",value:2},
        {label:"山东厂",value:3},
      ],
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      let err=false;
      let partsData = this.state.partsData;
      partsData.forEach((item)=>{
        if(item==""){err=true;return;}
      });
      if(err){
        Toast.error("部件名不能为空");
        return;
      }
      this.props.getFormValues(values,partsData);
      this.setState({
        partsData: [""],
        visible: false,
      });
    });
  };

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

  addParts = () => {
    this.state.partsData.push("");
    this.setState({});
  }

  reduceParts = (index) => {
    this.state.partsData.splice(index, 1);
    this.setState({});
  }

  changeValue = (index,value) => {
    this.state.partsData[index]=value;
    this.setState({});
  }

  render() {
    const init = this.field.init;
    const { partsData, factoryList } = this.state;
    const { goodsType } = this.props;
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
                style={{width:"200px"}}
                size="large"
                placeholder="请选择..."
                dataSource={goodsType}
                {...init('classId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="规格：" {...formItemLayout}>
              <Input
                {...init('size', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
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
            <hr/>
            <Row style={{ marginBottom:"5px" }} align="center">
              <Col span="4" type="primary" style={{ textAlign: "right" }} >部件：</Col>
              <Col><Button size="small" onClick={this.addParts}>+</Button></Col>
            </Row>
            <Row style={styles.addRow}>
              <Col style={styles.addCol}>
                {
                  partsData.map((item,index)=>{
                    return (<span style={styles.addSpan} key={index}>
                      <Input
                        style={styles.addInput}
                        value={item}
                        onChange={this.changeValue.bind(this, index)}
                      />
                      <Button size="small" shape="warning" onClick={()=>{this.reduceParts(index)}}>—</Button>
                    </span>);
                  })
                }
              </Col>
            </Row>

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
    span: 14,
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
