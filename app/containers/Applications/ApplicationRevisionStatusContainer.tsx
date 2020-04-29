import React from 'react';
import {Row, Col, Dropdown, Button} from 'react-bootstrap';
import {graphql, createFragmentContainer, RelayProp} from 'react-relay';
import DropdownMenuItemComponent from 'components/DropdownMenuItemComponent';
import createApplicationRevisionStatusMutation from 'mutations/application/createApplicationRevisionStatusMutation';
import {CiipApplicationRevisionStatus} from 'ApplicationRowItemContainer_applicationSearchResult.graphql';

interface Props {
  applicationRevisionStatus;
  applicationRowId;
  relay: RelayProp;
}

const statusBadgeColor: Record<
  CiipApplicationRevisionStatus,
  'info' | 'danger' | 'success' | 'warning' | 'primary' | 'secondary'
> = {
  DRAFT: 'warning',
  SUBMITTED: 'info',
  REJECTED: 'danger',
  APPROVED: 'success',
  REQUESTED_CHANGES: 'secondary'
};

export const ApplicationRevisionStatusComponent: React.FunctionComponent<Props> = (
  props
) => {
  // Save Application status to database
  const setApplicationRevisionStatus = async (eventKey, event) => {
    event.preventDefault();
    event.stopPropagation();
    event.persist();

    const variables = {
      input: {
        applicationRevisionStatus: {
          applicationId: props.applicationRowId,
          applicationRevisionStatus: eventKey,
          versionNumber: props.applicationRevisionStatus.versionNumber
        }
      },
      version: props.applicationRevisionStatus.versionNumber.toString()
    };
    const response = await createApplicationRevisionStatusMutation(
      props.relay.environment,
      variables
    );
    console.log(response);
  };

  const {
    isCurrentVersion
  } = props.applicationRevisionStatus.applicationRevisionByApplicationIdAndVersionNumber;

  return (
    <Row>
      <Col md={3}>
        <h3>Application Status: </h3>
      </Col>

      {isCurrentVersion ? (
        <Col md={2}>
          <Dropdown style={{width: '100%'}}>
            <Dropdown.Toggle
              style={{width: '100%', textTransform: 'capitalize'}}
              variant={
                statusBadgeColor[
                  props.applicationRevisionStatus.applicationRevisionStatus
                ]
              }
              id="dropdown"
            >
              {props.applicationRevisionStatus.applicationRevisionStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width: '100%'}}>
              {Object.keys(statusBadgeColor).map((status) => (
                <DropdownMenuItemComponent
                  key={status}
                  itemEventKey={status}
                  itemFunc={setApplicationRevisionStatus}
                  itemTitle={status}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      ) : (
        <Col md={2}>
          <Button
            disabled
            variant={
              statusBadgeColor[
                props.applicationRevisionStatus.applicationRevisionStatus
              ]
            }
          >
            {props.applicationRevisionStatus.applicationRevisionStatus}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default createFragmentContainer(ApplicationRevisionStatusComponent, {
  applicationRevisionStatus: graphql`
    fragment ApplicationRevisionStatusContainer_applicationRevisionStatus on ApplicationRevisionStatus {
      applicationRevisionStatus
      versionNumber
      applicationRevisionByApplicationIdAndVersionNumber {
        isCurrentVersion
      }
    }
  `
});
