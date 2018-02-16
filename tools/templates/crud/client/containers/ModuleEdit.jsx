import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { EditView } from '../../common/components/crud';
import { pickInputFields } from '../../common/util';
import { $Module$Schema } from '../../../../../server/src/modules/$module$/schema';
import $MODULE$_QUERY from '../graphql/$Module$Query.graphql';
import CREATE_$MODULE$ from '../graphql/Create$Module$.graphql';
import UPDATE_$MODULE$ from '../graphql/Update$Module$.graphql';

class $Module$Edit extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    createEntry: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  };

  onSubmit = async values => {
    const { data: { node }, createEntry, updateEntry, title } = this.props;
    let result = null;
    const insertValues = pickInputFields($Module$Schema, values, node);

    if (node) {
      result = await updateEntry(insertValues, { id: node.id });
    } else {
      result = await createEntry(insertValues);
    }

    if (result && result.errors) {
      let submitError = {
        _error: `Edit ${title} failed!`
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new submitError();
    }
  };

  render() {
    return <EditView {...this.props} onSubmit={this.onSubmit} schema={$Module$Schema} />;
  }
}

const $Module$EditWithApollo = compose(
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
        variables: { where: { id } }
      };
    },
    props({ data: { loading, $module$ } }) {
      return { loading, data: $module$ };
    }
  }),
  graphql(CREATE_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      createEntry: async data => {
        try {
          const { data: { create$Module$ } } = await mutate({
            variables: { data }
          });

          if (create$Module$.errors) {
            return { errors: create$Module$.errors };
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
  graphql(UPDATE_$MODULE$, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      updateEntry: async (data, where) => {
        try {
          const { data: { update$Module$ } } = await mutate({
            variables: { data, where }
          });

          if (update$Module$.errors) {
            return { errors: update$Module$.errors };
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

export default connect(state => ({
  title: state.$module$.title,
  link: state.$module$.link
}))($Module$EditWithApollo);
