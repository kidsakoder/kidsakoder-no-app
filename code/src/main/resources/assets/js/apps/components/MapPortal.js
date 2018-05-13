import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Map from './Map';

export default class MapPortal extends Component {
  constructor(props) {
    super();

    this.state = {
      mapElement: document.querySelector('.map'),
    };

    if (this.state.mapElement) {
      props.hasLoaded();
    }
  }

  render() {
    const mapElement = this.state.mapElement || document.querySelector('.map');

    if (mapElement) {
      return createPortal((
        <Fragment>
          <h2>Kart</h2>
          <p>{this.props.selectedEvent}</p>
          <Map markers={[]} />
        </Fragment>
      ), mapElement);
    }

    return null;
  }
}
