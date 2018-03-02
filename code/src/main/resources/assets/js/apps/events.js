import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    render() {
        return <p>Events</p>;
    }
}

render(<App/>, document.getElementById('events'));
