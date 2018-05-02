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
      mapIsShown: !!document.querySelector('.map'),
      rootUrl: document.currentScript.getAttribute('root') || '/',
    };

    this.client = new Graphql();
    this.client.query(
      {
        contentType: 'event',
        query: 'displayName dataAsJson _path publish { from to first }',
      },
      data => {
        const events = data.data.guillotine.query.map(
          e => {
            let published = false;

            if ('from' in e.publish) {
              if (new Date() > new Date(e.publish.from)) {
                published = true;
              }
            }

            if ('to' in e.publish) {
              if (new Date() < new Date(e.publish.to)) {
                published = true;
              }
            }

            return Object.assign({}, JSON.parse(e.dataAsJson), {
              displayName: e.displayName,
              path: e._path,
              published,
              publish: e.publish,
            })
          }
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

  click(eventName) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: eventName,
      })
    );
  }

  render() {
    const events = this.state.events
      .filter(e => e.published)
      .map((e, i) => {
        const tags = typeof e.tags === 'object'
          ? e.tags.map((f, j) => <span key={j}>{f} </span>)
          : <span>{e.tags}</span>;

        return (
          <div key={i}>
            <h3><a href={this.state.rootUrl + e.path}>{e.displayName}</a></h3>
            {tags}
            {
              this.state.mapIsShown &&
              <button onClick={() => this.click(e.displayName)}>
                Vis på kart
              </button>
            }
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
