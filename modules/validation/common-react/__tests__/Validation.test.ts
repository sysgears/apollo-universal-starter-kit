import CommonModule from '@gqlapp/module-common';
import i18n from '@gqlapp/i18n-common-react';
import i18next from 'i18next';
import validation from '..';

import {
  required,
  match,
  maxLength,
  minLength,
  number,
  string,
  minValue,
  email,
  alphaNumeric,
  phoneNumber,
  validate,
  Schema,
} from '../validation';

(async () => {
  await new CommonModule(i18n, validation).createApp(module);
})();

describe('Check if validation works', () => {
  it('Validator "required"  works correctly', () => {
    expect(required('')).toBeInstanceOf('string');
    expect(required('work')).toBe(undefined);
  });

  it('Validator "match" works correctly', () => {
    expect(match('name')('Login', { name: 'Login' })).toBe(undefined);
    expect(match('name')('Login', { name: 'Loginnn' })).toBeInstanceOf('string');
    expect(match('name')('Login', {})).toBeInstanceOf('string');
  });

  it('Validator "maxLength" works correctly 1', () => {
    expect(maxLength(5)('Login')).toBe(undefined);
    expect(maxLength(5)('Loginn')).toBeInstanceOf('string');
  });

  it('Validator "maxLength" works correctly 2', () => {
    expect(minLength(5)('Login')).toBe(undefined);
    expect(minLength(5)('Logi')).toBeInstanceOf('string');
  });

  it('Validator "number" works correctly', () => {
    expect(number(5)).toBe(undefined);
    expect(number('5')).toBe(undefined);
    expect(number('0')).toBe(undefined);
    expect(number('-0')).toBe(undefined);
    expect(number('dg')).toBeInstanceOf('string');
    expect(number('..11')).toBeInstanceOf('string');
  });

  it('Validator "string" works correctly', () => {
    expect(string('string')).toBe(undefined);
    expect(string('&*(&*(')).toBe(undefined);
    expect(string('!')).toBe(undefined);
    expect(string('222')).toBe(undefined);
    expect(string('1')).toBe(undefined);
    expect(string('')).toBe(undefined);
    expect(string(2)).toBeInstanceOf('string');
    expect(string(/^[A-Z0-9._%+-]{2,4}$/)).toBeInstanceOf('string');
  });

  it('Validator "minValue" works correctly', () => {
    expect(minValue(5)(5)).toBe(undefined);
    expect(minValue(5)(4)).toBeInstanceOf('string');
  });

  it('Validator "email" works correctly', () => {
    expect(email('test@test.ru')).toBe(undefined);
    expect(email('te234st@te32st.com')).toBe(undefined);
    expect(email('te-234st@te32st.c')).toBeInstanceOf('string');
    expect(email('test*@te32st.com')).toBeInstanceOf('string');
  });

  it('Validator "alphaNumeric" works correctly', () => {
    expect(alphaNumeric('d')).toBe(undefined);
    expect(alphaNumeric('2')).toBe(undefined);
    expect(alphaNumeric('*')).toBeInstanceOf('string');
    expect(alphaNumeric('(')).toBeInstanceOf('string');
    expect(alphaNumeric('`')).toBeInstanceOf('string');
  });

  it('Validator "phoneNumber" works correctly', () => {
    expect(phoneNumber('0639991122')).toBe(undefined);
    expect(phoneNumber('+380639991122')).toBe(undefined);
    expect(phoneNumber('+38 063 999 11 22')).toBe(undefined);
    expect(phoneNumber('639991122')).toBeInstanceOf('string');
  });

  it('"validate" should compare the simple input object to input schema', () => {
    let schema: Schema = { name: [required, minLength(5), maxLength(7)] };
    let dataToValidate: { [key: string]: any } = { name: 'login' };
    expect(validate(dataToValidate, schema)).toBe(undefined);

    schema = {
      name: [required, minLength(5), maxLength(8)],
      password: [required, minLength(5), maxLength(8)],
      duplicatePassword: [required, match('password'), minLength(5), maxLength(8)],
    };
    dataToValidate = { name: 'login', password: 'password', duplicatePassword: 'password' };
    expect(validate(dataToValidate, schema)).toBe(undefined);

    schema = { name: [required, minLength(5), maxLength(7)] };
    dataToValidate = { name: 'logi' };
    const result1 = validate(dataToValidate, schema);
    expect(result1).toBeInstanceOf('object');
    expect(result1).toHaveProperty('name');
    expect(result1['name']).toBeInstanceOf('string');

    schema = {
      name: [required, minLength(5), maxLength(8)],
      password: [required, minLength(5), maxLength(8)],
      duplicatePassword: [required, match('password'), minLength(5), maxLength(8)],
    };
    dataToValidate = { name: 'login', password: 'BadPass', duplicatePassword: 'GoodPass' };
    const result2 = validate(dataToValidate, schema);
    expect(result2).toBeInstanceOf('object');
    expect(result2).toHaveProperty('duplicatePassword');
    expect(result2['duplicatePassword']).toBeInstanceOf('string');

    schema = { name: { firstName: [required, minLength(5), maxLength(8)] } };
    dataToValidate = { name: { firstName: 'Name' } };
    const result3 = validate(dataToValidate, schema);
    expect(result3).toBeInstanceOf('object');
    expect(result3).toHaveProperty('firstName');
    expect(result3['firstName']).toBeInstanceOf('string');
  });

  it('"validate" should compare the input object with nested objects to the input schema', () => {
    let schema: Schema = { name: { firstName: [required, minLength(5), maxLength(8)] } };
    let dataToValidate: { [key: string]: any } = { name: { firstName: 'GoodName' } };
    expect(validate(dataToValidate, schema)).toBe(undefined);

    schema = { name: { firstName: [required, minLength(5), maxLength(8)] } };
    dataToValidate = { name: { firstName: 'bad' } };
    const result = validate(dataToValidate, schema);
    expect(result).toBeInstanceOf('object');
    expect(result).toHaveProperty('firstName');
    expect(result['firstName']).toBeInstanceOf('string');
  });

  it('Should change the language of the validation message from English to Russian and vice versa', () => {
    expect(required('')).toMatch(/[a-zA-Z]/g);
    i18next.changeLanguage('ru-RU');
    expect(required('')).toMatch(/[а-яА-Я]/g);
    i18next.changeLanguage('en-US');
    expect(required('')).toMatch(/[a-zA-Z]/g);
  });
});
