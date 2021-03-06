import React from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import {getTraceData, setSample} from '../api';
import * as d3 from 'd3';

import '../css/tracePanel.css';
import '../css/control.css';

class TracePanel extends React.Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.state = {
      data: null,
      sampleId: 0,
      stop: false
    };
  }

  componentWillUnmount() {
    window.clearInterval(this.timerID);
  }

  handleSampleClick(e) {
    if (this.state.sampleId != e.key) {
      this.timerID = window.setInterval(
        () => this.getData(),
        50
      );
    }
    this.count = 0;
    setSample(e.key);
    this.setState({
      sampleId: parseInt(e.key),
      stop: false
    });
  }
  
  getData() {
    getTraceData().then(data => {
      let stop = false;
      if (this.count < 10 && this.state.data != null && 
          this.state.data.orignal.pos != undefined &&
          this.state.data.orignal.pos.length == data.data.orignal.pos.length) {
        this.count+=1;
        if (this.count == 10) {
          stop = true;
        }
      }
      else
        this.count = 0;
      this.setState({
        data: data.data,
        stop: stop | this.state.stop
      });
    });
  }

  drawAxis(svgName) {
    const svgContainer = d3.selectAll(svgName);
    svgContainer.selectAll('g').remove();
    svgContainer.selectAll('line').remove();
    const width = 500;
    const height = 500;
    const x = d3.scaleLinear()
        .domain([-5, 5])
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([-5, 5])
        .range([height, 0]);
    var xAxis = d3.axisBottom(x)
        .ticks(11 * 2);
    var yAxis = d3.axisLeft(y)
        .ticks(11 * 2);
    d3.select(svgName)
      .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(200,' + (30 + height / 2) + ')')
        .call(xAxis);
    d3.select(svgName)
      .append('g')
        .attr('class', 'axis-y')
        .attr('transform', 'translate(' + (200 + width / 2) +',30)')
        .call(yAxis);
    for (let i = -5;  i <= 5.1; i+=0.2) {
      if (i == 0) 
        continue;
      d3.select(svgName)
        .append('line')
          .attr('x1', 200)  
          .attr('x2', 200 + width)  
          .attr('y1', y(i) + 30)
          .attr('y2', y(i) + 30)
          .attr('stroke','#777')
          .attr('stroke-dasharray', 1)
          .attr('stroke-width',1);
      d3.select(svgName)
        .append('line')
          .attr('x1', 200 + x(i))
          .attr('x2', 200 + x(i))  
          .attr('y1', 30)
          .attr('y2', 30 + height)
          .attr('stroke-dasharray', 1)
          .attr('stroke','#777')
          .attr('stroke-width',1);
    }
  }

  drawLines() {
    const svgContainer = d3.selectAll('.trace-svg');
    const oldPath = svgContainer.selectAll('path');
    const oldCircle = svgContainer.selectAll('circle');
    const width = 500;
    const height = 500;
    const _x = d3.scaleLinear()
        .domain([-5, 5])
        .range([0, width]);
    const x = d => _x(d) + 200;
    const _y = d3.scaleLinear()
        .domain([-5, 5])
        .range([height, 0]);
    const y = d => _y(d) + 30;
    const line_orignal = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
    const line_basis = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        // .curve(d3.curveCatmullRom.alpha(0.5));
        .curve(d3.curveBasis);
    
    if (this.state.data == null || this.state.data.kalman.pos == undefined )
      return;
    oldPath.remove();
    oldCircle.remove();
    const appendLine = (svgName, data, lineFunc, color) => {
      d3.select(svgName)
        .append('path')
          .attr('d', lineFunc(data.pos))
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('fill', 'none');
    };
    appendLine('#trace-orignal', this.state.data.orignal, line_orignal, '#FBCB45');
    appendLine('#trace-kalman', this.state.data.kalman, line_orignal, '#667BBF');
    appendLine('#trace-cluster', this.state.data.cluster, line_orignal, '#7AC07E');
    appendLine('#trace-basis', this.state.data.cluster, line_basis, '#EC7049');
    const appendStart = (svgName, data) => {
      d3.select(svgName).append('circle')
          .style('stroke','#EC888C')
          .style('fill','#1890ff')
          .attr('r', 5)
          .attr('cx', x(data.pos[0].x))
          .attr('cy', y(data.pos[0].y));
    };
    appendStart('#trace-orignal', this.state.data.orignal);
    appendStart('#trace-kalman', this.state.data.kalman);
    appendStart('#trace-cluster', this.state.data.cluster);
    appendStart('#trace-basis', this.state.data.cluster);
    if (this.state.stop) {
      const appendEnd = (svgName, data) => {
        const length = data.pos.length;
        d3.select(svgName).append('circle')
            .style('stroke','#EC888C')
            .style('fill','#808A87')
            .attr('r', 5)
            .attr('cx', x(data.pos[length - 1].x))
            .attr('cy', y(data.pos[length - 1].y));
      };
      appendEnd('#trace-orignal', this.state.data.orignal);
      appendEnd('#trace-kalman', this.state.data.kalman);
      appendEnd('#trace-cluster', this.state.data.cluster);
      appendEnd('#trace-basis', this.state.data.cluster);
      window.clearInterval(this.timerID);
    }
  }

  render() {
    this.drawLines();
    const SampleName = this.state.sampleId === 0 ? 'Sample Selector' 
        : 'Sample ' + this.state.sampleId;
    const sampleItem = [];
    for (let i = 1; i < 8; i++) {
      const type = 'Sample ' + i;
      sampleItem.push(<Menu.Item key={i} value={i}>{type}</Menu.Item>);
    }
    const sampleMenu = (
      <Menu onClick={e => this.handleSampleClick(e)}>
        {sampleItem.map(item => item)}
      </Menu>
    );
    return (
      <div className='all-panel'>
        <div className='title-prefix'></div>
        <p className='title-p'>
          Trace
        </p>

        <div className='control-panel'>
          <div className='control-selector'>
            <div className='selector-name'>
              <p>
                Samples
              </p>
            </div>
            <div  className='selector-prefix'></div>
            <div className='control-right-selector'>
              <Dropdown overlay={sampleMenu} placement='bottomCenter'>
                <div className='control-dropdown-link'>
                  <p className='dropdown-name'> {SampleName} </p>
                  <div className='type-down'>
                    <Icon type='down' />
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className='trace-panel'>
          <div className='orignal-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Orignal
            </p>
            <svg className='trace-svg' id='trace-orignal'>
              {this.drawAxis('#trace-orignal')}
            </svg>          
          </div>
          <div className='cluster-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Cluster
            </p>
            <svg className='trace-svg' id='trace-cluster'>
              {this.drawAxis('#trace-cluster')}
            </svg>
          </div>
          <div className='kalman-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Kalman
            </p>
            <svg className='trace-svg' id='trace-kalman'>
              {this.drawAxis('#trace-kalman')}
            </svg>
          </div>
          <div className='basis-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Basis
            </p>
            <svg className='trace-svg' id='trace-basis'>
              {this.drawAxis('#trace-basis')}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default TracePanel;
