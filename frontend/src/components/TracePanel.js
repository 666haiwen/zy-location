import React from 'react';
import '../css/tracePanel.css';
import {getTraceData, startSimulate} from '../api';
import * as d3 from 'd3';
class TracePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  startSimulateBtn() {
    this.timerID = window.setInterval(
      () => this.getData(),
      50
    );
    startSimulate();
  }

  componentWillUnmount() {
    window.clearInterval(this.timerID);
  }

  getData() {
    getTraceData().then(data => {
      this.setState({
        data: data.data
      });
    });
  }

  drawLines() {
    console.log('in drawLines', this.state.data);
    const svgContainer = d3.selectAll('.trace-svg');
    const oldPath = svgContainer.selectAll('path');
    oldPath.remove();
    if (this.state.data == null || this.state.data.kalman.pos == undefined )
      return;
    const width = 950;
    const height = 500;
    const x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([0, 3.2])
        .range([height, 0]);
    const line_orignal = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
    const line_basis = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        // .curve(d3.curveCatmullRom.alpha(0.5));
        .curve(d3.curveBasis);
    d3.select('#trace-orignal').append('path')
        .attr('d', line_orignal(this.state.data.orignal.pos))
        .attr('stroke', '#FBCB45')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    d3.select('#trace-kalman').append('path')
        .attr('d', line_orignal(this.state.data.cluster.pos))
        .attr('stroke', '#667BBF')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    d3.select('#trace-cluster').append('path')
        .attr('d', line_orignal(this.state.data.kalman.pos))
        .attr('stroke', '#7AC07E')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    d3.select('#trace-basis').append('path')
        .attr('d', line_basis(this.state.data.cluster.pos))
        .attr('stroke', '#EC7049')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
  }

  render() {
    this.drawLines();
    return (
      <div className='all-panel'>
        <div className='title-prefix'></div>
        <p className='title-p' onClick = {() => this.startSimulateBtn()}>
          Trace
        </p>
        <div className='trace-panel'>
          <div className='orignal-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Orignal
            </p>
            <svg className='trace-svg' id='trace-orignal'>
            </svg>          
          </div>
          <div className='cluster-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Cluster
            </p>
            <svg className='trace-svg' id='trace-kalman'>
            </svg>
          </div>
          <div className='kalman-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Kalman
            </p>
            <svg className='trace-svg' id='trace-cluster'>
            </svg>
          </div>
          <div className='basis-panel'>
            <div className='title-prefix'></div>
            <p className='title-p'>
              Basis
            </p>
            <svg className='trace-svg' id='trace-basis'>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default TracePanel;
