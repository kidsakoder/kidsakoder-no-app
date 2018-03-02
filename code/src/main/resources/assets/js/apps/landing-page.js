import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    render() {
        return <p>This is a React app</p>;
    }
}

render(<App/>, document.getElementById('landing-page'));
