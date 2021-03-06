import React from 'react';
import {Button, Badge} from 'react-bootstrap';
import {graphql, createFragmentContainer} from 'react-relay';
import {CiipApplicationRevisionStatus} from 'ApplicationRowItemContainer_applicationSearchResult.graphql';
import Link from 'next/link';
import {dateTimeFormat} from 'functions/formatDates';

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

export const ApplicationRowItem = (props) => {
  const {applicationSearchResult = {}} = props;
  const readableSubmissionDate = dateTimeFormat(
    applicationSearchResult.submissionDate,
    'seconds'
  );

  return (
    <tr>
      <td>{applicationSearchResult.applicationId}</td>
      <td>{applicationSearchResult.operatorName}</td>
      <td>{applicationSearchResult.facilityName}</td>
      <td>{applicationSearchResult.reportingYear}</td>
      <td>{readableSubmissionDate}</td>
      <td>
        <Badge
          pill
          style={{width: '100%'}}
          variant={
            statusBadgeColor[applicationSearchResult.applicationRevisionStatus]
          }
        >
          {applicationSearchResult.applicationRevisionStatus}
        </Badge>
      </td>
      <td>
        <Link
          href={{
            pathname: '/analyst/application-review',
            query: {
              applicationId:
                applicationSearchResult.applicationByApplicationId.id,
              applicationRevisionId:
                applicationSearchResult.applicationByApplicationId
                  .latestSubmittedRevision.id,
              version:
                applicationSearchResult.applicationByApplicationId
                  .latestSubmittedRevision.versionNumber
            }
          }}
        >
          <Button variant="primary">View Application</Button>
        </Link>
      </td>
    </tr>
  );
};

export default createFragmentContainer(ApplicationRowItem, {
  applicationSearchResult: graphql`
    fragment ApplicationRowItemContainer_applicationSearchResult on ApplicationSearchResult {
      rowId
      applicationId
      operatorName
      facilityName
      applicationRevisionStatus
      reportingYear
      bcghgid
      submissionDate
      applicationByApplicationId {
        id
        rowId
        latestSubmittedRevision {
          id
          versionNumber
        }
      }
    }
  `
});
