import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { Form, FormItem, Input } from '../../common/components/web';

class $Module$FilterView extends React.PureComponent {
  handleSearch = e => {
    const { onSearchTextChange } = this.props;
    onSearchTextChange(e.target.value);
  };

  render() {
    return (
      <Form layout="inline">
        <FormItem label="Filter">
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            placeholder="Search ..."
            element={Input}
            onChange={this.handleSearch}
          />
        </FormItem>
      </Form>
    );
  }
}

$Module$FilterView.propTypes = {
  searchText: PropTypes.string,
  onSearchTextChange: PropTypes.func.isRequired
};

export default $Module$FilterView;
