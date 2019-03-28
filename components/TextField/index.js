import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';
import { dump } from '../../libraries/helpers';

const GET_TEXT = gql`
  subscription {
    meeting {
      text_field
    }
  }
`;

const TextField = () => (
  <Subscription subscription={GET_TEXT}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return <pre>{dump(data)}</pre>;
    }}
  </Subscription>
);

export default TextField;
