import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select, Table, Feedback } from '@icedesign/base';
import { postUrl } from '@/api';
import { queryGoodsSeries, queryGoods } from '@/api/apiUrl';

const Toast = Feedback.toast;
const FormItem = Form.Item;

export default class AddSeries extends Component {
  static displayName = 'AddSeries';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      seriesList: [],
      selectGoods: [],
    };
    this.field = new Field(this);
  }

  getSeriesList = async () => {
    let response = await postUrl(queryGoodsSeries,{pageIndex: 1,pageSize: 999});
    this.state.seriesList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //提交
  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      if(this.state.selectGoods.length==0){
        Toast.error('选择的商品不能为空');
        return;
      }

      this.props.getFormValues(this.state.selectGoods);
      this.setState({
        visible: false,
      });
    });
  };

  //打开弹窗
  onOpen = () => {
    // this.field.setValues({ });
    this.getSeriesList();
    this.setState({
      visible: true,
    });
  };

  //选择系列
  changeValue = async (value) => {
      //value 系列ID
      let response = await postUrl(queryGoods,{pageIndex: 1,pageSzie: 9999,deptId:value,name:'',classId:''});
      this.state.selectGoods.length = 0;
      this.state.selectGoods = response.data.data.map(item=>{
        return ({
          name: item[0].name,
          id: item[0].id,
        })
      });
      this.setState({});
  }
  //渲染按钮
  renderName = (value, index, record) => {
    return(<Button shape="warning" size="small" onClick={this.deleteItem.bind(this, index)} >删除</Button>)
  }

  //删除行
  deleteItem = (index) => {
    this.state.selectGoods.splice(index,1);
    this.setState({});
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { seriesList, selectGoods } = this.state;
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div style={styles.AddSeries}>
        <Button
          size="small"
          type="primary"
          style={{marginTop: "10px",marginRight: "5px"}}
          onClick={() => this.onOpen()}
        >
          新增系列
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>

            <FormItem label="系列：" {...formItemLayout}>
              <Select
                onChange={this.changeValue}
                dataSource={seriesList}
                placeholder="请选择系列"
                style={{width: "100%", verticalAlign: "middle" }}
              />
            </FormItem>

          </Form>

          <Table
            dataSource={selectGoods}
          >
            <Table.Column
              title="ID"
              dataIndex="id"
            />
            <Table.Column
              title="已选商品"
              dataIndex="name"
            />
            <Table.Column
              title="操作"
              cell={this.renderName}
            />
          </Table>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  AddSeries: {
    display: 'inline-block',
    marginRight: '5px',
  },
};
