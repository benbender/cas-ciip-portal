import React from 'react';
import {Button} from 'react-bootstrap';
import {graphql, createFragmentContainer, RelayProp} from 'react-relay';
import Link from 'next/link';
import createApplicationMutation from 'mutations/application/createApplicationMutation';
import {useRouter} from 'next/router';
import {ApplyButton_applyButtonDetails} from 'ApplyButton_applyButtonDetails.graphql';
interface Props {
  relay: RelayProp;
  applyButtonDetails: ApplyButton_applyButtonDetails;
}
const ApplyButton: React.FunctionComponent<Props> = props => {
  const {applyButtonDetails} = props;
  const {facilityByFacilityId} = applyButtonDetails;
  const {hasSwrsReport} = facilityByFacilityId;
  const {rowId} = facilityByFacilityId;
  const {environment} = props.relay;
  const {applicationId} = applyButtonDetails;
  const {applicationStatus} = applyButtonDetails;
  const router = useRouter();

  const startApplication = async () => {
    const variables = {
      input: {
        facilityIdInput: rowId
      }
    };
    const response = await createApplicationMutation(environment, variables);
    console.log(response);
    router.push({
      pathname: hasSwrsReport
        ? '/ciip-application-swrs-import'
        : '/ciip-application',
      query: {
        applicationId: response.createApplicationMutationChain.application.id
      }
    });
  };

  if (!applicationId) {
    return (
      <Button variant="primary" onClick={startApplication}>
        Apply for CIIP for this facility
      </Button>
    );
  }

  if (applicationId && applicationStatus === 'DRAFT') {
    return (
      <Link
        href={{
          pathname: '/ciip-application',
          query: {
            applicationId
          }
        }}
      >
        <Button variant="primary">Resume CIIP application</Button>
      </Link>
    );
  }

  if (applicationId && applicationStatus === 'PENDING') {
    return (
      <Link
        href={{
          pathname: '/view-application',
          query: {
            applicationId
          }
        }}
      >
        <Button variant="primary">View Submitted Application</Button>
      </Link>
    );
  }

  return null;
};

export default createFragmentContainer(ApplyButton, {
  applyButtonDetails: graphql`
    fragment ApplyButton_applyButtonDetails on FacilitySearchResult {
      applicationId
      applicationStatus
      facilityByFacilityId {
        rowId
        hasSwrsReport(reportingYear: "2018")
      }
    }
  `
});
