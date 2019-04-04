import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field, Select } from '@icedesign/base';
import { postUrl } from '@/api';
import { queryGoods } from '@/api/apiUrl';

const FormItem = Form.Item;

export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataSource: [],
    };
    this.field = new Field(this);
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }


      //values.goodsId  商品id
      let name = this.state.dataSource.filter(item=>item.value==values.goodsId)[0].name;
      this.props.getFormValues(values.goodsId, name);
      this.setState({
        visible: false,
      });
    });
  };

  //获取商品数据
  getGoodsList = async () => {
    let response = await postUrl(queryGoods,{pageSzie: 9999});
    this.state.dataSource = response.data.data.map(item=>{
      return({
        label: item[0].name+'/'+item[1].name+'/'+item[2].name,
        value: item[0].id,
        name: item[0].name,
      })
    })
    this.setState({});
  }

  onOpen = () => {
    this.getGoodsList();
    this.field.setValues({
      goodsId: null
    });
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
    let { dataSource  } = this.state;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <span style={styles.editDialog}>
        <Button
          size="small"
          type="primary"
          onClick={() => this.onOpen()}
        >
          添加商品
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
            <FormItem label="商品：" {...formItemLayout}>
              <Select
                {...init('goodsId', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
                placeholder="请选择商品"
                style={{width:"100%"}}
                showSearch
                dataSource={dataSource}
              />
            </FormItem>
          </Form>
        </Dialog>
      </span>
    );
  }
}

const styles = {
  editDialog:{
    float: "right",
    marginRight: '5px'
  }
};
