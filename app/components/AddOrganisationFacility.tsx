import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import JsonSchemaForm, {IChangeEvent} from 'react-jsonschema-form';
import FormFieldTemplate from 'containers/Forms/FormFieldTemplate';
import FormObjectFieldTemplate from 'containers/Forms/FormObjectFieldTemplate';
import addOperatorSchema from 'components/organisation/addOrganisationSchema';
import addFacilitySchema from 'components/facility/addFacilitySchema';

interface Props {
  onAddOrganisation?: (...args: any[]) => void;
  onAddFacility?: (...args: any[]) => void;
  organisationRowId?: number;
}

const AddOrganisationFacility: React.FunctionComponent<Props> = props => {
  const {onAddOrganisation, onAddFacility, organisationRowId} = props;
  const [isModalVisible, setModalVisible] = useState(false);

  const customFormats = {
    'postal-code': /[A-Z]\d[A-Z]\s?\d[A-Z]\d/i,
    duns: /^\d{9}$/
  };

  const saveNewFacility = async (e: IChangeEvent) => {
    const {facilityName, facilityType, bcghgid} = e.formData;
    const variables = {
      input: {
        facility: {
          facilityName,
          facilityType,
          bcghgid,
          organisationId: organisationRowId
        }
      }
    };
    setModalVisible(!isModalVisible);
    onAddFacility(variables);
  };

  const saveNewOrganisation = async (e: IChangeEvent) => {
    const {operatorName, craBusinessNumber} = e.formData;
    const variables = {
      input: {
        organisation: {
          operatorName,
          craBusinessNumber
        }
      }
    };
    setModalVisible(!isModalVisible);
    onAddOrganisation(variables);
  };

  return (
    <>
      {onAddFacility ? (
        <Button onClick={() => setModalVisible(!isModalVisible)}>
          Add Facility +
        </Button>
      ) : (
        <p
          id="add-organisation"
          onClick={() => setModalVisible(!isModalVisible)}
        >
          I can&apos;t find my organisation
          <style jsx>
            {`
              #add-organisation {
                color: blue;
              }
              #add-organisation:hover {
                text-decoration: underline;
                cursor: pointer;
              }
            `}
          </style>
        </p>
      )}
      <Modal
        centered
        size="xl"
        show={isModalVisible}
        onHide={() => setModalVisible(false)}
      >
        {onAddFacility ? (
          <Modal.Header>Add Facility</Modal.Header>
        ) : (
          <Modal.Header>Add Organisation</Modal.Header>
        )}
        <Modal.Body>
          <JsonSchemaForm
            schema={onAddFacility ? addFacilitySchema : addOperatorSchema}
            customFormats={customFormats}
            showErrorList={false}
            FieldTemplate={FormFieldTemplate}
            ObjectFieldTemplate={FormObjectFieldTemplate}
            onSubmit={onAddFacility ? saveNewFacility : saveNewOrganisation}
          >
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button
              variant="danger"
              onClick={() => setModalVisible(!isModalVisible)}
            >
              Close
            </Button>
          </JsonSchemaForm>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddOrganisationFacility;