import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Alert from 'react-bootstrap/Alert';
import JsonSchemaForm, {IChangeEvent, ErrorSchema} from 'react-jsonschema-form';
import {Form_query} from 'Form_query.graphql';

interface Props {
  query: Form_query;
  initialData?: any;
  initialDataSource?: string;
  onComplete?: any;
  onValueChanged: (e: IChangeEvent<unknown>, es?: ErrorSchema) => any;
}
// Note: https://github.com/graphile/postgraphile/issues/980
export const FormComponent: React.FunctionComponent<Props> = ({
  query,
  initialData,
  initialDataSource,
  onComplete,
  onValueChanged
}) => {
  const {result} = query || {};

  const {
    formJsonByFormId: {formJson},
    formResult
  } = result || {formJsonByFormId: {}};
  if (!result) return null;

  return (
    <>
      {initialData && Object.keys(initialData).length > 0 && initialDataSource && (
        <>
          <Alert variant="info">
            We filled this form for you with the data coming from{' '}
            {initialDataSource}. Please review it and either submit or edit it.
          </Alert>
        </>
      )}
      <JsonSchemaForm
        schema={formJson}
        formData={formResult}
        onChange={onValueChanged}
        onSubmit={onComplete}
      />
    </>
  );
};

export default createFragmentContainer(FormComponent, {
  query: graphql`
    fragment Form_query on Query
      @argumentDefinitions(formResultId: {type: "ID!"}) {
      ...FormWithProductUnits_query
      ...FormWithFuelUnits_query
      result: formResult(id: $formResultId) {
        formResult
        formJsonByFormId {
          formJson
        }
      }
    }
  `
});
