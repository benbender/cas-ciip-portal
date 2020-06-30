import React, {useRef, useState, SyntheticEvent} from 'react';
import {Button, Row, Col, Card, Form} from 'react-bootstrap';
import {createFragmentContainer, graphql, RelayProp} from 'react-relay';
import SubmitApplication from 'components/SubmitApplication';
import {ApplicationWizardConfirmation_query} from 'ApplicationWizardConfirmation_query.graphql';
import {ApplicationWizardConfirmation_application} from 'ApplicationWizardConfirmation_application.graphql';
import createCertificationUrlMutation from 'mutations/form/createCertificationUrl';
import updateCertificationUrlMutation from 'mutations/form/updateCertificationUrlMutation';
import ApplicationDetailsContainer from './ApplicationDetailsContainer';
/*
 * The ApplicationWizardConfirmation renders a summary of the data submitted in the application,
 * and allows the user to submit their application.
 */

interface Props {
  query: ApplicationWizardConfirmation_query;
  application: ApplicationWizardConfirmation_application;
  relay: RelayProp;
}

interface Target extends EventTarget {
  email: {
    value: string;
  };
  sendEmailChecked: {
    checked: boolean;
  };
}

export const ApplicationWizardConfirmationComponent: React.FunctionComponent<Props> = (
  props
) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [url, setUrl] = useState<string>();
  const [isChecked, toggleChecked] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const copyArea = useRef(null);
  const revision = props.application.latestDraftRevision;

  const copyToClipboard = () => {
    copyArea.current.select();
    // TODO(Dylan): execCommand copy is deprecated. Look into a replacement
    const success = document.execCommand('copy');
    if (success) return setCopySuccess('Copied!');
    throw new Error('document.execCommand(`copy`) failed');
  };

  const handleClickGenerateCertificationUrl = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.persist();
    const email = (e.target as Target).email.value;
    const sendEmail = (e.target as Target).sendEmailChecked.checked;
    const {environment} = props.relay;
    const variables = {
      input: {
        certificationUrl: {
          /**  The rowId in ggircs_portal.certification_url is the primary key (thus required in the relay variables)
               but the actual rowId is generated on the postgres level with a trigger, so a placeholder rowId is set here */
          rowId: 'placeholder',
          applicationId: props.application.rowId,
          versionNumber: revision.versionNumber
        }
      }
    };
    const response = await createCertificationUrlMutation(
      environment,
      variables
    );

    console.log(response);
    try {
      const certifierUrl = `${window.location.protocol}//${
        window.location.host
      }/certifier/certification-redirect?rowId=${encodeURIComponent(
        response.createCertificationUrl.certificationUrl.rowId
      )}&id=${encodeURIComponent(props.application.id)}`;
      setUrl(certifierUrl);
      const updateVariables = {
        input: {
          id: response.createCertificationUrl.certificationUrl.id,
          certificationUrlPatch: {
            certifierUrl,
            certifierEmail: email,
            sendCertificationRequest: sendEmail
          }
        }
      };
      const updateResponse = await updateCertificationUrlMutation(
        environment,
        updateVariables
      );
      console.log(updateResponse);
    } catch (error) {
      throw new Error(error);
    }
  };

  const generateCertification = (
    <>
      <br />
      <Card>
        <Card.Header>Application Certification</Card.Header>
        <Card.Body>
          <Card.Text>
            Thank you for reviewing your application to the CleanBC Industrial
            Incentive Program.
          </Card.Text>
          <Card.Text>
            Your application is almost complete.
            <ul>
              <li>
                Please send the secure URL below to a Certifying Official in
                your organisation to approve the application. You will be
                notified via email when this step is complete.
              </li>
              <li>
                Once you have received notification that the application has
                been certified, you will need to return here to submit the
                application.
              </li>
              <li>
                Once submitted, you will be notified via email when your
                application has been approved or if any further information is
                required to process your application.
              </li>
            </ul>
          </Card.Text>
          <Card.Text>
            Once you have reviewed the application and ensured all the data is
            correct, the application has to be certified.
          </Card.Text>
          <Form onSubmit={handleClickGenerateCertificationUrl}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="certifierEmail">
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Certifier Email"
                />
              </Form.Group>
            </Form.Row>
            <Form.Group>
              <Form.Check
                checked={isChecked}
                className="text-muted"
                name="sendEmailChecked"
                type="checkbox"
                label="Notify certifier via email that this application is ready for certification"
                onChange={() => toggleChecked(!isChecked)}
              />
            </Form.Group>
            <Button variant="info" type="submit">
              Submit for Certification
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer />
      </Card>
    </>
  );

  let certificationMessage: JSX.Element;

  const copyUrl = (
    <Row>
      <Col md={6}>
        <input
          ref={copyArea}
          readOnly
          value={revision?.certificationUrl?.certifierUrl ?? url}
          style={{width: '100%'}}
        />
      </Col>
      <Col md={2}>
        <Button onClick={copyToClipboard}>Copy Link</Button>
        <span style={{color: 'green'}}>{copySuccess}</span>
      </Col>
    </Row>
  );

  if (!revision.certificationUrl) {
    certificationMessage = url ? (
      <>
        <span style={{color: 'green'}}>{copySuccess}</span> {copyUrl}
      </>
    ) : (
      generateCertification
    );
  } else if (
    !revision.certificationUrl.certificationSignature &&
    revision.certificationUrl.hashMatches
  ) {
    certificationMessage = (
      <>
        <h5>
          Your application has been sent to a certifier. Submission will be
          possible once they have verified the data in the application.
        </h5>
        {copyUrl}
      </>
    );
  } else {
    certificationMessage = (
      <>
        <Card className="text-center">
          <Card.Header>Error</Card.Header>
          <Card.Body>
            <Card.Title>The data has changed</Card.Title>
            <Card.Text>
              The application data has been changed since the certifier added
              their signature.
            </Card.Text>
            <Card.Text>
              Please generate and send a new certification URL.
            </Card.Text>
          </Card.Body>
          <Card.Footer />
        </Card>
        {url ? (
          <>
            <span style={{color: 'green'}}>URL sent!</span>
            {copyUrl}
          </>
        ) : (
          generateCertification
        )}
      </>
    );
  }

  return (
    <>
      <h1>Summary of your application:</h1>
      <h5>
        Please review the information you have provided before continuing.
      </h5>
      <br />

      <ApplicationDetailsContainer
        liveValidate
        query={props.query}
        application={props.application}
        review={false}
        setHasErrors={setHasErrors}
      />
      <br />
      {hasErrors ? (
        <div className="errors">
          Your Application contains errors that must be fixed before submission.
        </div>
      ) : revision.certificationSignatureIsValid ? (
        <>
          <Card>
            <Card.Header>
              <h5>Before you submit</h5>
            </Card.Header>
            <Card.Body>
              By submitting the application the applicant agrees that the
              information contained on this application, or information
              contained in emission reports under the Greenhouse Gas Industrial
              Reporting and Control Act, may be disclosed to British Columbia
              government employees, contractors and agencies for the purpose of
              administering the CleanBC Program for Industry or the Greenhouse
              Gas Industrial Reporting and Control Act.
            </Card.Body>
          </Card>
          <br />
          <SubmitApplication application={props.application} />
        </>
      ) : (
        certificationMessage
      )}
      <style jsx global>
        {`
          .errors {
            margin-left: 20px;
            padding: 20px;
            background: #ce5c5c;
            color: white;
            font-size: 20px;
          }
        `}
      </style>
    </>
  );
};

export default createFragmentContainer(ApplicationWizardConfirmationComponent, {
  application: graphql`
    fragment ApplicationWizardConfirmation_application on Application
      @argumentDefinitions(version: {type: "String!"}) {
      id
      rowId
      ...SubmitApplication_application
      ...ApplicationDetailsContainer_application @arguments(version: $version)
      latestDraftRevision {
        versionNumber
        certificationSignatureIsValid
        certificationUrl {
          id
          certificationSignature
          hashMatches
          certifierUrl
        }
      }
    }
  `,
  query: graphql`
    fragment ApplicationWizardConfirmation_query on Query {
      ...ApplicationDetailsContainer_query
        @arguments(
          applicationId: $applicationId
          oldVersion: $version
          newVersion: $version
        )
    }
  `
});
