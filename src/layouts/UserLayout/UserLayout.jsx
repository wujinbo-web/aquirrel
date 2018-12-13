import React, { Component } from 'react';
import Layout from '@icedesign/layout';
import { Switch, Route, Redirect } from 'react-router-dom';
import { routerData } from '../../routerConfig';
import './UserLayout.scss';
import backGround from "./components/bg.png"
import Logo from "./components/logo.png"
import LogoTitle from "./components/logotitle.png"

export default class UserLayout extends Component {
  static displayName = 'UserLayout';

  static propTypes = {};

  static defaultProps = {};

  render() {
    return (
      <Layout className="user-layout" style={styles.container}>
        <div className="header">
          <a href="javascript:;" className="meta">
          <span className="title"><img src={Logo} /><img src={LogoTitle} /></span>
          </a>
        </div>

        <Switch>
          {routerData.map((item, index) => {
            return item.component ? (
              <Route
                key={index}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ) : null;
          })}
          <Redirect exact from="/user" to="/user/login" />
        </Switch>
      </Layout>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    paddingTop: '100px',
    background: `#fff url(${backGround}) center 140px no-repeat`,
    backgroundSize: 'contain',
  },
};
