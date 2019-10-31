import React, {useState, useEffect} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {useRouter} from 'next/router';
import Form from '../Forms/Form';
import ApplicationWizardConfirmation from './ApplicationWizardConfirmation';

const getInitialAdminData = application => {
  if (!application.swrsOrganisationData) return undefined;
  const {
    operatorName,
    operatorTradeName,
    duns,
    operatorMailingAddress,
    operatorCity,
    operatorProvince,
    operatorPostalCode,
    operatorCountry
  } = application.swrsOrganisationData;
  const {
    facilityName,
    facilityType,
    bcghgid,
    naicsCode,
    latitude,
    longitude,
    facilityMailingAddress,
    facilityCity,
    facilityProvince,
    facilityPostalCode
  } = application.swrsFacilityData;

  const {
    firstName,
    lastName,
    positionTitle,
    email,
    telephone,
    fax,
    contactMailingAddress,
    contactCity,
    contactProvince,
    contactPostalCode
  } = application.swrsOperatorContactData;

  return {
    reportingOperationInformation: [
      {
        operatorName,
        operatorTradeName,
        duns,
        naicsCode,
        mailingAddress: operatorMailingAddress,
        mailingAddressCity: operatorCity,
        mailingAddressProvince: operatorProvince,
        // TODOx: the postal code field in the survey should remove spaces when validating/submitting
        mailingAddressPostalCode: operatorPostalCode.replace(' ', ''),
        mailingAddressCountry: operatorCountry
      }
    ],
    facilityInformation: [
      {
        facilityName,
        facilityType,
        bcghgid,
        naicsCode,
        latitude,
        longitude,
        mailingAddress: facilityMailingAddress,
        mailingAddressCity: facilityCity,
        mailingAddressProvince: facilityProvince,
        mailingAddressPostalCode: facilityPostalCode.replace(' ', '')
      }
    ],
    operationalRepresentativeInformation: [
      {
        firstName,
        lastName,
        position: positionTitle,
        emailAddress: email,
        phone: telephone,
        fax,
        mailingAddress: contactMailingAddress,
        mailingAddressCity: contactCity,
        mailingAddressProvince: contactProvince,
        mailingAddressPostalCode: contactPostalCode.replace(' ', '')
      }
    ]
  };
};

const getInitialEmissionData = application => {
  const initialData = {};
  if (!application.swrsEmissionData) return undefined;
  for (const {
    node: {quantity, emissionCategory, gasType}
  } of application.swrsEmissionData.edges) {
    initialData[emissionCategory] = [
      {
        ...(initialData[emissionCategory] && initialData[emissionCategory][0]),
        [gasType]: [
          {
            annualEmission: quantity
          }
        ]
      }
    ];
  }

  return initialData;
};

const getInitialFuelData = (application, allFuels) => {
  if (!application.swrsFuelData) return undefined;
  return {
    fuels: application.swrsFuelData.edges.map(edge => {
      const {
        fuelType,
        fuelDescription,
        annualFuelAmount,
        alternativeMethodolodyDescription
      } = edge.node;
      const fuelNode = allFuels.edges.find(
        ({node: {name}}) => name === fuelType
      );
      const fuelUnits = fuelNode ? fuelNode.node.units : undefined;
      if (!fuelUnits)
        console.warn(`Could not find fuel with type "${fuelType}"`);
      return {
        fuelType,
        fuelUnits,
        description: fuelDescription,
        quantity: annualFuelAmount,
        methodology: alternativeMethodolodyDescription
      };
    })
  };
};

/*
 * The ApplicationWizardStep renders a form and, where applicable,
 *  TODOx: starts by presenting a summary of existing data to the user
 */
const ApplicationWizardStep = ({query, onStepComplete, confirmationPage}) => {
  const router = useRouter();
  const {application, allFuels, formResult} = query;

  const [initialData, setInitialData] = useState(undefined);

  useEffect(() => {
    if (!formResult) return;
    const {formJsonByFormId} = formResult;
    if (formResult.formResult !== '{}') {
      return setInitialData(JSON.parse(formResult.formResult));
    }

    if (!formJsonByFormId.prepopulateFromSwrs) return setInitialData(undefined);
    switch (formJsonByFormId.name) {
      case 'Admin': {
        setInitialData(getInitialAdminData(application));
        break;
      }

      case 'Emission': {
        setInitialData(getInitialEmissionData(application));
        break;
      }

      case 'Fuel': {
        setInitialData(getInitialFuelData(application, allFuels));
        break;
      }

      default:
        setInitialData(undefined);
    }
  }, [application, allFuels, formResult]);

  let initialDataSource;

  if (confirmationPage) return <ApplicationWizardConfirmation query={query} />;
  if (!formResult) return null;
  if (formResult.formResult !== '{}') {
    initialDataSource = 'your draft submission';
  } else if (formResult.formJsonByFormId.prepopulateFromSwrs) {
    initialDataSource = 'your last Emissions report';
  }

  if (!application) return null;

  return (
    <Form
      query={query}
      initialData={initialData}
      initialDataSource={initialDataSource}
      certificationPage={router.query.certificationPage}
      onFormComplete={onStepComplete}
    />
  );
};

export default createFragmentContainer(ApplicationWizardStep, {
  query: graphql`
    fragment ApplicationWizardStep_query on Query
      @argumentDefinitions(
        formResultId: {type: "ID!"}
        applicationId: {type: "ID!"}
      ) {
      ...Form_query @arguments(formResultId: $formResultId)
      ...ApplicationWizardConfirmation_query
        @arguments(applicationId: $applicationId)
      allFuels {
        edges {
          node {
            name
            units
          }
        }
      }
      formResult(id: $formResultId) {
        formResult
        formJsonByFormId {
          name
          prepopulateFromSwrs
        }
      }
      application(id: $applicationId) {
        swrsEmissionData(reportingYear: "2018") {
          edges {
            node {
              quantity
              emissionCategory
              gasType
            }
          }
        }
        swrsFacilityData(reportingYear: "2018") {
          facilityName
          facilityType
          bcghgid
          naicsCode
          latitude
          longitude
          facilityMailingAddress
          facilityCity
          facilityProvince
          facilityPostalCode
        }
        swrsFuelData(reportingYear: "2018") {
          edges {
            node {
              fuelType
              fuelDescription
              annualFuelAmount
              alternativeMethodolodyDescription
            }
          }
        }
        swrsOperatorContactData(reportingYear: "2018") {
          firstName
          lastName
          positionTitle
          email
          telephone
          fax
          contactMailingAddress
          contactCity
          contactProvince
          contactPostalCode
        }
        swrsOrganisationData(reportingYear: "2018") {
          operatorName
          operatorTradeName
          duns
          operatorMailingAddress
          operatorCity
          operatorProvince
          operatorPostalCode
          operatorCountry
        }
      }
    }
  `
});
