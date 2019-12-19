import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {applicationReviewQueryResponse} from 'applicationReviewQuery.graphql';
import {Row, Col} from 'react-bootstrap';
import IncentiveCalculatorContainer from 'containers/Incentives/IncentiveCalculatorContainer';
import ApplicationRevisionStatusContainer from 'containers/Applications/ApplicationRevisionStatusContainer';
import DefaultLayout from 'layouts/default-layout';
import ApplicationDetails from 'containers/Applications/ApplicationDetailsContainer';
import ApplicationComments from 'containers/Applications/ApplicationCommentsContainer';
import {CiipPageComponentProps} from 'next-env';

interface Props extends CiipPageComponentProps {
  query: applicationReviewQueryResponse['query'];
}

class ApplicationReview extends Component<Props> {
  static query = graphql`
    query applicationReviewQuery(
      $applicationId: ID!
      $revisionId: ID!
      $version: String!
    ) {
      query {
        session {
          ...defaultLayout_session
        }
        application(id: $applicationId) {
          rowId
          applicationRevisionStatus {
            ...ApplicationRevisionStatusContainer_applicationRevisionStatus
          }
          ...ApplicationDetailsContainer_application
            @arguments(version: $version)
        }
        applicationRevision(id: $revisionId) {
          ...IncentiveCalculatorContainer_applicationRevision
        }
        ...ApplicationDetailsContainer_query
        ...ApplicationCommentsContainer_query
          @arguments(applicationId: $applicationId)
      }
    }
  `;

  render() {
    const {query} = this.props;
    const {session} = query || {};
    return (
      <DefaultLayout session={session} width="wide">
        <ApplicationRevisionStatusContainer
          applicationRevisionStatus={
            query.application.applicationRevisionStatus
          }
          applicationRowId={query.application.rowId}
        />
        <hr />
        <Row className="application-container">
          <Col md={8} className="application-body">
            <ApplicationDetails
              isAnalyst
              query={query}
              application={query.application}
            />
            <IncentiveCalculatorContainer
              applicationRevision={query.applicationRevision}
            />
          </Col>
          <Col md={4} className="application-comments">
            <ApplicationComments query={query} />
          </Col>
        </Row>
        <style jsx>{`
          .container {
            display: none;
          }
        `}</style>
      </DefaultLayout>
    );
  }
}

export default ApplicationReview;

/*
TODO: Instead on conditionally rendering the ApplicationDetail,
 the page component should pass a renderItemHeaderContent function
 */
