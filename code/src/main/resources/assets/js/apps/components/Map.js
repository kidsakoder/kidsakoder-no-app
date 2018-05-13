import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

export default class MapPortal extends Component {
  constructor(props) {
    super();

    this.state = {
      position: props.position || this.getCurrentPosition(),
      markers: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position !== this.props.position) {
      this.setState(Object.assign({}, this.state, {
        position: nextProps.position,
      }));
    }
  }

  getCurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(currPosition => {
      const { latitude, longitude } = currPosition.coords;
      const position = [ latitude, longitude ];
      this.setState(Object.assign({}, this.state, {
        position,
      }));
    });
  }

  render() {
    const position = this.state.position || [63.4, 10.4];
    const markers = this.props.markers.map((marker, i) => (
      <Marker key={i} position={marker.position}>
        <Popup>
          <span>
            Dette er et event {marker.title}
          </span>
        </Popup>
      </Marker>
    ));

    return (
      <LeafletMap center={position} zoom={13} style={{
        width: '100%',
        height: '200px',
      }}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </LeafletMap>
    );
  }
}
