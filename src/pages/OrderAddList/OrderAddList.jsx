import React, { Component } from 'react';
import { Table, Input, Button, Select, Dialog } from '@icedesign/base';
import IceContainer  from '@icedesign/container';

export default class OrderAddList extends Component {
  static displayName = 'OrderAddList';

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          name: "",
          size:"",
          remarks:""
        }
      ],
      columns:[],
      num: 1,
      addFloorVisible: false,
    };
  }

  addFloor = () => {
    let floor = this.state.num+"F";
    this.state.columns.push({title: floor});
    this.state.dataSource.forEach((item,index)=>{
      this.state.dataSource[index][floor]=0;
    })
    this.setState({
      addFloorVisible: false
    });
  }

  addItem = () => {
    let key;
    let data={};
    for( key in this.state.dataSource[0] ){
      if(key=="name"||key=="size"||key=="remarks"){
        data[key]="";
      }else{
        data[key]=0;
      }
    }
    console.log(data);
    this.state.dataSource.push(data);
    this.setState({})

  }

  lookData = () => {
    console.log(this.state.dataSource);
  }

  changeData = (index,record,valueKey,value) => {
    let { dataSource } = this.state;
    dataSource[index][valueKey]=value;
    this.setState({});
  }

  renderName = (valueKey, value, index, record) => {
    if(valueKey=="name"){
      return (
        <Select
          dataSource={[{label:"床",value:"床"},{label: "桌子", value: "桌子"}]}
          onChange={this.changeData.bind(this, index, record, valueKey)}
        />
      )
    }else{
      return (<Input
                style={{ width:"80px"}}
                placeholder={valueKey=="remarks"? "": "0"}
                onChange={this.changeData.bind(this, index, record, valueKey)}
              />)
    }
  }

  onClose = () => {
     this.setState({
       addFloorVisible: false
     });
   };

   onOpen = () => {
      this.setState({
        addFloorVisible: true
      });
   };

  FloorNum = (value) => {
     this.state.num = value;
     this.setState({});
  }

  render() {
    const { dataSource } = this.state;
    return (
      <div className="order-add-list-page">
        <IceContainer>

          <Table dataSource={ dataSource }>
              <Table.Column title="名称" dataIndex="name" cell={this.renderName.bind(this,"name")}/>
              <Table.Column title="规格" dataIndex="size" cell={this.renderName.bind(this,"size")}/>
                {
                  this.state.columns.map((item,index)=>{
                    return (<Table.Column
                      title={ item.title }
                      key={index}
                      dataIndex={(index+1)+"F" }
                      cell={this.renderName.bind(this,(index+1)+"F")}
                      />);
                  })
                }
              <Table.Column title="备注" dataIndex="remarks" cell={this.renderName.bind(this,"remarks")} />
          </Table>

          <Button onClick={this.addItem}>新增</Button>

          <Button onClick={this.onOpen}>添加楼层</Button>

          <Dialog
            visible={this.state.addFloorVisible}
            onOk={this.addFloor}
            onCancel={this.onClose}
            onClose={this.onClose}
            title="请输入楼层数"
          >
            <Input placeholder="请输入楼层数" onChange={this.FloorNum}/>
          </Dialog>

        </IceContainer>
      </div>
    );
  }
}
