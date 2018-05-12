import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const createIcon = color => new L.Icon({
  iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [12, -34],
  tooltipAnchor: [12, -28],
  shadowSize: [41, 41],
});

const icons = {
  greyIcon: createIcon('grey'),
  greenIcon: createIcon('green'),
};

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
      <Marker
        key={i}
        position={marker.coord}
        minWidth={120}
        icon={marker.selected ? icons.greenIcon : icons.greyIcon}
      >
        <Tooltip>
          <span>
            <h3>{marker.name}</h3>
            @{marker.locationName}
          </span>
        </Tooltip>
      </Marker>
    ));

    return (
      <LeafletMap center={position} zoom={10} style={{
        width: '100%',
        height: '320px',
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
