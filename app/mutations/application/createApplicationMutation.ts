import {graphql} from 'react-relay';
import {RelayModernEnvironment} from 'relay-runtime/lib/store/RelayModernEnvironment';
import {
  createApplicationMutationVariables,
  createApplicationMutation as createApplicationMutationType
} from 'createApplicationMutation.graphql';
import BaseMutation from '../BaseMutation';

const mutation = graphql`
  mutation createApplicationMutation(
    $input: CreateApplicationMutationChainInput!
  ) {
    createApplicationMutationChain(input: $input) {
      clientMutationId
      application {
        id
      }
    }
  }
`;

const createApplicationMutation = async (
  environment: RelayModernEnvironment,
  variables: createApplicationMutationVariables
) => {
  const m = new BaseMutation<createApplicationMutationType>(
    'create-application-mutation'
  );
  return m.performMutation(environment, mutation, variables);
};

export default createApplicationMutation;
