import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {applicationDetailsQueryResponse} from 'applicationDetailsQuery.graphql';
import {NextRouter} from 'next/router';
import IncentiveCalculatorContainer from '../containers/Incentives/IncentiveCalculatorContainer';
import ApplicationStatusContainer from '../containers/Applications/ApplicationStatusContainer';
import DefaultLayout from '../layouts/default-layout';

interface Props {
  query: applicationDetailsQueryResponse['query'];
  router: NextRouter;
}

// TODO: decide what to show in this page
class ApplicationDetails extends Component<Props> {
  static query = graphql`
    query applicationDetailsQuery(
      $applicationStatusCondition: ApplicationStatusCondition
      $bcghgidInput: BigFloat
      $reportingYear: String
    ) {
      query {
        session {
          ...Header_session
        }
        ...ApplicationStatusContainer_query
          @arguments(condition: $applicationStatusCondition)
        ...IncentiveCalculatorContainer_query
          @arguments(bcghgidInput: $bcghgidInput, reportingYear: $reportingYear)
      }
    }
  `;

  static getInitialProps() {
    return {
      variables: {
        condition: {
          rowId: null
        }
      }
    };
  }

  render() {
    const {query} = this.props;
    const {session} = query || {};
    return (
      <DefaultLayout session={session}>
        <ApplicationStatusContainer
          query={query}
          applicationId={this.props.router.query.applicationId}
        />
        <hr />
        <IncentiveCalculatorContainer
          query={query}
          bcghgid={this.props.router.query.bcghgid}
          reportingYear={this.props.router.query.reportingYear}
        />
      </DefaultLayout>
    );
  }
}

export default ApplicationDetails;