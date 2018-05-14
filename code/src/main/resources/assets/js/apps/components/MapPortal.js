import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import Map from './Map';

export default class MapPortal extends Component {
  constructor(props) {
    super();

    this.state = {
      mapElements: document.querySelectorAll('.map'),
    };

    this.hasLoaded = false;

    if (this.state.mapElements) {
      props.hasLoaded();
      this.hasLoaded = true;
    }
  }

  componentDidMount() {
    let timeout;
    const interval = setInterval(() => {
      if (document.querySelector('.map')) {
        clearInterval(interval);
        clearTimeout(timeout);
        this.hasLoaded = true;
        this.props.hasLoaded();
        this.setState(Object.assign({}, this.state, {
          mapElements: document.querySelectorAll('.map'),
        }));
      }
    }, 100);

    timeout = setTimeout(() => {
      clearInterval(interval);
    }, 1000);
  }

  render() {
    const mapElements = this.state.mapElements
      || document.querySelectorAll('.map');

    if (mapElements.length) {
      let selectedPosition = null;
      if (this.props.selectedEvent && 'coord' in this.props.selectedEvent) {
        selectedPosition = this.props.selectedEvent.coord;
      }

      const maps = [];
      mapElements.forEach(map => {
        maps.push(createPortal((
          <Fragment>
            <h2>Kart</h2>
            <Map
              markers={this.props.markers}
              position={selectedPosition}
              selectEvent={this.props.selectEvent}
              sendCurrentPosition={this.props.sendCurrentPosition}
            />
          </Fragment>
        ), map));
      });

      return maps;
    }

    return null;
  }
}
