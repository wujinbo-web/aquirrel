import React, { Component } from 'react';
import ProjectOverview from './components/ProjectOverview';
import FeedList from './components/FeedList';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home-page">
        <ProjectOverview />
      </div>
    );
  }
}
