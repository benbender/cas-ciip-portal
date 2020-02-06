import getConfig from 'next/config';
import React, {useEffect, useState} from 'react';
import {Dropdown, Form, Row, Col} from 'react-bootstrap';
import DropdownMenuItemComponent from 'components/DropdownMenuItemComponent';
import {createRefetchContainer, graphql, RelayRefetchProp} from 'react-relay';
import {ApplicationDetailsContainer_query} from 'ApplicationDetailsContainer_query.graphql';
import {ApplicationDetailsContainer_application} from 'ApplicationDetailsContainer_application.graphql';
import ApplicationDetailsPdf from 'containers/Applications/ApplicationDetailsPdf';
import ApplicationDetailsCardItem from './ApplicationDetailsCardItem';

/*
 * The ApplicationDetails renders a summary of the data submitted in the application,
 * and allows the user to submit their application.
 */

interface Props {
  query: ApplicationDetailsContainer_query;
  application: ApplicationDetailsContainer_application;
  relay: RelayRefetchProp;
  review: boolean;
}

export const ApplicationDetailsComponent: React.FunctionComponent<Props> = props => {
  const formResults = props.application.orderedFormResults.edges;
  const diffFromResults = props.review
    ? props?.query?.old?.orderedFormResults?.edges
    : undefined;

  const [oldDiffVersion, setOldDiffVersion] = useState(
    (
      props.application.orderedFormResults.edges[0].node.versionNumber - 1
    ).toString()
  );
  const [newDiffVersion, setNewDiffVersion] = useState(
    props.application.orderedFormResults.edges[0].node.versionNumber.toString()
  );
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    const refetchVariables = {
      oldVersion: oldDiffVersion,
      newVersion: newDiffVersion,
      applicationId: props.application.id
    };
    props.relay.refetch(refetchVariables);
  }, [oldDiffVersion, newDiffVersion, props.application.id, props.relay]);

  return (
    <>
      <Row>
        <Col md={{offset: 2, span: 2}}>
          {diffFromResults ? (
            <Form.Check
              label="Show Diff?"
              checked={showDiff}
              type="checkbox"
              onChange={() => setShowDiff(!showDiff)}
            />
          ) : null}
        </Col>
        {showDiff ? (
          <>
            <Col md={2}>
              <Dropdown style={{width: '100%', textTransform: 'capitalize'}}>
                <Dropdown.Toggle
                  style={{width: '100%', textTransform: 'capitalize'}}
                  id="dropdown-old"
                >
                  {oldDiffVersion === '0'
                    ? 'swrs import'
                    : 'Version '.concat(oldDiffVersion)}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{width: '100%'}}>
                  {props.application.applicationRevisionsByApplicationId.edges.map(
                    ({node}, index) =>
                      index >= Number(newDiffVersion) ||
                      index === Number(oldDiffVersion) ? null : (
                        <DropdownMenuItemComponent
                          key={node.id}
                          itemEventKey={node.versionNumber}
                          itemFunc={setOldDiffVersion}
                          itemTitle={
                            node.versionNumber === 0
                              ? 'swrs import'
                              : node.versionNumber
                          }
                        />
                      )
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={1}>&nbsp;------&gt;</Col>
            <Col md={2}>
              <Dropdown style={{width: '100%', textTransform: 'capitalize'}}>
                <Dropdown.Toggle
                  style={{width: '100%', textTransform: 'capitalize'}}
                  id="dropdown-new"
                >
                  {Number(newDiffVersion) ===
                  props.application.latestSubmittedRevision.versionNumber
                    ? `current (V${newDiffVersion})`
                    : 'Version '.concat(newDiffVersion)}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{width: '100%'}}>
                  {props.application.applicationRevisionsByApplicationId.edges.map(
                    ({node}, index) =>
                      index <= Number(oldDiffVersion) ? null : (
                        <DropdownMenuItemComponent
                          key={node.id}
                          itemEventKey={node.versionNumber}
                          itemFunc={setNewDiffVersion}
                          itemTitle={
                            node.versionNumber ===
                            props.application.latestSubmittedRevision
                              .versionNumber
                              ? `current (V${node.versionNumber})`
                              : node.versionNumber
                          }
                        />
                      )
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </>
        ) : null}
      </Row>
      <br />

      <div>
        {formResults.map(({node}) => (
          <ApplicationDetailsCardItem
            key={node.id}
            diffFromResults={diffFromResults}
            diffToResults={props.query.new.orderedFormResults.edges}
            formResult={node}
            query={props.query.query}
            review={props.review}
            showDiff={showDiff}
          />
        ))}
        <div style={{textAlign: 'right', marginTop: 20}}>
          {process.env.NO_PDF ||
          getConfig()?.publicRuntimeConfig.NO_PDF ? null : (
            <ApplicationDetailsPdf
              application={props.application}
              query={props.query}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default createRefetchContainer(
  ApplicationDetailsComponent,
  {
    query: graphql`
      fragment ApplicationDetailsContainer_query on Query
        @argumentDefinitions(
          applicationId: {type: "ID!"}
          newVersion: {type: "String"}
          oldVersion: {type: "String"}
        ) {
        query {
          ...ApplicationDetailsCardItem_query
        }
        old: application(id: $applicationId) {
          orderedFormResults(versionNumberInput: $oldVersion) {
            edges {
              node {
                id
                versionNumber
                formJsonByFormId {
                  slug
                }
                formResult
              }
            }
          }
        }
        new: application(id: $applicationId) {
          orderedFormResults(versionNumberInput: $newVersion) {
            edges {
              node {
                id
                versionNumber
                formJsonByFormId {
                  slug
                }
                formResult
              }
            }
          }
        }
        ...ApplicationDetailsPdf_query
      }
    `,
    application: graphql`
      fragment ApplicationDetailsContainer_application on Application
        @argumentDefinitions(version: {type: "String!"}) {
        id
        orderedFormResults(versionNumberInput: $version) {
          edges {
            node {
              id
              versionNumber
              ...ApplicationDetailsCardItem_formResult
            }
          }
        }
        latestSubmittedRevision {
          versionNumber
        }
        applicationRevisionsByApplicationId {
          totalCount
          edges {
            node {
              id
              versionNumber
            }
          }
        }
        ...ApplicationDetailsPdf_application
      }
    `
  },
  graphql`
    query ApplicationDetailsContainerRefetchQuery(
      $oldVersion: String
      $newVersion: String
      $applicationId: ID!
    ) {
      query {
        ...ApplicationDetailsContainer_query
          @arguments(
            oldVersion: $oldVersion
            newVersion: $newVersion
            applicationId: $applicationId
          )
      }
    }
  `
);
