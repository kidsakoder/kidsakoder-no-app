import React from 'react';
import { render } from 'react-dom';
import Graphql from './utils/graphql';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            events: [],
        };

        this.client = new Graphql();
        this.client.query(`
        {
          guillotine {
            query(contentTypes: "no.kidsakoder.app:event") {
              displayName
            }
          }
        }
        `, data => {
            console.log(data)
            this.setState(
                Object.assign({}, this.state, {
                    events: data.data.guillotine.query,
                })
            );
        });
    }

    render() {
        let events = this.state.events.map((e, i) => {
            return <div key={i}>{e.displayName}</div>;
        })

        return (
            <React.Fragment>
                <h3>Events</h3>
                {events}
            </React.Fragment>
        );
    }
}

render(<App/>, document.getElementById('events'));
