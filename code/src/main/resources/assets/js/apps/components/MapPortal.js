import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Map from './Map';

export default class MapPortal extends Component {
  constructor() {
    super();

    this.state = {
      mapElement: document.querySelector('.map'),
    };

    this.hasLoaded = !!this.state.mapElement;
  }

  componentDidMount() {
    if (!this.hasLoaded) {
      let timeout;
      const interval = setInterval(() => {
        if (document.querySelector('.map')) {
          clearInterval(interval);
          clearTimeout(timeout);
          this.hasLoaded = true;
          this.props.hasLoaded();
        }
      }, 100);

      timeout = setTimeout(() => {
        clearInterval(interval);
      }, 1000);
    }
  }

  render() {
    const mapElement = this.state.mapElement || document.querySelector('.map');

    if (mapElement) {
      let selectedPosition = null;
      if (this.props.selectedEvent && 'coord' in this.props.selectedEvent) {
        selectedPosition = this.props.selectedEvent.coord;
      }

      return createPortal((
        <Fragment>
          <h2>Kart</h2>
          <Map
            markers={this.props.markers}
            position={selectedPosition}
            selectEvent={this.props.selectEvent}
            sendCurrentPosition={this.props.sendCurrentPosition}
          />
        </Fragment>
      ), mapElement);
    }

    return null;
  }
}
