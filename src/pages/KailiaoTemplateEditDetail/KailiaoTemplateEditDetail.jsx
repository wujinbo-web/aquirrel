import React, { Component } from 'react';
import UserForm from './components/UserForm';

export default class KailiaoTemplateEditDetail extends Component {
  static displayName = 'KailiaoTemplateEditDetail';

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.location.search.split('?')[1].split('&').map(item=>item.split('=')[1])
    };
  }
  componentDidMount(){

  }
  render() {
    let { data } = this.state;
    return (
      <div className="purchase-type-page">
        <UserForm id={data[0]} name={decodeURI(data[1])} redirct={this.redirct} />
      </div>
    );
  }
  redirct = () => {
    this.props.history.push("/desgin/tempalteedit");
  }
}
