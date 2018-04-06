import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';

export default class Map extends Component {
  render() {
    const mapElement = document.querySelector('.map');

    if (mapElement) {
      return createPortal((
        <Fragment>
          <h2>Kart</h2>
          <p>{this.props.selectedEvent}</p>
        </Fragment>
      ), mapElement);
    }

    return null;
  }
}
