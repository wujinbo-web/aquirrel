import React, { Component } from 'react';
import WysiwygEditor from './components/WysiwygEditor';

export default class Wysiwyg extends Component {
  static displayName = 'Wysiwyg';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="wysiwyg-page">
        <WysiwygEditor />
      </div>
    );
  }
}
