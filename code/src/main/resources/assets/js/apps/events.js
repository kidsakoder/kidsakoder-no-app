import React from 'react';
import { render, } from 'react-dom';
import Graphql from './utils/graphql';
import { Map, } from './components/Map';

class Events extends React.Component {
  constructor() {
    super();

    this.state = {
      events: [],
      selectedEvent: null,
    }

    this.client = new Graphql();
    this.client.query(
      {
        contentType: 'event',
        query: 'displayName',
      },
      data => {
        this.setState(
          Object.assign({}, this.state, {
            events: data.data.guillotine.query,
          })
        );
      }
    );
  }

  click(evt) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: <p>{evt.target.innerHTML}</p>,
      })
    );
  }

  render() {
    const events = this.state.events.map((e, i) => (
      <button key={i} onClick={this.click}>{e.displayName}</button>
    ));

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

render(
  <Events />,
  document.currentScript.parentElement.querySelector('.events')
);
