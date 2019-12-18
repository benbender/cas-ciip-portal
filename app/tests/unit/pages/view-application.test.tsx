import React from 'react';
import {shallow} from 'enzyme';
import ViewApplication from 'pages/view-application';

const query = {
  ' $fragmentRefs': {
    defaultLayout_session: true
  },
  session: null,
  application: {
    applicationRevisionStatus: {
      applicationRevisionStatus: 'SUBMITTED'
    },
    ' $fragmentRefs': {
      ApplicationDetailsContainer_query: true,
      ReviseApplicationButtonContainer_application: true,
      RequestedChangesByFormResult_application: true,
      ApplicationDetailsContainer_application: true
    }
  }
};

// It matches the last accepted Snapshot
it('It matches the last accepted Snapshot', () => {
  const wrapper = shallow(<ViewApplication query={query} />);
  expect(wrapper).toMatchSnapshot();
});

it('It passes a query to the ApplicationDetailsComponent component', () => {
  const wrapper = shallow(<ViewApplication query={query} />);
  expect(
    wrapper
      .find('Relay(ApplicationDetailsComponent)')
      .first()
      .prop('query')
  ).toBe(query);
});
