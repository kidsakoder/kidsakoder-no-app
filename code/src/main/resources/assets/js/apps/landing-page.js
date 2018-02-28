import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    render() {
        return <p>Hello React project!</p>;
    }
}
console.log(`works ${2} nicee`);

render(<App/>, document.getElementById('landing-page'));
