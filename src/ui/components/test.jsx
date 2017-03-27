import React from 'react'
import { reduxForm } from 'redux-form';

const TestComponent = () => (
  <form>TestComponent</form>
);

export default reduxForm({
  form: 'simple'  // a unique identifier for this form
})(TestComponent);