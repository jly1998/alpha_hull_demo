import React, { Component } from 'react';
import { Row, Col, Checkbox, Slider, InputNumber, Card } from 'antd';
import Demo from './demo';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alpha: 50,
      DTVisible: false,
      minVisible: false,
      maxVisible: false,
      
    }
  }

  onDTChange = (e) => {
    this.setState({
      DTVisible: e.target.checked
    });
  }
  onMinChange = (e) => {
    this.setState({
      minVisible: e.target.checked
    });
  }
  onMaxChange = (e) => {
    this.setState({
      maxVisible: e.target.checked
    });
  }
  onAlphaChange = value => {
    this.setState({
      alpha: value,
    });
  };

  render() {
    return (
      <Row>
        <Col span={16}>
          <Card style={{ margin:'50px', width: window.innerWidth*0.6, height: window.innerHeight-50 }}>
            <Demo
              alpha={this.state.alpha}
              DTVisible={this.state.DTVisible}
              minVisible={this.state.minVisible}
              maxVisible={this.state.maxVisible}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ margin:'50px'}}>
          <Checkbox onChange={this.onDTChange}>show Delauny Triangulation</Checkbox>
          <Checkbox onChange={this.onMinChange}>show all minimum empty circle</Checkbox>
          <Checkbox onChange={this.onMaxChange}>show all maximum empty circle</Checkbox>
          <Row>
            <Col span={12}>
              <Slider
                min={0}
                max={500}
                onChange={this.onAlphaChange}
                value={typeof this.state.alpha === 'number' ? this.state.alpha : 50}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={500}
                style={{ margin: '0 16px' }}
                value={this.state.alpha}
                onChange={this.onAlphaChange}
              />
            </Col>
          </Row>
          </Card>
        </Col>
      </Row>
    )
  };
}

export default Page;
