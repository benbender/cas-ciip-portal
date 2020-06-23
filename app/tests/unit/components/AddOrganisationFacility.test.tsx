import React from 'react';
import {mount} from 'enzyme';
import AddOrganisationFacility from 'components/AddOrganisationFacility';

describe('AddOrganisationFacility Component', () => {
  it('should match the last snapshot', () => {
    const render = mount(
      <AddOrganisationFacility onAddOrganisation={jest.fn()} />
    );
    expect(render).toMatchSnapshot();
  });

  it("should render the 'Click here to add a new Operator.' Link when passed the onAddOrganisation prop", () => {
    const render = mount(
      <AddOrganisationFacility onAddOrganisation={jest.fn()} />
    );
    expect(render.find('Button').text()).toBe('Add Operator +');
  });

  it('should render the Add Facility Button when passed the onAddFacility prop', () => {
    const render = mount(<AddOrganisationFacility onAddFacility={jest.fn()} />);
    expect(render.find('Button').text()).toBe('Add a new Facility');
  });

  it('should open the modal when Add Facility Button is clicked', () => {
    const render = mount(<AddOrganisationFacility onAddFacility={jest.fn()} />);
    render.find('Button').simulate('click');
    expect(render.find('Modal').exists()).toBe(true);
  });
});
