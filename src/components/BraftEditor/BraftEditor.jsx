import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

export default class CustomBraftEditor extends Component {
  static displayName = 'CustomBraftEditor';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState("你好世界")
    };
  }

  handleRawChange = (content) => {
    console.log("没事");
  };

  handleChange = (rawContent) => {
    this.state.editorState=rawContent;
    this.setState({});
    // 如果上层有传递 onChange 回调，则应该传递上去
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(rawContent.toHTML());
    }
  };

  render() {
    const editorProps = {
      height: 300,
      contentFormat: 'html',
      initialContent: '<p></p>',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange,
      value: this.state.editorState,
    };

    return (
      <IceContainer>
        <BraftEditor {...editorProps} />
      </IceContainer>
    );
  }
}
