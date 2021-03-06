import React from 'react';
import {Badge} from 'react-bootstrap';
import {graphql, createFragmentContainer} from 'react-relay';
import {
  CiipApplicationRevisionStatus,
  FacilitiesRowItemContainer_facilitySearchResult
} from 'FacilitiesRowItemContainer_facilitySearchResult.graphql';
import {FacilitiesRowItemContainer_query} from 'FacilitiesRowItemContainer_query.graphql';
import ApplyButtonContainer from 'containers/Applications/ApplyButtonContainer';

interface Props {
  facilitySearchResult: FacilitiesRowItemContainer_facilitySearchResult;
  reportingYear: number;
  query: FacilitiesRowItemContainer_query;
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
export const FacilitiesRowItemComponent: React.FunctionComponent<Props> = ({
  facilitySearchResult,
  query,
  reportingYear
}) => {
  const {applicationRevisionStatus} = facilitySearchResult;
  const hasCertificationUrl = Boolean(
    facilitySearchResult?.applicationByApplicationId?.latestDraftRevision
      ?.certificationUrl
  );
  const isCertified = Boolean(
    facilitySearchResult?.applicationByApplicationId?.latestDraftRevision
      ?.certificationUrl?.certifiedBy
  );

  let certificationStatus = null;

  if (applicationRevisionStatus === 'DRAFT' && isCertified)
    certificationStatus = ' (Certified)';
  else if (applicationRevisionStatus === 'DRAFT' && hasCertificationUrl)
    certificationStatus = ' (Pending Certification)';

  return (
    <tr>
      <td>{facilitySearchResult.organisationName}</td>
      <td>{facilitySearchResult.facilityName}</td>
      <td>{facilitySearchResult.facilityType}</td>
      <td>{facilitySearchResult.facilityBcghgid}</td>
      <td>{facilitySearchResult.lastSwrsReportingYear}</td>
      <td>
        {' '}
        {applicationRevisionStatus ? (
          <Badge
            pill
            style={{width: '100%'}}
            variant={statusBadgeColor[applicationRevisionStatus]}
          >
            {applicationRevisionStatus}
            {certificationStatus}
          </Badge>
        ) : (
          <>Application not started</>
        )}
      </td>
      <td>
        <ApplyButtonContainer
          applyButtonDetails={facilitySearchResult}
          reportingYear={reportingYear}
          query={query}
        />
      </td>
    </tr>
  );
};

export default createFragmentContainer(FacilitiesRowItemComponent, {
  facilitySearchResult: graphql`
    fragment FacilitiesRowItemContainer_facilitySearchResult on FacilitySearchResult {
      ...ApplyButtonContainer_applyButtonDetails
      facilityName
      facilityType
      facilityBcghgid
      lastSwrsReportingYear
      applicationRevisionStatus
      organisationName
      applicationByApplicationId {
        latestDraftRevision {
          certificationUrl {
            certifiedBy
          }
        }
      }
    }
  `,
  query: graphql`
    fragment FacilitiesRowItemContainer_query on Query {
      ...ApplyButtonContainer_query
    }
  `
});
