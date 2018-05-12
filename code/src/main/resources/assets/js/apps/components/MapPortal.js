import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Map from './Map';

export default class MapPortal extends Component {
  constructor(props) {
    super();

    this.state = {
      mapElement: document.querySelector('.map'),
    };

    props.hasLoaded();
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
          />
        </Fragment>
      ), mapElement);
    }

    return null;
  }
}
