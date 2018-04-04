import React, { Component, } from 'react';
import { render, } from 'react-dom';

class App extends Component {
  render() {
    return <p>This is a React app</p>;
  }
}

render(<App />, document.getElementById('landing-page'));
