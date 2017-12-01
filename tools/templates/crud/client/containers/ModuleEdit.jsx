import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { SubmissionError } from 'redux-form';

import { pickInputFields } from '../../common/util';
import { $Module$ as $Module$Schema } from '../../../../server/modules/$module$/schema';
import $Module$EditView from '../components/$Module$EditView';
import $MODULE$_QUERY from '../graphql/$Module$Query.graphql';
import ADD_$MODULE$ from '../graphql/Add$Module$.graphql';
import EDIT_$MODULE$ from '../graphql/Edit$Module$.graphql';

class $Module$Edit extends React.Component {
  onSubmit = async values => {
    const { $module$, add$Module$, edit$Module$ } = this.props;
    let result = null;

    const insertValues = pickInputFields($Module$Schema, values);

    if ($module$) {
      result = await edit$Module$(insertValues);
    } else {
      result = await add$Module$(insertValues);
    }

    if (result.errors) {
      let submitError = {
        _error: 'Edit $module$ failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  render() {
    return <$Module$EditView {...this.props} onSubmit={this.onSubmit} />;
  }
}

$Module$Edit.propTypes = {
  crud: PropTypes.object,
  add$Module$: PropTypes.func.isRequired,
  edit$Module$: PropTypes.func.isRequired
};

export default compose(
  graphql($MODULE$_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        fetchPolicy: 'cache-and-network',
        variables: { id }
      };
    },
    props({ data: { loading, $module$ } }) {
      return { loading, $module$ };
    }
  }),
  graphql(ADD_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      add$Module$: async input => {
        try {
          const { data: { add$Module$ } } = await mutate({
            variables: { input }
          });

          if (add$Module$.errors) {
            return { errors: add$Module$.errors };
          }

          if (history) {
            return history.push('/$module$');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  }),
  graphql(EDIT_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      edit$Module$: async input => {
        try {
          const { data: { edit$Module$ } } = await mutate({
            variables: { input }
          });

          if (edit$Module$.errors) {
            return { errors: edit$Module$.errors };
          }

          if (history) {
            return history.push('/$module$');
          }
          if (navigation) {
            return navigation.goBack();
          }
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)($Module$Edit);
