import React, {useState} from 'react';
import {Button, Modal, Card} from 'react-bootstrap';
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

const AddOrganisationFacility: React.FunctionComponent<Props> = (props) => {
  const {onAddOrganisation, onAddFacility, organisationRowId} = props;
  const [isModalVisible, setModalVisible] = useState(false);

  const customFormats = {
    'postal-code': /[a-z]\d[a-z]\s?\d[a-z]\d/i,
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
        <Card style={{marginTop: '50px'}}>
          <Card.Body>
            <Card.Title>
              Can&apos;t find the Facility you&apos;re looking for?
            </Card.Title>
            <Card.Text>
              You can add a facility if it is new or hasn&apos;t reported
              before.
            </Card.Text>
            <Button
              variant="outline-primary"
              onClick={() => setModalVisible(!isModalVisible)}
            >
              Add a new Facility
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <span style={{marginTop: '20px'}}>Operator not in the list?</span>
          <br />
          <Button
            variant="success"
            onClick={() => setModalVisible(!isModalVisible)}
          >
            Add Operator +
          </Button>
        </>
      )}
      <Modal
        centered
        size="lg"
        show={isModalVisible}
        onHide={() => setModalVisible(false)}
      >
        {onAddFacility ? (
          <Modal.Header>
            <h5>Add a new Facility</h5>
          </Modal.Header>
        ) : (
          <Modal.Header>
            <h5>Add a new Operator</h5>
          </Modal.Header>
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
            <div>
              <Button
                style={{marginRight: '10px'}}
                type="submit"
                variant="primary"
              >
                Save
              </Button>
              <Button
                variant="danger"
                onClick={() => setModalVisible(!isModalVisible)}
              >
                Close
              </Button>
            </div>
          </JsonSchemaForm>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddOrganisationFacility;
