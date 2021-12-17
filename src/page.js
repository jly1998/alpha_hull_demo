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
          <Card style={{ margin:'50px'}}>
            <Demo
              alpha={this.state.alpha}
              DTVisible={this.state.DTVisible}
              minVisible={this.state.minVisible}
              maxVisible={this.state.maxVisible}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Alpha Hull" style={{ margin: '50px 50px 50px 0px' }}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <b>1. Calculate Delaunay Triangulation</b>
              </Col>
              <Col span={24}>
                <Checkbox onChange={this.onDTChange}>show Delaunay Triangulation</Checkbox>
              </Col>
              <Col span={24}>
                <b>2. Calculate the minimum and maximum radius of all empty circles of all edges</b>
              </Col>
              <Col span={24}>
                (move mouse onto an edge, show minimum and maximum circles of that single edge)
              </Col>
              <Col span={24}>
                <Checkbox onChange={this.onMinChange}>show all minimum empty circles</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox onChange={this.onMaxChange}>show all maximum empty circles</Checkbox>
                </Col>
              <Col span={24}>
                <b>3. If alpha is in [min, max], </b><br />
                <b>the edge is in the alpha hull</b>
              </Col>
              <Col span={12}>
                Alpha: 
              </Col>
              <Col span={12}>
                <InputNumber
                  size="small" 
                  min={0}
                  max={500}
                  style={{ margin: '0 16px' }}
                  value={this.state.alpha}
                  onChange={this.onAlphaChange}
                />
              </Col>
              <Col span={24}>
                <Slider
                  min={0}
                  max={500}
                  onChange={this.onAlphaChange}
                  value={typeof this.state.alpha === 'number' ? this.state.alpha : 50}
                />
              </Col>
              <Col span={24}>
                <br />
                <b>◾ Click to add point</b>
              </Col>
              <Col span={24}>
                <b>◾ Points are draggable</b>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  };
}

export default Page;
