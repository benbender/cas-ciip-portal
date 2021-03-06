import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Table, Jumbotron} from 'react-bootstrap';
import IncentiveSegmentFormula from 'components/Incentives/IncentiveSegmentFormula';
import {IncentiveCalculatorContainer_applicationRevision} from 'IncentiveCalculatorContainer_applicationRevision.graphql';
import IncentiveSegmentContainer from './IncentiveSegmentContainer';

interface Props {
  applicationRevision: IncentiveCalculatorContainer_applicationRevision;
}

export const IncentiveCalculator: React.FunctionComponent<Props> = ({
  applicationRevision
}) => {
  const {edges = []} = applicationRevision.ciipIncentive;
  return (
    <>
      <Jumbotron>
        <div style={{marginBottom: '30px'}}>
          <h5>Incentive by Product:</h5>
          <p>
            This formula gives the partial incentive for each product reported
            in <br />
            the CIIP application. The total Incentive is the sum of these
            partial incentives.
            <br />
          </p>
        </div>
        <IncentiveSegmentFormula />
      </Jumbotron>

      <Table striped bordered hover responsive="lg">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Emission Intensity</th>
            <th>Benchmark</th>
            <th>Eligibility Threshold</th>
            <th>Threshold Chart</th>
            <th>Incentive Ratio</th>
            <th>Incentive Multiplier</th>
            <th>Payment Allocation</th>
            <th>Calculated Incentive (CAD)</th>
            <th>Maximum Incentive (CAD)</th>
          </tr>
        </thead>
        <tbody>
          {edges.map(({node}) => (
            <IncentiveSegmentContainer
              key={node.rowId}
              ciipIncentiveByProduct={node}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default createFragmentContainer(IncentiveCalculator, {
  applicationRevision: graphql`
    fragment IncentiveCalculatorContainer_applicationRevision on ApplicationRevision {
      ciipIncentive {
        edges {
          node {
            rowId
            ...IncentiveSegmentContainer_ciipIncentiveByProduct
          }
        }
      }
    }
  `
});
