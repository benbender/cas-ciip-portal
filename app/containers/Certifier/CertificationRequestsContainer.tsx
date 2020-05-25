import React, {useEffect, useState} from 'react';
import {Button, Alert} from 'react-bootstrap';
import moment from 'moment-timezone';
import Link from 'next/link';
import {graphql, createRefetchContainer, RelayRefetchProp} from 'react-relay';
import SearchTableLayout from 'components/SearchTableLayout';
import PaginationBar from 'components/PaginationBar';
import {CertificationRequestsContainer_query} from '__generated__/CertificationRequestsContainer_query.graphql';

const TIME_ZONE = 'America/Vancouver';

function formatListViewDate(date) {
  return date ? moment.tz(date, TIME_ZONE).format('MMM D, YYYY') : '';
}

interface Props {
  direction: string;
  orderByField: string;
  searchField: string[];
  searchValue: string[];
  offsetValue: number;
  handleEvent: (...args: any[]) => void;
  relay: RelayRefetchProp;
  query: CertificationRequestsContainer_query;
}

export const CertificationRequestsComponent: React.FunctionComponent<Props> = ({
  direction,
  orderByField,
  searchField,
  searchValue,
  handleEvent,
  relay,
  query
}) => {
  const [offsetValue, setOffset] = useState(0);
  const [activePage, setActivePage] = useState(1);
  useEffect(() => {
    const refetchVariables = {
      searchField,
      searchValue,
      orderByField,
      direction,
      offsetValue
    };
    relay.refetch(refetchVariables);
  });

  const displayNameToColumnNameMap = {
    Facility: 'facility_name',
    Organisation: 'operator_name',
    Status: 'application_revision_status',
    'Certified By': 'certified_by',
    'Date Certified': 'certified_at',
    '': null
  };

  const body = (
    <tbody>
      {query.searchCertificationRequests.edges.map(({node}) => {
        const status = node.applicationRevisionStatus;

        const facility = node.facilityName;

        const organisation = node.operatorName;

        const certifierName =
          node.certifiedByFirstName || node.certifiedByLastName
            ? `${node.certifiedByFirstName} ${node.certifiedByLastName}`
            : '';

        const {applicationId} = node;
        const {versionNumber} = node;

        return (
          <tr key={node.rowId}>
            <td>{facility}</td>
            <td>{organisation}</td>
            <td>{status}</td>
            <td>{certifierName}</td>
            <td>{formatListViewDate(node.certifiedAt)}</td>
            <td>
              <Link
                href={`/certifier/certify?applicationId=${applicationId}&version=${versionNumber}`}
              >
                <Button className="w-100">View</Button>
              </Link>
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  const maxPages = Math.ceil(
    query?.searchCertificationRequests?.edges[0]?.node?.totalRequestCount / 20
  );

  return query.searchCertificationRequests.edges.length === 0 ? (
    <Alert variant="info">You have no current certification requests.</Alert>
  ) : (
    <>
      <SearchTableLayout
        body={body}
        displayNameToColumnNameMap={displayNameToColumnNameMap}
        handleEvent={handleEvent}
      />
      {maxPages > 1 && (
        <PaginationBar
          setOffset={setOffset}
          setActivePage={setActivePage}
          offsetValue={offsetValue}
          maxPages={maxPages}
          activePage={activePage}
        />
      )}
    </>
  );
};

export default createRefetchContainer(
  CertificationRequestsComponent,
  {
    query: graphql`
      fragment CertificationRequestsContainer_query on Query
        @argumentDefinitions(
          searchField: {type: "[String]"}
          searchValue: {type: "[String]"}
          orderByField: {type: "String"}
          direction: {type: "String"}
          offsetValue: {type: "Int"}
        ) {
        searchCertificationRequests(
          searchField: $searchField
          searchValue: $searchValue
          orderByField: $orderByField
          direction: $direction
          offsetValue: $offsetValue
        ) {
          edges {
            node {
              rowId
              applicationId
              versionNumber
              certifiedAt
              certifierEmail
              facilityName
              operatorName
              applicationRevisionStatus
              certifiedByFirstName
              certifiedByLastName
              totalRequestCount
            }
          }
        }
      }
    `
  },
  graphql`
    query CertificationRequestsContainerRefetchQuery(
      $searchField: [String]
      $searchValue: [String]
      $orderByField: String
      $direction: String
      $offsetValue: Int
    ) {
      query {
        ...CertificationRequestsContainer_query
          @arguments(
            orderByField: $orderByField
            direction: $direction
            searchField: $searchField
            searchValue: $searchValue
            offsetValue: $offsetValue
          )
      }
    }
  `
);
