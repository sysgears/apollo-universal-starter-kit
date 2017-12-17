import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { pick } from 'lodash';
import { PageLayout } from '../../../common/components/web';

import GroupForm from './GroupForm';
import settings from '../../../../../../settings';

export default class GroupEditView extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    group: PropTypes.object,
    addGroup: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired
  };

  onSubmit = async values => {
    const { group, addGroup, editGroup } = this.props;
    let result = null;

    let insertValues = pick(values, ['id', 'name', 'role', 'isActive']);

    insertValues['profile'] = pick(values.profile, ['displayName', 'description']);

    if (group) {
      result = await editGroup({ id: group.id, ...insertValues });
    } else {
      result = await addGroup(insertValues);
    }

    if (result.errors) {
      let submitError = {
        _error: 'Edit group failed!'
      };
      result.errors.map(error => (submitError[error.field] = error.message));
      throw new SubmissionError(submitError);
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit Group`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - Edit group example page`
        }
      ]}
    />
  );

  render() {
    const { loading, group } = this.props;

    if (loading && !group) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <Link id="back-button" to="/groups">
            Back
          </Link>
          <h2>{group ? 'Edit' : 'Create'} Group</h2>
          <GroupForm onSubmit={this.onSubmit} initialValues={group} />
        </PageLayout>
      );
    }
  }
}
