/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Button, Select, Radio, Feedback, DatePicker  } from '@icedesign/base';
import IceTitle from '@icedesign/title';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { postUrl } from '@/api';
import { templateAdd } from '@/api/apiUrl';

const { Row, Col } = Grid;
const Toast = Feedback.toast;
const { Group: RadioGroup } = Radio;


export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: ""
      },
      partsJson:[        //部件数据
        {
        	"name": "",
        	"num": "",
        	"width": "",
        	"length": "",
        	"height": "",
        	"materials": "",
        	"craft": ""
        }
      ],
      specJson:[   //配置数据

      ],
    };
  }

  //钩子函数
  componentDidMount = () =>{
  }

  //添加配置参数
  addConfig = () => {
    let { specJson } = this.state;
    specJson.push({"name":"","vbname": this.changeCode(specJson.length) });
    this.setState({});
  }
  //删除配置参数
  deleteConfig = (pro_num) => {
    let { specJson } = this.state;
    //删除指定位置
    specJson.splice(pro_num,1);
    //判断如果删除，删除位置后面的下标字母改变
    specJson.forEach((item,index)=>{
      if(index>=pro_num){
        item.vbname = this.changeCode(index);
      }
    });
    this.setState({});
  }
  //输入配置参数
  changeConfig = (index, value) => {
    let { specJson } = this.state;
    specJson[index].name = value;
    this.setState({});
  }

  //添加部件
  addDepart = () => {
    let { partsJson } = this.state;
    partsJson.push({
      "name": "",
      "num": "",
      "width": "",
      "length": "",
      "height": "",
      "materals": "",
      "craft": ""
    });
    this.setState({});
  }
  //删除部件
  deleteDepart = (pro_num) => {
    let { partsJson } = this.state;
    //删除指定位置
    partsJson.splice(pro_num,1);
    this.setState({});
  }
  //输入部件信息
  changeDepart = (index, name, value) => {
    console.log(index,name,value);
    let { partsJson } = this.state;
    partsJson[index][name] = value;
    this.setState({});
  }

  //表达粘合
  formChange = (value) => {
    this.setState({
      value,
    });
  };

  //提交表单
  validateAllFormField = () => {
    this.refs.form.validateAll( async (errors, values) => {
      if(errors==null){
        let { value, partsJson, specJson } = this.state;
        partsJson = partsJson.map(item=>{
          return encodeURI(JSON.stringify(item)).replace(/\+/g,'%2B');
        }).join(',');
        specJson = specJson.map(item=>{
          return JSON.stringify(item);
        }).join(',');
        let response = await postUrl(templateAdd,{
          "template.name": value.name,
          partsJson: `[${partsJson}]`,
          specJson: `[${specJson}]`
        });
        if(response.data.state=="success"){
          value={name:""};
          partsJson=[];
          specJson=[];
          this.setState({});
          Toast.success(response.data.msg);
          this.props.redirct();
        }else{
          Toast.error(response.data.msg);
        }
      }
    })
  }

  //公共函数，0-A，1-B
  changeCode = (num) => {
    return String.fromCharCode(65 + parseInt(num));
  }

  render() {
    let { partsJson, specJson } = this.state;
    return (
      <div className="user-form">
        <IceContainer>

          <IceTitle text="添加开料模板" />

          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  模板名称：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required message="必填">
                    <Input
                      size="large"
                      placeholder="请输入模板名称"
                      style={{ width: '100%' }}
                    />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem} >
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  规格配置：
                </Col>
                <Col s="12" l="10">
                  <Row style={styles.formItem2}>
                    <Button type="primary" onClick={this.addConfig}>添加</Button>
                  </Row>

                  {
                    specJson.map((item,index)=>{
                        return(
                          <Row style={styles.formItem2} key={index}>
                            <Col l="1" style={styles.formLabel2}>{item.vbname}</Col>
                            <Col style={styles.formInput}>
                              <Input
                                placeholder="请输入参数名"
                                value={item.name}
                                onChange={this.changeConfig.bind(this,index)}
                              />
                            </Col>
                            <Col><Button shape="warning" onClick={()=>this.deleteConfig(index)}>删除</Button></Col>
                          </Row>
                        )
                    })
                  }

                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  部件配置：
                </Col>
                <Col s="12" l="10">
                  <Row style={styles.formItem2}>
                    <Button type="primary" onClick={this.addDepart}>添加部件</Button>
                  </Row>
                </Col>
              </Row>

              {
                partsJson.map((item,index)=>{
                  return(
                    <div key={index}>
                      <hr />
                      <Row style={styles.formItem2}>
                        <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                          部件{index+1}名称：
                        </Col>
                        <Col s="12" l="20">
                          <Row>
                            <Col l="8">
                              <Input
                                placeholder="请输入名称"
                                style={styles.formInput}
                                value={item.name}
                                onChange={this.changeDepart.bind(this,index,"name")}
                              />
                            </Col>
                            <Col l="2" style={styles.formLabel}>数量：</Col>
                            <Col l="8">
                              <Input
                                placeholder="请输入数量"
                                value={item.num}
                                onChange={this.changeDepart.bind(this,index,"num")}
                              />
                            </Col>
                            <Col ><Button shape="warning" onClick={this.deleteDepart.bind(this,index)}>删除部件</Button></Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={styles.formItem2}>
                        <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                          配置规格：
                        </Col>
                        <Col s="12" l="18">
                          <Row>
                            <Col>
                              <Input
                                placeholder="请输入配置1"
                                value={item.length}
                                onChange={this.changeDepart.bind(this,index,"length")}
                              />
                            </Col>
                            <Col>
                              <Input
                                placeholder="请输入配置2"
                                value={item.width}
                                onChange={this.changeDepart.bind(this,index,"width")}
                              />
                            </Col>
                            <Col>
                              <Input
                                placeholder="请输入配置3"
                                value={item.height}
                                onChange={this.changeDepart.bind(this,index,"height")}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={styles.formItem2}>
                        <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                          材料：
                        </Col>
                        <Col s="12" l="15">
                          <Input
                            placeholder="请输入材料"
                            style={{ width:"100%" }}
                            value={item.materials}
                            onChange={this.changeDepart.bind(this,index,"materials")}
                          />
                        </Col>
                      </Row>
                      <Row style={styles.formItem2}>
                        <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                          工艺：
                        </Col>
                        <Col s="12" l="15">
                          <Input
                            placeholder="请输入工艺"
                            style={{ width:"100%" }}
                            value={item.craft}
                            onChange={this.changeDepart.bind(this,index,"craft")}
                          />
                        </Col>
                      </Row>
                    </div>
                  )
                })
              }


            </div>
          </IceFormBinderWrapper>

          <div style={styles.formSubmit}>
            <Button
              type="primary"
              onClick={this.validateAllFormField}
            >
              提交模板</Button>
          </div>


        </IceContainer>
      </div>
    );
  }
}

const styles = {
  formSubmit:{
    textAlign:"right",
    marginRight:"50px",
  },
  formInput:{
    marginRight: "5px"
  },
  formHeight:{
    height: "32px",
    lingHeight: "32px",
    vericalAlign: "center",
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    marginBottom: 25,
  },
  formItem2: {
    marginBottom: 10,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
  formLabel2: {
    height: '32px',
    lineHeight: '30px',
  },
};
