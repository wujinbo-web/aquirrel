import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { queryGoodsType, queryGoodsSeries, queryGoods } from '@/api/apiUrl';
import { postUrl } from '@/api';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      dataSource: [],  //数据
      typeList: [],
      seriesList: [],
      name: '',
      shaixuan: {
        name: '',
        typeId: '',
        seriesId: '',
      }
    };
    this.field = new Field(this);
  }

  //获取类别列表
  getTypeData = async () => {
    let response = await postUrl(queryGoodsType,{pageIndex: 1, pageSize: 9999});
    this.state.typeList = response.data.data.map(item=>{
      return({
        label: item.name,
        value: item.id,
      })
    });
    this.setState({});
  }

  //获取系列列表
  getSeriesData = async () => {
    let response = await postUrl(queryGoodsSeries,{pageIndex: 1, pageSize: 9999});
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

      const { dataIndex } = this.state;
      this.props.getFormValues(dataIndex, values);
      this.setState({
        visible: false,
      });
    });
  };

  //打开弹窗
  onOpen = (index, record) => {
    this.getTypeData();
    this.getSeriesData();
    this.field.setValues({ name: '', id: '' });
    this.setState({
      visible: true,
      dataIndex: index,
    });
  };

  //关闭弹窗
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //点击选择商品
  clickSelect = (id, name) => {
    this.field.setValues({ name, id });
  }

  //改变筛选值
  changeValue = (type, value) => {
    this.state.shaixuan[type]=value;
    this.setState({});
  }

  //搜索数据
  searchGoods = async () => {
    let { shaixuan } = this.state;
    let response = await postUrl(queryGoods, {
      name: shaixuan.name,
      pageIndex: 1,
      pageSize: 9999,
      classId: shaixuan.typeId,
      deptId: shaixuan.seriesId,
    });
    if(response.data.state=="success"){
      let dataSource = response.data.data.map(item=>{
        return({
          id: item[0].id,
          name: item[0].name,
        })
      });
      this.setState({
        dataSource
      })
    }
  }

  render() {
    const init = this.field.init;
    const { typeList, seriesList, dataSource } = this.state;
    const { index } = this.props;
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
          shape="text"
          style={{marginLeft: "10px"}}
          onClick={() => this.onOpen(index)}
        >
          选择商品
        </Button>
        <Dialog
          style={{ width: 780 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="编辑"
        >
          <Form direction="ver" field={this.field}>

            <div style={styles.warpping}>
              筛选:
              <Input
                placeholder="请输入商品名"
                style={styles.input}
                onChange={this.changeValue.bind(this,"name")}
              />

              <Select
                dataSource={typeList}
                placeholder="请选择类别"
                style={styles.warp_select}
                onChange={this.changeValue.bind(this,"typeId")}
              />

              <Select
                dataSource={seriesList}
                placeholder="请选择系列"
                style={styles.warp_select}
                onChange={this.changeValue.bind(this,"seriesId")}
              />

              <Button type="primary" size="small" onClick={this.searchGoods}>搜索匹配商品</Button>

            </div>

            <ul style={styles.List}>
              {
                dataSource.map(item=><li key={item.id} style={styles.item} onClick={this.clickSelect.bind(this,item.id,item.name)}>{item.name}</li>)
              }

            </ul>

            <FormItem label="产品名称：" {...formItemLayout}>
              <Input
                disabled={true}
                {...init('name', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
            <FormItem label="产品ID：" {...formItemLayout}>
              <Input
                disabled={true}
                {...init('id', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>

          </Form>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  List:{
    width: "100%",
    height: "500px",
    background: "#eee",
    marginBottom: "10px",
    overflow: 'scroll',
  },
  item:{
    height:"35px",
    lineHeight: "35px",
    padding: "0 10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
  input:{
    marginLeft: "10px",
    marginRight: "10px",
  },
  warpping:{
    marginBottom: "10px",
  },
  warp_select:{
    width: '170px',
    verticalAlign: 'middle',
    marginRight: "10px",
  }
};
