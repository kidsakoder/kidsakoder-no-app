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

  click(eventName) {
    this.setState(
      Object.assign({}, this.state, {
        selectedEvent: eventName,
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

      return Object.assign({}, JSON.parse(e.dataAsJson), {
        displayName: e.displayName,
        path: e._path,
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
              <button onClick={() => this.click(e.displayName)}>
                Vis på kart
              </button>
            }
          </div>
        );
      });

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
        />
      </div>
    );
  }
}
