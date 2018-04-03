import React from 'react';
import { render, createPortal } from 'react-dom';
import Graphql from './utils/graphql';

class Events extends React.Component {
    constructor() {
        super();

        this.state = {
            events: [],
            selectedEvent: null,
        };

        this.client = new Graphql();
        this.client.query({
            contentType: 'event',
            query: 'displayName',
        }, data => {
            this.setState(Object.assign({}, this.state, {
                events: data.data.guillotine.query,
            }));
        });
    }

    click(evt) {
        this.setState(Object.assign({}, this.state, {
            selectedEvent: <p>{evt.target.innerHTML}</p>,
        }))
    }

    render() {
        let events = this.state.events.map((e, i) => {
            return <div key={i} onClick={this.click.bind(this)}>{e.displayName}</div>;
        });

        return (
            <React.Fragment>
                <h3>Events</h3>
                {events}
                <Map>
                    <h2>Dette er et kart i en portal</h2>
                    {this.state.selectedEvent}
                </Map>
            </React.Fragment>
        );
    }
}

class Map extends React.Component {
    render() {
        const mapElement = document.querySelector('.map');

        if (mapElement) {
            return createPortal(
                this.props.children,
                mapElement,
            );
        }

        return null;
    }
}

render(<Events/>, document.currentScript.parentElement.querySelector('.events'));
