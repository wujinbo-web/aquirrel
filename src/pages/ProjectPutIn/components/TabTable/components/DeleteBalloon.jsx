import React, { Component } from 'react';
import { Button, Balloon } from '@icedesign/base';
import PropTypes from 'prop-types';

export default class DeleteBalloon extends Component {
  static propTypes = {
    handleRemove: PropTypes.func,
  };

  static defaultProps = {
    handleRemove: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleHide = (visible, code) => {
    if (code === 1) {
      this.props.handleRemove();
    }
    this.setState({
      visible: false,
    });
  };

  handleVisible = (visible) => {
    this.setState({ visible });
  };

  render() {
    const visibleTrigger = (
      <Button size="medium" type="secondary" shape="warning">
        确认入货
      </Button>
    );

    const content = (
      <div>
        <div style={styles.contentText}>确保订单所有商品都已入货？</div>
        <Button
          id="confirmBtn"
          size="large"
          type="normal"
          shape="warning"
          style={{ marginRight: '5px' }}
          onClick={(visible) => this.handleHide(visible, 1)}
        >
          确认
        </Button>
        <Button
          id="cancelBtn"
          size="small"
          onClick={(visible) => this.handleHide(visible, 0)}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Balloon
        trigger={visibleTrigger}
        triggerType="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisible}
      >
        {content}
      </Balloon>
    );
  }
}

const styles = {
  contentText: {
    padding: '5px 0 15px',
  },
};
