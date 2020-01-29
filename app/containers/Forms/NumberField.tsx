import React from 'react';
import NumberFormat from 'react-number-format';
import {FieldProps} from 'react-jsonschema-form';
import {getWidget} from 'react-jsonschema-form/lib/utils';

const NumberField: React.FunctionComponent<FieldProps> = ({
  formData,
  onChange,
  schema,
  idSchema,
  disabled,
  readonly,
  uiSchema,
  registry,
  name,
  required,
  formContext,
  autofocus,
  placeholder,
  rawErrors,
  onBlur,
  onFocus
}) => {
  const {title} = schema;
  if (uiSchema?.['ui:widget']) {
    const WidgetComponent = getWidget(
      schema,
      // @ts-ignore
      uiSchema['ui:widget'],
      registry.widgets
    );
    return (
      // @ts-ignore
      <WidgetComponent
        schema={schema}
        id={idSchema && idSchema.$id}
        label={title ?? name}
        value={formData}
        required={required}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
        registry={registry}
        placeholder={placeholder}
        rawErrors={rawErrors}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  const allowNegative =
    (schema.minimum === undefined && schema.exclusiveMinimum === undefined) ||
    schema.minimum < 0 ||
    schema.exclusiveMinimum < 0;

  return (
    <NumberFormat
      thousandSeparator
      id={idSchema.$id}
      disabled={disabled}
      className="form-control"
      allowNegative={allowNegative}
      decimalScale={4}
      value={formData}
      onValueChange={({floatValue}) => onChange(floatValue)}
    />
  );
};

export default NumberField;
