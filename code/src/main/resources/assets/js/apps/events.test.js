import test from 'ava';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import EventList from './components/EventList';

Enzyme.configure({ adapter: new Adapter() });

const events = [
  {
    'displayName': 'xxxx',
    'dataAsJson': '{"caption":"xxx","body":"<p>yyy</p>"}',
    '_path': '/site/events/xxxx',
    'publish': {},
  },
  {
    'displayName': 'yyyy',
    'dataAsJson': '{"caption":"xxxx","body":"<p>xxxx</p>"}',
    '_path': '/site/events/yyyy',
    'publish': {
      'from': '2018-05-09T12:45:57.352Z',
      'first': '2018-05-09T12:45:57.352Z',
    },
  },
  {
    'displayName': 'zzzz',
    'dataAsJson': '{"tags":["xyxy","2019"],"caption":"xx","body":"<p>xx</p>"}',
    '_path': '/site/events/zzzz',
    'publish': {},
  },
  {
    'displayName': 'zzzzzz',
    'dataAsJson': '{"tags":["xyxy","2018"],"caption":"xx","body":"<p>xx</p>"}',
    '_path': '/site/events/zzzzzz',
    'publish': {
      'from': '2018-05-09T22:00:00Z',
      'to': '2018-08-10T22:00:00Z',
      'first': '2018-05-09T22:00:00Z',
    },
  },
]

test('has a .EventList class name', t => {
  const wrapper = shallow(<EventList />);
  t.true(wrapper.hasClass('EventList'));
});

test('has only published events listed', t => {
  const wrapper = shallow(
    <EventList events={events} today={new Date(2018, 5, 10)} />
  );
  t.is(wrapper.instance().getEvents().length, 2);
});

test('does not display outgoing events', t => {
  const wrapper = shallow(
    <EventList events={events} today={new Date(2019, 5, 10)} />
  );
  t.is(wrapper.instance().getEvents().length, 1);
});

test('parsing JSON data correctly', t => {
  const wrapper = shallow(
    <EventList events={events} today={new Date(2018, 5, 10)} />
  );
  t.deepEqual(wrapper.instance().getEvents()[1].tags, ['xyxy', '2018']);
});


test('has correct URL path', t => {
  const wrapper = shallow(
    <EventList events={events} today={new Date(2018, 5, 10)} />
  );
  t.deepEqual(wrapper.instance().getEvents()[1].path, '/site/events/zzzzzz');
});
