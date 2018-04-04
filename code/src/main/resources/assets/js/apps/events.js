import React from 'react';
import { render, } from 'react-dom';
import Graphql from './utils/graphql';
import Map from './components/Map';

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

    this.click = this.click.bind(this);
  }

  click(evt) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: evt.target.innerHTML,
      })
    );
  }

  render() {
    const events = this.state.events.map((e, i) => {
      const style = {
        backgroundColor: 'red',
      };

      return (
        <button key={i} onClick={this.click} style={style}>
          {e.displayName}
        </button>
      );
    });

    return (
      <React.Fragment>
        <h3>Events</h3>
        {events}
        <Map selectedEvent={this.state.selectedEvent} />
      </React.Fragment>
    );
  }
}

render(
  <Events />,
  document.currentScript.parentElement.querySelector('.events')
);
