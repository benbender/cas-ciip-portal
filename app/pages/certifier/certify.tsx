import React, {Component} from 'react';
import {graphql} from 'react-relay';
import {Alert} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import {certifyQueryResponse} from 'certifyQuery.graphql';
import ApplicationDetailsContainer from 'containers/Applications/ApplicationDetailsContainer';
import ApplicationRecertificationContainer from 'containers/Applications/ApplicationRecertificationContainer';
import CertificationSignature from 'containers/Forms/CertificationSignature';
import ApplicationOverrideNotification from 'components/Application/ApplicationOverrideNotificationCard';
import DefaultLayout from 'layouts/default-layout';
import {USER} from 'data/group-constants';
import SignatureDisclaimerCard from 'components/SignatureDisclaimerCard';

const ALLOWED_GROUPS = [USER];

interface Props {
  query: certifyQueryResponse['query'];
  router: any;
}

class Certify extends Component<Props> {
  static allowedGroups = ALLOWED_GROUPS;
  static isAccessProtected = true;
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
            certificationSignatureIsValid
            overrideJustification
            certificationUrl {
              id
              certificationSignature
              hashMatches
              ...ApplicationRecertificationContainer_certificationUrl
            }
          }
          ...ApplicationDetailsContainer_application
            @arguments(version: $version)
        }
      }
    }
  `;

  render() {
    const {query} = this.props;
    const {overrideJustification} = query?.application?.latestDraftRevision;
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
          Please review the information below before approving the application.{' '}
          <a href="/resources/application-disclaimer" target="_blank">
            (<FontAwesomeIcon icon={faExternalLinkAlt} />
            expand)
          </a>
        </SignatureDisclaimerCard>
      );
    }

    return (
      <DefaultLayout title="Submission Certification" session={query.session}>
        {hashMatches ? (
          <>
            <ApplicationOverrideNotification
              overrideJustification={overrideJustification}
            />
            <ApplicationDetailsContainer
              query={query}
              application={query.application}
              review={false}
              liveValidate={false}
            />
            {LegalDisclaimer}
            {query.application.latestDraftRevision
              .certificationSignatureIsValid ? (
              <Alert variant="success">
                <strong>Application has been certified</strong>
              </Alert>
            ) : (
              <CertificationSignature
                certificationIdsToSign={[
                  query.application.latestDraftRevision.certificationUrl.id
                ]}
                submitted={
                  query.application.latestDraftRevision
                    .certificationSignatureIsValid
                }
              />
            )}
          </>
        ) : (
          <ApplicationRecertificationContainer
            certificationUrl={
              query.application.latestDraftRevision.certificationUrl
            }
          />
        )}
      </DefaultLayout>
    );
  }
}

export default Certify;
