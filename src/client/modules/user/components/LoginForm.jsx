import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../common/components';
import { RenderField } from '../../common/components/native';

const required = value => (value ? undefined : 'Required');

const LoginForm = ({ handleSubmit, valid, onSubmit }) => {
  return (
    <View style={styles.form}>
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="email"
        component={RenderField}
        type="email"
        keyboardType="email-address"
        label="Email"
        placeholder="Type Your Email"
        validate={required}
      />
      <Field
        autoCapitalize="none"
        autoCorrect={false}
        name="password"
        component={RenderField}
        type="password"
        secureTextEntry={true}
        label="Password"
        placeholder="Type Your Password"
        validate={required}
      />
      <Button style={styles.submit} onPress={handleSubmit(onSubmit)} disabled={valid}>
        Sign In
      </Button>
    </View>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  valid: PropTypes.bool
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  form: {
    flex: 0.8,
    alignItems: 'stretch'
  },
  submit: {
    marginTop: 10,
    alignSelf: 'center'
  }
});

export default reduxForm({
  form: 'post',
  enableReinitialize: true
})(LoginForm);
