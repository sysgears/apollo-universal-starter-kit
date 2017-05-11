import gql from 'graphql-tag';

export const AMOUNT_QUERY = gql`
    query getCount {
        count {
            amount
        }
    }
`;
export default AMOUNT_QUERY;