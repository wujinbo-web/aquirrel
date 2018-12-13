import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text">
          <img src={require('./images/logo.png')} style={{ width: "100%" }} />
        </Link>
      </div>
    );
  }
}
