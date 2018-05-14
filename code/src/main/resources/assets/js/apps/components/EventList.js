import React from 'react';

export default class EventList extends React.Component {
  constructor(props) {
    super();

    this.sortTypes = {
      distanceAsc: {
        key: 'locationParsed',
        type: 'distance',
        asc: true,
      },
      distanceDesc: {
        key: 'locationParsed',
        type: 'distance',
        asc: false,
      },
      dateAsc: {
        key: 'date',
        type: 'date',
        asc: true,
      },
      dateDesc: {
        key: 'date',
        type: 'date',
        asc: false,
      },
    }

    this.state = {
      events: props.events
        ? this.formatEvents(props.events, props.today)
        : [],
      selectedEvent: null,
      mapIsShown: false,
      currPosition: props.currPosition || [0, 0],
      sortBy: this.sortTypes.distanceAsc,
    };

    this.displayMarkerOnMap = this.displayMarkerOnMap.bind(this);
    this.changeOrderHandler = this.changeOrderHandler.bind(this);
    this.mapHasLoadedHandler = this.mapHasLoadedHandler.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
    this.sendCurrentPosition = this.sendCurrentPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events !== this.props.events) {
      this.setState(Object.assign({}, this.state, {
        events: this.formatEvents(nextProps.events),
      }));
    }
  }

  /**
   * Find the squared distance between two points. Some times it
   * is only needed to have the relative distances when comparing
   * values. Sort algorithms do not need an exact distance measure.
   * 
   * @param {object[]} p Point p.
   * @param {object[]} q Point q.
   * @returns {number} The squared distance between p and q.
   */
  getSquare(p, q) {
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];

    return dx * dx + dy * dy;
  }

  /**
   * Find the ecluidean distance between two points.
   * 
   * @param {object[]} p Point p.
   * @param {object[]} q Point q.
   * @returns {number} The distance between p and q.
   */
  getDistance(p, q) {
    return Math.sqrt(this.getSquare(p, q));
  }

  /**
   * Measure a squared distance on a flat map. Using squared distances
   * as square roots are computationally expensive. This is used in
   * sorting algotithms and need to be fast and do not need exact
   * distances.
   * 
   * @param {object[]} p Point p.
   * @param {object[]} q Point q.
   * @returns {number} The squared distance between p and q on a sphere map.
   */
  getSphereSquare(p, q) {
    const correctLng = lng => 1 / Math.cos(lng / 180 * Math.PI);
    const np = [correctLng(p[0]) * p[0], p[1]];
    const nq = [correctLng(q[0]) * q[0], q[1]];

    return this.getSquare(np, nq);
  }

  /**
   * Filter and sort events correctly.
   */
  getEvents() {
    const {
      events,
      sortBy: {
        key,
        type,
        asc,
      },
    } = this.state;

    let sort;

    switch (type) {
    case 'distance':
      sort = (a, b) => (
        this.getSphereSquare(a[key], this.state.currPosition)
        > this.getSphereSquare(b[key], this.state.currPosition)
      );
      break;
    default:
      sort = (a, b) => a[key] > b[key];
      break;
    }

    return events
      .filter(e => e.published)
      .sort((a, b) => asc ? sort(a, b) : sort(b, a));
  }

  /**
   * Set state when changing what to sort by in dropdown list.
   * 
   * @param {object} evt A select on-change event.
   */
  changeOrderHandler(evt) {
    this.setState(Object.assign({}, this.state, {
      sortBy: this.sortTypes[evt.target.value],
    }));
  }

  /**
   * When selecting an event from the list to display on the map.
   * 
   * @param {object} event An event object.
   */
  displayMarkerOnMap(event) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: {
          id: event.id,
          name: event.displayName,
          coord: event.locationParsed,
          locationName: event.locationName,
        },
      })
    );
  }

  /**
   * Format events from the GraphQL API.
   * 
   * @param {object} events A list of events from GraphQL.
   * @param {Date} [today=new Date()] Date to filter published articles by.
   * @returns {object[]} Object with mapped events from the API.
   */
  formatEvents(events, today = new Date()) {
    return events.map(e => {
      let published = true;

      if ('from' in e.publish) {
        if (today < new Date(e.publish.from)) {
          published = false;
        }
      } else {
        published = false;
      }

      if ('to' in e.publish) {
        if (today > new Date(e.publish.to)) {
          published = false;
        }
      }

      const dataParsed = JSON.parse(e.dataAsJson);

      return Object.assign({}, dataParsed, {
        displayName: e.displayName,
        id: e._id,
        path: e._path,
        locationParsed: this.parseCoordinates(dataParsed.location),
        published,
        date: (e.publish || {}).from || null,
        publish: e.publish,
      });
    });
  }

  /**
   * A callback function to tell if the map has loaded into a container.
   */
  mapHasLoadedHandler() {
    this.setState(Object.assign({}, this.state, {
      mapIsShown: true,
    }));
  }

  /**
   * Convert a string format of coordinates into an array.
   * 
   * @param {string} coords Coordinates on format 'lat,lng'.
   * @returns {object[]} Array with format [lat, lng].
   */
  parseCoordinates(coords) {
    const [ lat = '0', lng = '0' ] = (coords || '0,0').split(',');
    return [ parseFloat(lat), parseFloat(lng) ]
  }

  /**
   * A function sent into the map component as a callback when
   * a marker is selected.
   * 
   * @param {string} id An id from a marker.
   */
  selectEvent(id) {
    const event = this.getEvents().filter(e => e.id === id)[0];
    this.displayMarkerOnMap({
      id: event.id,
      displayName: event.name,
      locationParsed: event.locationParsed,
      locationName: event.locationName,
    });
  }

  /**
   * A callback function from the map telling where the user is.
   * 
   * @param {object[]} currPosition Position on format [lat, lng].
   */
  sendCurrentPosition(currPosition) {
    this.setState(Object.assign({}, this.state, {
      currPosition,
    }))
  }

  render() {
    const events = this.getEvents()
      .map((e, i) => {
        const tags = typeof e.tags === 'object'
          ? e.tags.map((f, j) => (
            <span className="event-tag" key={j}>{f}</span>
          ))
          : <span className="event-tag">{e.tags}</span>;

        let classAppend = '';
        if (e.id === (this.state.selectedEvent || {}).id || 0) {
          classAppend = ' selected';
        }

        return (
          <div className={`event-item${classAppend}`} key={i}>
            <h3><a href={this.props.rootUrl + e.path}>{e.displayName}</a></h3>
            {tags}
            {
              this.state.mapIsShown &&
              <button onClick={() => this.displayMarkerOnMap(e)}>
                Vis på kart
              </button>
            }
          </div>
        );
      });

    const markers = this.getEvents().map(event => ({
      id: event.id,
      name: event.displayName,
      coord: event.locationParsed,
      locationName: event.locationName,
      selected: event.id === (this.state.selectedEvent || {}).id || 0,
    }));

    let MapPortal = null;
    if (this.props.mapPortal) {
      MapPortal = this.props.mapPortal;
    }

    return (
      <div className="EventList">
        <h2 className="event-title">Arrangementer</h2>
        <select onChange={this.changeOrderHandler}>
          <option value="distanceAsc">Nærmeste arrangementer</option>
          <option value="dateDesc">Siste arrangementer</option>
          <option value="dateAsc">Eldste arrangementer</option>
          <option value="distanceDesc">Arrangementer lengst unna</option>
        </select>
        <div className="event-list">
          {events}
        </div>
        <MapPortal
          hasLoaded={this.mapHasLoadedHandler}
          selectedEvent={this.state.selectedEvent}
          selectEvent={this.selectEvent}
          markers={markers}
          sendCurrentPosition={this.sendCurrentPosition}
        />
      </div>
    );
  }
}
