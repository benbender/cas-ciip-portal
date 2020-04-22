import React from 'react';
import {Alert} from 'react-bootstrap';
import {FieldProps} from 'react-jsonschema-form';
import ObjectField from 'react-jsonschema-form/lib/components/fields/ObjectField';
import {createFragmentContainer, graphql} from 'react-relay';
import {ProductField_query} from 'ProductField_query.graphql';

interface FormData {
  productRowId?: number;
  productAmount?: number;
  productUnits?: string;
  productEmissions?: number;
  requiresEmissionAllocation?: boolean;
  requiresProductAmount?: boolean;
}

interface Props extends FieldProps<FormData> {
  query: ProductField_query;
}

/**
 * This custom ObjectField component injects the read-only data for a product when the
 * product id changes
 */
export const ProductFieldComponent: React.FunctionComponent<Props> = props => {
  const {formData, query, onChange} = props;

  const productIsActive = (formData, query) => {
    const product = query.allProducts.edges.find(
      ({node}) => node.rowId === formData.productRowId
    )?.node;
    if (product?.state === 'active' || !product) return true;
    return false;
  };

  const handleChange = (product: FormData) => {
    if (formData.productRowId === product.productRowId) onChange(product);
    else handleProductChange(product.productRowId);
  };

  const handleProductChange = (productRowId: number) => {
    const product = query.allProducts.edges.find(
      ({node}) => node.rowId === productRowId
    )?.node;
    onChange({
      ...formData,
      productRowId,
      productUnits: product?.units,
      requiresEmissionAllocation: product?.requiresEmissionAllocation,
      requiresProductAmount: product?.requiresProductAmount
    });
  };

  return (
    <>
      {productIsActive(formData, query) ? (
        <ObjectField {...props} onChange={handleChange} />
      ) : (
        <>
          <Alert variant="danger">
            <strong>Warning:</strong> This `Product` or `Product Version` has
            been deprecated. Please remove it and select an appropriate
            replacement
          </Alert>
          <ObjectField {...props} disabled onChange={handleChange} />
        </>
      )}
    </>
  );
};

export default createFragmentContainer(ProductFieldComponent, {
  query: graphql`
    fragment ProductField_query on Query {
      allProducts {
        edges {
          node {
            rowId
            units
            state
            requiresEmissionAllocation
            requiresProductAmount
          }
        }
      }
    }
  `
});
