import React from 'react';
import { createPortal, } from 'react-dom';

export default class Map extends React.Component {
  render() {
    const mapElement = document.querySelector('.map');

    if (mapElement) {
      return createPortal(this.props.children, mapElement);
    }

    return null;
  }
}
