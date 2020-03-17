import React from 'react';
import {shallow} from 'enzyme';
import CiipApplication from 'pages/reporter/ciip-application';

const query = {
  session: {
    ' $fragmentRefs': {
      defaultLayout_session: true
    }
  },
  ' $fragmentRefs': {
    applicationWizard_query: true
  },
  application: {
    id: 1,
    latestDraftRevision: {
      versionNumber: 1,
      legalDisclaimerAccepted: true
    }
  },
  allFormJsons: {
    edges: [{node: {id: 'form-1'}}]
  }
};

// It matches the last accepted Snapshot
it('It matches the last accepted Snapshot', () => {
  const wrapper = shallow(<CiipApplication query={query} />);
  expect(wrapper).toMatchSnapshot();
});

it('It passes a query to the ApplicationWizard component', () => {
  const wrapper = shallow(<CiipApplication query={query} />);
  expect(wrapper.find('Relay(ApplicationWizard)').prop('query')).toBe(query);
});
