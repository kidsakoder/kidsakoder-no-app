import React, { Component } from 'react';
import { render } from 'react-dom';
import Graphql from './utils/graphql';
import EventList from './components/EventList';
import MapPortal from './components/MapPortal';

class Events extends Component {
  constructor() {
    super();

    const rootUrl = `${document.currentScript.getAttribute('root') || ''}/`;
    this.state = {
      events: [],
      rootUrl: rootUrl.replace(/\/\/$/, '/'),
    };
  }

  componentDidMount() {
    this.client = new Graphql();
    this.client.query(
      {
        contentType: 'event',
        query: 'displayName dataAsJson _id _path publish { from to first }',
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

  render() {
    return (
      <EventList
        rootUrl={this.state.rootUrl}
        events={this.state.events}
        mapPortal={MapPortal}
      />
    );
  }
}

render(
  <Events />,
  document.currentScript.parentElement.querySelector('.events')
);
