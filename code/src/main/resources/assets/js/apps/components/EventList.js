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

    this.click = this.click.bind(this);
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
   * @param {array} p Point p
   * @param {array} q Point q
   */
  getSquare(p, q) {
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];

    return dx * dx + dy * dy;
  }

  /**
   * Find the ecluidean distance between two points.
   * 
   * @param {array} p Point p
   * @param {array} q Point q
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
   * @param {array} p Point p
   * @param {array} q Point q
   */
  getSphereSquare(p, q) {
    const correctLng = lng => Math.cos(lng / 180 * Math.PI);
    const np = [p[0], correctLng(p[1]) * p[1]];
    const nq = [q[0], correctLng(q[1]) * q[1]];

    return this.getSquare(np, nq);
  }

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

  changeOrderHandler(evt) {
    this.setState(Object.assign({}, this.state, {
      sortBy: this.sortTypes[evt.target.value],
    }));
  }

  click(event) {
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

  mapHasLoadedHandler() {
    this.setState(Object.assign({}, this.state, {
      mapIsShown: true,
    }));
  }

  parseCoordinates(coords) {
    const [ lat = '0', lng = '0' ] = (coords || '0,0').split(',');
    return [ parseFloat(lat), parseFloat(lng) ]
  }

  selectEvent(id) {
    const event = this.getEvents().filter(e => e.id === id)[0];
    this.click({
      id: event.id,
      displayName: event.name,
      locationParsed: event.locationParsed,
      locationName: event.locationName,
    });
  }

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
              <button onClick={() => this.click(e)}>
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
