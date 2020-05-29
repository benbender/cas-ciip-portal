import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import {certifyQueryResponse} from 'certifyQuery.graphql';
import ApplicationDetailsContainer from 'containers/Applications/ApplicationDetailsContainer';
import ApplicationRecertificationContainer from 'containers/Applications/ApplicationRecertificationContainer';
import CertificationSignature from 'containers/Forms/CertificationSignature';
import DefaultLayout from 'layouts/default-layout';
import {USER} from 'data/group-constants';
import SignatureDisclaimerCard from 'components/SignatureDisclaimerCard';

const ALLOWED_GROUPS = [USER];

interface Props {
  query: certifyQueryResponse['query'];
  router: any;
}

class Certify extends Component<Props> {
  static query = graphql`
    query certifyQuery($applicationId: ID!, $version: String!) {
      query {
        session {
          ...defaultLayout_session
        }
        ...ApplicationDetailsContainer_query
          @arguments(
            applicationId: $applicationId
            oldVersion: $version
            newVersion: $version
          )
        application(id: $applicationId) {
          latestDraftRevision {
            certificationUrl {
              certificationSignature
              hashMatches
              ...ApplicationRecertificationContainer_certificationUrl
            }
          }
          ...CertificationSignature_application
          ...ApplicationDetailsContainer_application
            @arguments(version: $version)
        }
      }
    }
  `;

  render() {
    const {query} = this.props;
    const {
      hashMatches
    } = this.props.query.application.latestDraftRevision.certificationUrl;

    let LegalDisclaimer = null;

    if (
      !query.application.latestDraftRevision?.certificationUrl
        ?.certificationSignature
    ) {
      LegalDisclaimer = (
        <SignatureDisclaimerCard>
          Please review the information below before approving an application.{' '}
          <a href="/resources/disclaimer" target="_blank">
            (<FontAwesomeIcon icon={faExternalLinkAlt} />
            expand)
          </a>
        </SignatureDisclaimerCard>
      );
    }

    return (
      <>
        <DefaultLayout
          title="Submission Certification"
          session={query.session}
          allowedGroups={ALLOWED_GROUPS}
        >
          {hashMatches ? (
            <>
              <ApplicationDetailsContainer
                query={query}
                application={query.application}
                review={false}
                liveValidate={false}
              />
              {LegalDisclaimer}
              <CertificationSignature application={query.application} />
            </>
          ) : (
            <ApplicationRecertificationContainer
              certificationUrl={
                query.application.latestDraftRevision.certificationUrl
              }
            />
          )}
        </DefaultLayout>
        <style jsx global>
          {`
            .signatureCanvas {
              border: 1px solid #bbb;
              padding: 30px;
              width: 80%;
              background: #eee;
              border-radius: 6px;
              margin-bottom: 60px;
            }
          `}
        </style>
      </>
    );
  }
}

export default Certify;
