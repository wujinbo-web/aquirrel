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
import { templateAdd, templateNameUpdate, otherSizeQuery, partDetailQuery,
  otherSizeUpdate, templatePartUpdate, templatePartDelete, otherSizeAdd,
  templatePartAdd, otherSizeDelete } from '@/api/apiUrl';

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
      name:this.props.name,
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
    this.getOtherSize();
    this.getPartSize();
  }

  //获取其他规格参数
  getOtherSize = async () => {
    let response = await postUrl(otherSizeQuery,{templateId: this.props.id})
    this.setState({ specJson: response.data.data });
  }

  //获取部件参数
  getPartSize = async () => {
    let response = await postUrl(partDetailQuery,{templateId: this.props.id})
    console.log(response.data.data);
    this.setState({partsJson: response.data.data});
  }

  //修改部件名字
  onChangeName = (value) => {
    this.setState({ name: value });
  }
  //修改部件名字接口数据
  onChangeNameData = async () => {
    let { name } = this.state;
    let { id } = this.props;
    let response = await postUrl(templateNameUpdate,{"template.id": id, "template.name": name});
    if(response.data.state!="success"){
      Toast.error(response.data.msg);
    }
  }


  //添加配置参数
  addConfig = async () => {
    let { id } = this.props;
    let { specJson } = this.state;
    let response = await postUrl(otherSizeAdd,{
      "spec.name": "",
      "spec.vbname": this.changeCode(specJson.length),
      "spec.size": "",
      "spec.templateId": id,
    })
    if(response.data.state=="success"){
      this.getOtherSize();
    }else{
      Toast.error("网络错误");
    }
  }
  //删除配置参数
  deleteConfig = async (pro_num) => {
    let { specJson } = this.state;
    let response = await postUrl(otherSizeDelete,{id:specJson[pro_num].id})
    if(response.data.state == "success"){
      this.getOtherSize();
    }else{
      Toast.error("网络错误");
    }
    //删除指定位置
    // specJson.splice(pro_num,1);
    //判断如果删除，删除位置后面的下标字母改变
    // specJson.forEach((item,index)=>{
    //   if(index>=pro_num){
    //     item.vbname = this.changeCode(index);
    //   }
    // });
    // this.setState({});
  }
  //输入配置参数
  changeConfig = (index, value) => {
    let { specJson } = this.state;
    specJson[index].name = value;
    this.setState({});
  }
  //当失焦时，修改数据
  changeConfigData = async (index) => {
    let { specJson } = this.state;
    let response = await postUrl(otherSizeUpdate,{
      "spec.name": specJson[index].name,
      "spec.size": specJson[index].size==null?"":specJson[index].size,
      "spec.templateId": specJson[index].templateId,
      "spec.id": specJson[index].id,
      "spec.vbname": specJson[index].vbname,
    })
    if(response.data.state!="success"){
      Toast.error(response.data.msg);
    }
  }

  //添加部件
  addDepart = async () => {
    let { id } = this.props;
    let { partsJson } = this.state;
    let response = await postUrl(templatePartAdd,{
      "parts.name": "",
      "parts.num": "",
      "parts.templateId": id,
      "parts.width": "",
      "parts.height": "",
      "parts.length": "",
      "parts.materials":"",
    });
    if(response.data.state=="success"){
      this.getPartSize();
    }else{
      Toast.error("网络错误");
    }
  }
  //删除部件
  deleteDepart = async (pro_num) => {
    let { partsJson } = this.state;
    let response = await postUrl(templatePartDelete,{ id:partsJson[pro_num].id });
    if(response.data.state=="success"){
      //删除指定位置
      partsJson.splice(pro_num,1);
      this.setState({});
    }else{
      Toast.error(response.data.msg);
    }

  }
  //输入部件信息
  changeDepart = (index, name, value) => {
    let { partsJson } = this.state;
    partsJson[index][name] = value;
    this.setState({});
  }
  //当失焦，修改部件数据
  changeDepartData = async(index) => {
      let { partsJson } = this.state;
      let response = await postUrl(templatePartUpdate,{
        "parts.id": partsJson[index].id,
        "parts.name": partsJson[index].name,
        "parts.num": this.parseFormula(partsJson[index].num),
        "parts.templateId": partsJson[index].templateId,
        "parts.width":this.parseFormula(partsJson[index].width),
        "parts.height":this.parseFormula(partsJson[index].height),
        "parts.length": this.parseFormula(partsJson[index].length),
        "parts.materials": partsJson[index].materials,
        "parts.craft": partsJson[index].craft,
      })
      if(response.data.state!="success"){
        Toast.error(response.data.msg);
      }
  }

  parseFormula = (value) => {
    let str = JSON.stringify(value).replace(/\+/g,'%2B');
    return str.slice(1,str.length-1);
  }


  //公共函数，0-A，1-B
  changeCode = (num) => {
    return String.fromCharCode(65 + parseInt(num));
  }

  render() {
    let { partsJson, specJson, name } = this.state;
    let { id } = this.props;
    return (
      <div className="user-form">
        <IceContainer>

          <IceTitle text="编辑模板" />

            <div style={styles.formContent}>
              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.formLabel}>
                  模板名称：
                </Col>
                <Col s="12" l="10">
                    <Input
                      size="large"
                      placeholder="请输入模板名称"
                      value={name}
                      onChange={this.onChangeName}
                      onBlur = {this.onChangeNameData}
                      style={{ width: '100%' }}
                    />
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
                                onBlur={this.changeConfigData.bind(this,index)}
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
                                onBlur={this.changeDepartData.bind(this,index)}
                              />
                            </Col>
                            <Col l="2" style={styles.formLabel}>数量：</Col>
                            <Col l="8">
                              <Input
                                placeholder="请输入数量"
                                value={item.num}
                                onChange={this.changeDepart.bind(this,index,"num")}
                                onBlur={this.changeDepartData.bind(this,index)}
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
                                onBlur={this.changeDepartData.bind(this,index)}
                              />
                            </Col>
                            <Col>
                              <Input
                                placeholder="请输入配置2"
                                value={item.width}
                                onChange={this.changeDepart.bind(this,index,"width")}
                                onBlur={this.changeDepartData.bind(this,index)}
                              />
                            </Col>
                            <Col>
                              <Input
                                placeholder="请输入配置3"
                                value={item.height}
                                onChange={this.changeDepart.bind(this,index,"height")}
                                onBlur={this.changeDepartData.bind(this,index)}
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
                            onBlur={this.changeDepartData.bind(this,index)}
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
                            onBlur={this.changeDepartData.bind(this,index)}
                          />
                        </Col>
                      </Row>
                    </div>
                  )
                })
              }
            </div>
            <div style={styles.formSubmit}>
              <Button
                type="primary"
                onClick={this.props.redirct}
              >
                完成
              </Button>
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
// <div style={styles.formSubmit}>
//   <Button
//     type="primary"
//     onClick={this.validateAllFormField}
//   >
//     提交模板</Button>
// </div>
//提交表单
// validateAllFormField = () => {
//   this.refs.form.validateAll( async (errors, values) => {
//     if(errors==null){
//       let { value, partsJson, specJson } = this.state;
//       partsJson = partsJson.map(item=>{
//         return encodeURI(JSON.stringify(item)).replace(/\+/g,'%2B');
//       }).join(',');
//       specJson = specJson.map(item=>{
//         return JSON.stringify(item);
//       }).join(',');
//       let response = await postUrl(templateAdd,{
//         "template.name": value.name,
//         partsJson: `[${partsJson}]`,
//         specJson: `[${specJson}]`
//       });
//       if(response.data.state=="success"){
//         value={name:""};
//         partsJson=[];
//         specJson=[];
//         this.setState({});
//         Toast.success(response.data.msg);
//       }else{
//         Toast.error(response.data.msg);
//       }
//     }
//   })
// }
