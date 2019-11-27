import React from 'react';
import {shallow} from 'enzyme';
import UserProfile from 'pages/user-profile';
const query = {
  user: {
    id: 'WyJ1c2VycyIsMV0='
  }
};
describe('user profile', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<UserProfile query={query} />);
    expect(wrapper).toMatchSnapshot();
  });
});