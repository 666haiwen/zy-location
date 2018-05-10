import React from 'react';
import TracePanel from './TracePanel';
import 'antd/dist/antd.css';
import '../css/const.css';

class App extends React.Component {
  render() {
    return (
      <div id="app">
        <TracePanel />
      </div>
    );
  }
}

export default App;
