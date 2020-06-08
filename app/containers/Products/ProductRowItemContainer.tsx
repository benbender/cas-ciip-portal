import React, {useMemo} from 'react';
import {graphql, createFragmentContainer, RelayProp} from 'react-relay';
import {
  Modal,
  Container,
  OverlayTrigger,
  Tooltip,
  Col,
  Row
} from 'react-bootstrap';
import {JSONSchema6} from 'json-schema';
import JsonSchemaForm, {IChangeEvent} from 'react-jsonschema-form';
import {ProductRowItemContainer_product} from 'ProductRowItemContainer_product.graphql';
import {ProductRowItemContainer_query} from 'ProductRowItemContainer_query.graphql';
import updateProductMutation from 'mutations/product/updateProductMutation';
import {CiipProductState} from 'updateProductMutation.graphql';
import updateBenchmarkMutation from 'mutations/benchmark/updateBenchmarkMutation';
import createBenchmarkMutation from 'mutations/benchmark/createBenchmarkMutation';
import FormArrayFieldTemplate from 'containers/Forms/FormArrayFieldTemplate';
import FormFieldTemplate from 'containers/Forms/FormFieldTemplate';
import FormObjectFieldTemplate from 'containers/Forms/FormObjectFieldTemplate';
import benchmarkSchemaFunction from './benchmark-schema';
import moment from 'moment-timezone';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import SearchDropdownWidget from 'components/Forms/SearchDropdownWidget';
import ProductRowIdField from 'containers/Forms/ProductRowIdField';
import {
  faTachometerAlt,
  faCube,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons';
import createProductLinkMutation from 'mutations/product_link/createProductLinkMutation';
import updateProductLinkMutation from 'mutations/product_link/updateProductLinkMutation';
import InnerModal from './InnerProductBenchmarkModal';

interface Props {
  relay: RelayProp;
  product: ProductRowItemContainer_product;
  query: ProductRowItemContainer_query;
  updateProductCount: (...args: any[]) => void;
  productCount: number;
}

export const ProductRowItemComponent: React.FunctionComponent<Props> = ({
  relay,
  product,
  query,
  updateProductCount,
  productCount
}) => {
  const [productModalShow, setProductModalShow] = React.useState(false);
  const [benchmarkModalShow, setBenchmarkModalShow] = React.useState(false);
  const [linkProductModalShow, setLinkProductModalShow] = React.useState(false);

  const currentBenchmark = product.benchmarksByProductId?.edges[0]?.node;
  const pastBenchmarks = product.benchmarksByProductId?.edges.slice(1);

  // Schema for ProductRowItemContainer
  const benchmarkSchema = useMemo(() => {
    const reportingYears = query.allReportingYears.edges.map(
      ({node}) => node.reportingYear
    );
    return benchmarkSchemaFunction(reportingYears);
  }, [query.allReportingYears]);

  /** Mutation functions **/

  // Change a product status
  const updateStatus = async (state: CiipProductState) => {
    const variables = {
      input: {
        id: product.id,
        productPatch: {
          productState: state
        }
      }
    };
    const response = await updateProductMutation(relay.environment, variables);
    handleUpdateProductCount((productCount += 1));
    setProductModalShow(false);
    console.log(response);
  };

  // Save a product
  const editProduct = async (e: IChangeEvent) => {
    const variables = {
      input: {
        id: product.id,
        productPatch: {
          productName: e.formData.productName,
          units: e.formData.units,
          productState: product.productState,
          requiresEmissionAllocation: e.formData.requiresEmissionAllocation,
          isCiipProduct: e.formData.isCiipProduct,
          isEnergyProduct: false,
          addPurchasedElectricityEmissions:
            e.formData.addPurchasedElectricityEmissions,
          subtractExportedElectricityEmissions:
            e.formData.subtractExportedElectricityEmissions,
          addPurchasedHeatEmissions: e.formData.addPurchasedHeatEmissions,
          subtractExportedHeatEmissions:
            e.formData.subtractExportedHeatEmissions,
          subtractGeneratedElectricityEmissions:
            e.formData.subtractGeneratedElectricityEmissions,
          subtractGeneratedHeatEmissions:
            e.formData.subtractGeneratedHeatEmissions,
          requiresProductAmount: e.formData.requiresProductAmount,
          addEmissionsFromEios: e.formData.addEmissionsFromEios
        }
      }
    };
    const response = await updateProductMutation(relay.environment, variables);
    handleUpdateProductCount((productCount += 1));
    setProductModalShow(false);
    console.log(response);
  };

  const createBenchmark = async ({formData}: IChangeEvent) => {
    const variables = {
      input: {
        benchmark: {
          ...formData,
          productId: product.rowId
        }
      }
    };

    const response = await createBenchmarkMutation(
      relay.environment,
      variables
    );
    handleUpdateProductCount((productCount += 1));
    setBenchmarkModalShow(false);
    console.log(response);
  };

  const editBenchmark = async ({formData}: IChangeEvent) => {
    const variables = {
      input: {
        id: currentBenchmark.id,
        benchmarkPatch: {
          ...formData
        }
      }
    };
    const response = await updateBenchmarkMutation(
      relay.environment,
      variables
    );
    handleUpdateProductCount((productCount += 1));
    setBenchmarkModalShow(false);
    console.log(response);
  };

  const handleUpdateProductCount = (newCount) => {
    updateProductCount(newCount);
  };

  /** Modals **/

  const editProductModal = (
    <Modal
      centered
      size="xl"
      show={productModalShow}
      onHide={() => {
        setProductModalShow(false);
        handleUpdateProductCount((productCount += 1));
        console.log(product);
      }}
    >
      <InnerModal
        isProduct
        updateStatus={updateStatus}
        product={product}
        benchmarkSchema={benchmarkSchema}
        currentBenchmark={currentBenchmark}
        editProduct={editProduct}
        editBenchmark={editBenchmark}
        createBenchmark={createBenchmark}
        pastBenchmarks={pastBenchmarks}
      />
    </Modal>
  );

  const editBenchmarkModal = (
    <Modal
      centered
      size="xl"
      show={benchmarkModalShow}
      onHide={() => {
        setBenchmarkModalShow(false);
        handleUpdateProductCount((productCount += 1));
      }}
    >
      <InnerModal
        isProduct={false}
        updateStatus={updateStatus}
        product={product}
        benchmarkSchema={benchmarkSchema}
        currentBenchmark={currentBenchmark}
        editProduct={editProduct}
        editBenchmark={editBenchmark}
        createBenchmark={createBenchmark}
        pastBenchmarks={pastBenchmarks}
      />
    </Modal>
  );

  const CUSTOM_FIELDS = {
    productRowId: (props) => {
      return <ProductRowIdField query={props.formContext.query} {...props} />;
    }
  };

  const linkSchema: JSONSchema6 = {
    type: 'array',
    items: {
      $ref: '#/definitions/product'
    },
    definitions: {
      product: {
        type: 'object',
        properties: {
          productRowId: {
            type: 'integer'
          }
        }
      }
    }
  };

  const linkUISchema = {
    'ui:add-text': '+',
    'ui:remove-text': '-',
    items: {
      'ui:field': 'product',
      classNames: 'hidden-title',
      productRowId: {
        'ui:col-md': 12,
        'ui:widget': 'SearchWidget',
        'ui:field': 'productRowId'
      }
    }
  };

  const createProductLink = async (newLink: number) => {
    const variables = {
      input: {
        productLink: {
          productId: product.rowId,
          linkedProductId: newLink,
          isDeleted: false
        }
      }
    };

    const response = await createProductLinkMutation(
      relay.environment,
      variables
    );
    handleUpdateProductCount((productCount += 1));
    console.log(response);
  };

  // TODO: GET ID OF PRODUCT LINK (add to db function?)
  const removeProductLink = async (removeLink: number) => {
    const variables = {
      input: {
        productLink: {
          productId: product.rowId,
          linkedProductId: removeLink,
          isDeleted: true
        }
      }
    };

    const response = await updateProductLinkMutation(
      relay.environment,
      variables
    );
    handleUpdateProductCount((productCount += 1));
    console.log(response);
  };

  const data = [];

  product.productLink.edges.forEach((edge) => {
    const dataObject = {productRowId: null};
    dataObject.productRowId = edge.node.rowId;
    data.push(dataObject);
  });

  console.log(data);

  const saveLinkedProducts = async (newData: IChangeEvent) => {
    const previousLinks = [];
    const newLinks = [];

    data.forEach((obj) => {
      previousLinks.push(obj.productRowId);
    });
    newData.formData.forEach((obj) => {
      newLinks.push(obj.productRowId);
    });

    newLinks.forEach(async (id) => {
      if (!previousLinks.includes(id)) {
        console.log('ADD:', id);
        const response = await createProductLink(id);
        console.log(response);
      }
    });
    previousLinks.forEach(async (id) => {
      if (!newLinks.includes(id)) {
        console.log('REMOVE:', id);
        const response = await removeProductLink(id);
        console.log(response);
      }
    });
  };

  const linkProductModal = (
    <Modal
      centered
      size="xl"
      show={linkProductModalShow}
      onHide={() => {
        console.log(product.productLink.edges);
        setLinkProductModalShow(false);
      }}
    >
      <Modal.Header closeButton style={{color: 'white', background: '#003366'}}>
        <Modal.Title>Product Associations</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{background: '#f5f5f5'}}>
        <p>TESST TEXT TEST TEXT: blah blah blah</p>
        <Container>
          <Row>
            <Col md={3}>
              <h5>Product Name</h5>
            </Col>
            <Col md={6}>
              <h5>Associated Products:</h5>
            </Col>
            <Col md={2}>
              <h5>Add / Remove</h5>
            </Col>
          </Row>
          &emsp;
          <Row>
            <Col md={3}>
              <h6>{product.productName}</h6>
            </Col>
            <Col md={6}>
              <JsonSchemaForm
                showErrorList={false}
                ArrayFieldTemplate={FormArrayFieldTemplate}
                FieldTemplate={FormFieldTemplate}
                formContext={{query}}
                fields={CUSTOM_FIELDS}
                formData={data}
                widgets={{SearchWidget: SearchDropdownWidget}}
                schema={linkSchema}
                uiSchema={linkUISchema}
                ObjectFieldTemplate={FormObjectFieldTemplate}
                onSubmit={saveLinkedProducts}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <style jsx global>{`
        .hidden-title label {
          display: none;
        }
        .close {
          color: white;
        }
        .hidden-button {
          display: none;
        }
      `}</style>
    </Modal>
  );

  return (
    <>
      <tr>
        <td>{product.productName}</td>
        <td>{moment(product.updatedAt).format('DD-MM-YYYY')}</td>
        <td>{currentBenchmark?.benchmark ?? null}</td>
        <td>{currentBenchmark?.eligibilityThreshold ?? null}</td>
        <td>{product.requiresEmissionAllocation ? 'Yes' : 'No'}</td>
        <td>{product.productState}</td>
        <td>{product.isCiipProduct ? 'Yes' : 'No'}</td>
        <td>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="link-product">
                {product.productState === 'ARCHIVED' ? 'View' : 'Edit'} Link
                Products
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              className={
                product.productState === 'ARCHIVED'
                  ? 'editIcon-disabled'
                  : 'editIcon'
              }
              icon={faShareAlt}
              onClick={() => setLinkProductModalShow(true)}
            />
          </OverlayTrigger>
          &emsp;
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="benchmark">
                {product.productState === 'ARCHIVED' ? 'View' : 'Edit'}{' '}
                Benchmark
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              className={
                product.productState === 'ARCHIVED'
                  ? 'editIcon-disabled'
                  : 'editIcon'
              }
              icon={faTachometerAlt}
              onClick={() => setBenchmarkModalShow(true)}
            />
          </OverlayTrigger>
          &emsp;
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="product">
                {product.productState === 'DRAFT' && !product.isReadOnly
                  ? 'Edit'
                  : 'View'}{' '}
                Product
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              className={
                product.productState === 'DRAFT' && !product.isReadOnly
                  ? 'editIcon'
                  : 'editIcon-disabled'
              }
              icon={faCube}
              onClick={() => setProductModalShow(true)}
            />
          </OverlayTrigger>
        </td>
      </tr>
      {editProductModal}
      {editBenchmarkModal}
      {linkProductModal}
      <style jsx global>
        {`
          .editIcon:hover {
            color: red;
            cursor: pointer;
          }
          .editIcon-disabled {
            opacity: 0.5;
          }
        }
        .editIcon-disabled:hover {
          color: red;
          opacity: 0.5;
          cursor: pointer;
        }
        `}
      </style>
    </>
  );
};

export default createFragmentContainer(ProductRowItemComponent, {
  product: graphql`
    fragment ProductRowItemContainer_product on Product {
      id
      rowId
      productName
      productState
      units
      requiresEmissionAllocation
      isCiipProduct
      isReadOnly
      addPurchasedElectricityEmissions
      subtractExportedElectricityEmissions
      addPurchasedHeatEmissions
      subtractExportedHeatEmissions
      subtractGeneratedElectricityEmissions
      subtractGeneratedHeatEmissions
      addEmissionsFromEios
      requiresProductAmount
      updatedAt
      benchmarksByProductId(orderBy: CREATED_AT_DESC) {
        edges {
          node {
            id
            rowId
            benchmark
            eligibilityThreshold
            incentiveMultiplier
            startReportingYear
            endReportingYear
            minimumIncentiveRatio
            maximumIncentiveRatio
            createdAt
          }
        }
      }
      productLink {
        edges {
          node {
            rowId
          }
        }
      }
    }
  `,
  query: graphql`
    fragment ProductRowItemContainer_query on Query {
      nextReportingYear {
        reportingYear
      }
      allReportingYears {
        edges {
          node {
            reportingYear
          }
        }
      }
      ...ProductRowIdField_query
    }
  `
});
