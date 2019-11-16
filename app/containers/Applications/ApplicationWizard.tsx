import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {graphql, createFragmentContainer} from 'react-relay';
import ApplicationFormNavbar from '../../components/Forms/ApplicationFormNavbar';
import ApplicationWizardStep from './ApplicationWizardStep';

const setRouterQueryParam = (router, key, value, replace = false) => {
  const newUrl = {
    pathname: router.pathname,
    query: {
      ...router.query,
      [key]: value
    }
  };
  if (replace) router.replace(newUrl, newUrl, {shallow: true});
  else router.push(newUrl, newUrl, {shallow: true});
};

/*
 * The ApplicationWizard container retrieves the ordered list of forms to render in the
 * application process. Each ApplicationWizardStep is rendered, and at the end the
 * ApplicationWizardConfirmation is rendered.
 */
const ApplicationWizard = ({query}) => {
  const {application} = query || {};

  const router = useRouter();
  const {formResultId} = router.query;
  const confirmationPage = Boolean(router.query.confirmationPage);
  const orderedFormResults = application.orderedFormResults.edges;
  useEffect(() => {
    if (confirmationPage) return;
    if (!formResultId)
      setRouterQueryParam(
        router,
        'formResultId',
        orderedFormResults[0].node.id,
        true
        // If we're landing on the wizard page
        // We want to trigger a replace instead of a push in that case
      );
  }, [confirmationPage, formResultId, orderedFormResults, router]);
  console.log(orderedFormResults);
  const onStepComplete = () => {
    for (let i = 0; i < orderedFormResults.length; i++) {
      if (orderedFormResults[i].node.id === formResultId) {
        const goToConfirmation = i === orderedFormResults.length - 1;
        const formResultId = goToConfirmation
          ? undefined
          : orderedFormResults[i + 1].node.id;
        setRouterQueryParam(router, 'formResultId', formResultId);
        if (goToConfirmation)
          setRouterQueryParam(router, 'confirmationPage', true);
      }
    }
  };

  if (!application) return <>This is not the application you are looking for</>;

  return (
    <>
      <ApplicationFormNavbar query={query} formResultId={formResultId} />
      <ApplicationWizardStep
        query={query}
        confirmationPage={confirmationPage}
        onStepComplete={onStepComplete}
      />
    </>
  );
};

export default createFragmentContainer(ApplicationWizard, {
  query: graphql`
    fragment ApplicationWizard_query on Query
      @argumentDefinitions(
        formResultId: {type: "ID!"}
        applicationId: {type: "ID!"}
      ) {
      application(id: $applicationId) {
        id
        orderedFormResults {
          edges {
            node {
              id
            }
          }
        }
      }
      ...ApplicationFormNavbar_query
        @arguments(formResultId: $formResultId, applicationId: $applicationId)
      ...ApplicationWizardStep_query
        @arguments(formResultId: $formResultId, applicationId: $applicationId)
    }
  `
});
