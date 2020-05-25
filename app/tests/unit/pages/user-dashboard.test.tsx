import React from 'react';
import {shallow} from 'enzyme';
import UserDashboard from 'pages/reporter/user-dashboard';
import {userDashboardQueryResponse} from 'userDashboardQuery.graphql';

const query = {
  session: {
    ciipUserBySub: {
      id: 'ciip-reporter@mailinator.com',
      rowId: 6,
      hasCertificationRequests: false
    },
    ' $fragmentRefs': {
      defaultLayout_session: true
    }
  },
  ' $fragmentRefs': {
    Organisations_query: true
  }
};

const queryWithCertRequests: userDashboardQueryResponse['query'] = {
  session: {
    ciipUserBySub: {
      id: 'ciip-reporter@mailinator.com',
      rowId: 6,
      hasCertificationRequests: true
    },
    ' $fragmentRefs': {
      defaultLayout_session: true
    }
  },
  ' $fragmentRefs': {
    Organisations_query: true
  }
};

describe('Reporter Dashboard', () => {
  it('Reporter with no certification requests', () => {
    const wrapper = shallow(<UserDashboard router={null} query={query} />);
    expect(wrapper).toMatchSnapshot();
    expect(
      wrapper.find('Relay(OrganisationsComponent)').prop('flagCertRequests')
    ).toBe(false);
  });
  it('Reporter with certification requests', () => {
    const wrapper = shallow(
      <UserDashboard router={null} query={queryWithCertRequests} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(
      wrapper.find('Relay(OrganisationsComponent)').prop('flagCertRequests')
    ).toBe(true);
  });
});
