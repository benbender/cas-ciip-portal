import React from 'react';
import {shallow} from 'enzyme';
import {ApplicationOverrideJustificationComponent} from 'components/Application/ApplicationOverrideJustification';

describe('OverrideJustification', () => {
  it('Should allow the user to save a justification if one is not currently active', async () => {
    const r = shallow(
      <ApplicationOverrideJustificationComponent
        overrideActive={false}
        setOverrideActive={jest.fn()}
        applicationOverrideJustification={null}
        revisionId="abc"
        relay={null}
      />
    );
    expect(r).toMatchSnapshot();
    expect(r.find('AccordionCollapse').find('Button').text()).toBe('Save');
  });

  it('Should allow the user to edit a justification if one is currently active', async () => {
    const r = shallow(
      <ApplicationOverrideJustificationComponent
        overrideActive
        setOverrideActive={jest.fn()}
        applicationOverrideJustification="bad stuff"
        revisionId="abc"
        relay={null}
      />
    );
    expect(r).toMatchSnapshot();
    expect(r.find('Alert').find('Button').at(0).text()).toBe(
      'Edit Justification'
    );
  });

  it('Should allow the user to delete a justification if one is currently active', async () => {
    const r = shallow(
      <ApplicationOverrideJustificationComponent
        overrideActive
        setOverrideActive={jest.fn()}
        applicationOverrideJustification="bad stuff"
        revisionId="abc"
        relay={null}
      />
    );
    expect(r.find('Alert').find('Button').at(1).text()).toBe('Delete Override');
  });
});
