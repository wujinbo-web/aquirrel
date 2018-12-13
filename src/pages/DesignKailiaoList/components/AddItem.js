import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Grid, Feedback  } from '@icedesign/base';

const Toast = Feedback.toast;
const FormItem = Form.Item;
const { Row, Col } = Grid;

export default class AddItem extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      partsData:[""],  //["部件1","部件2"]
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
      this.props.getFormValues(partsData);
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
    const { partsData } = this.state;
    const { goodsType } = this.props;
    return (
      <div style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen()}
        >
          新增部件
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="新增"
        >
          <Form direction="ver" field={this.field}>
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
                    {index>0?<Button size="small" shape="warning" onClick={()=>{this.reduceParts(index)}}>—</Button>:""}
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
