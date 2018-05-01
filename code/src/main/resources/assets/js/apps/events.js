import React from 'react';
import { render } from 'react-dom';
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
        query: 'displayName dataAsJson',
      },
      data => {
        const events = data.data.guillotine.query.map(
          e => Object.assign({}, JSON.parse(e.dataAsJson), {
            displayName: e.displayName,
          })
        );

        this.setState(
          Object.assign({}, this.state, {
            events,
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
      const tags = typeof e.tags === 'object'
        ? e.tags.map((f, j) => <span key={j}>{f}</span>)
        : <span>{e.tags}</span>

      return (
        <div key={i}>
          <h3>{e.displayName}</h3>
          <button onClick={this.click}>
            {e.displayName}
          </button>
          {tags}
          <div dangerouslySetInnerHTML={{__html: e.body}} />
        </div>
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
