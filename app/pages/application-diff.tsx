import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {applicationDiffQueryResponse} from 'applicationDiffQuery.graphql';
import DefaultLayout from 'layouts/default-layout';
import {CiipPageComponentProps} from 'next-env';
import diff from 'deep-diff';

interface Props extends CiipPageComponentProps {
  query: applicationDiffQueryResponse['query'];
}

class ApplicationDiff extends Component<Props> {
  static query = graphql`
    query applicationDiffQuery($applicationId: ID!) {
      query {
        session {
          ...defaultLayout_session
        }
        application(id: $applicationId) {
          applicationRevisionsByApplicationId {
            edges {
              node {
                id
                versionNumber
                formResultsByApplicationIdAndVersionNumber {
                  edges {
                    node {
                      formResult
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  render() {
    const {query} = this.props;
    // @ts-ignore
    const {session, application} = query;
    const revisions = application.applicationRevisionsByApplicationId;
    const lhs =
      revisions.edges[0].node.formResultsByApplicationIdAndVersionNumber
        .edges[0].node.formResult;
    const rhs =
      revisions.edges[1].node.formResultsByApplicationIdAndVersionNumber
        .edges[0].node.formResult;
    const differences = diff(lhs, rhs);
    console.log(differences);
    return (
      <DefaultLayout session={session} width="wide">
        <table>
          <thead>
            <tr>
              <th>LHS</th>
              <th />
              <th>RHS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{differences[0].lhs}</td>
              <td> | </td>
              <td>{differences[0].rhs}</td>
            </tr>
          </tbody>
        </table>
      </DefaultLayout>
    );
  }
}

export default ApplicationDiff;
