import React from 'react';

export default class EventList extends React.Component {
  constructor(props) {
    super();

    this.state = {
      events: props.events
        ? this.formatEvents(props.events, props.today)
        : [],
      selectedEvent: null,
      mapIsShown: false,
    };

    this.click = this.click.bind(this);
    this.mapHasLoadedHandler = this.mapHasLoadedHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events !== this.props.events) {
      this.setState(Object.assign({}, this.state, {
        events: this.formatEvents(nextProps.events),
      }));
    }
  }

  getEvents() {
    return this.state.events.filter(e => e.published);
  }

  click(event) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: {
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
        path: e._path,
        locationParsed: this.parseCoordinates(dataParsed.location),
        published,
        publish: e.publish,
      })
    })
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

  render() {
    const events = this.getEvents()
      .map((e, i) => {
        const tags = typeof e.tags === 'object'
          ? e.tags.map((f, j) => (
            <span className="event-tag" key={j}>{f}</span>
          ))
          : <span className="event-tag">{e.tags}</span>;

        return (
          <div className="event-item" key={i}>
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
      name: event.displayName,
      coord: event.locationParsed,
      locationName: event.locationName,
    }));

    let MapPortal = null;
    if (this.props.mapPortal) {
      MapPortal = this.props.mapPortal;
    }

    return (
      <div className="EventList">
        <h2 className="event-title">Arrangementer</h2>
        <div className="event-list">
          {events}
        </div>
        <MapPortal
          hasLoaded={this.mapHasLoadedHandler}
          selectedEvent={this.state.selectedEvent}
          markers={markers}
        />
      </div>
    );
  }
}
