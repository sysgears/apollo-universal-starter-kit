/* tslint:disable: variable-name */
import i18n from 'i18next';

/**
 * Validates if the value is empty.
 *
 * @param value
 * @return {undefined | string}
 */
export const required = (value: any) => (value ? undefined : i18n.t('validation:required'));

/**
 * Validates if the value matches a particular value.
 * @param comparableField
 */
export const match = (comparableField: string) => (value: any, values: any) =>
  value !== values[comparableField] ? i18n.t('validation:match', { comparableField }) : undefined;

/**
 * Validates the maximal length of the value.
 * Usage: const maxLength15 = maxLength(15)
 *
 * @param max
 * @return {undefined | string}
 */
export const maxLength = (max: number) => (value: any) =>
  value && value.length > max ? i18n.t('validation:maxLength', { max }) : undefined;

/**
 * Validates the minimal length of the value.
 * Usage: export const minLength2 = minLength(2)
 *
 * @param min
 * @return {undefined | string}
 */
export const minLength = (min: number) => (value: any) =>
  value && value.length < min ? i18n.t('validation:minLength', { min }) : undefined;

/**
 * Validates if the value is a number.
 *
 * @param value
 * @return {undefined | string}
 */
export const number = (value: any) => (value && isNaN(Number(value)) ? i18n.t('validation:number') : undefined);

/**
 * Validates if the value is a string.
 *
 * @param value
 * @return {undefined | string}
 */
export const string = (value: any) =>
  value && !(typeof value === 'string' || value instanceof String) ? i18n.t('validation:string') : undefined;

/**
 * Validates the minimal value.
 * Usage: export const minValue18 = minValue(18);
 *
 * @param min
 * @return {undefined | string}
 */
export const minValue = (min: number) => (value: any) =>
  value && value < min ? i18n.t('validation:minValue', { min }) : undefined;

/**
 * Validates the email.
 *
 * @param value
 * @return {undefined | string}
 */
export const email = (value: any) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? i18n.t('validation:email') : undefined;

/**
 * Validates if the value is alpha-numeric.
 *
 * @param value
 * @return {undefined | string}
 */
export const alphaNumeric = (value: any) =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? i18n.t('validation:alphaNumeric') : undefined;

/**
 * Validates the phone number.
 *
 * @param value
 * @return {undefined | string}
 */
export const phoneNumber = (value: any) =>
  value && !/^(\+)?([ 0-9]){10,16}$/i.test(value) ? i18n.t('validation:phoneNumber') : undefined;

/**
 * Schema interface for the validate function.
 */
export interface Schema {
  [key: string]: Array<(value: any, values: { [key: string]: any }) => string | undefined> | Schema;
}

/**
 * Validates the input object according to the input schema.
 *
 * @param object
 * @param schema
 * @return object with errors
 */
export const validate = (object: { [key: string]: any }, schema: Schema) => {
  const errors = {};
  const validateFormInner = (
    values: { [key: string]: any },
    innerSchema: Schema,
    collector: { [key: string]: string }
  ) => {
    Object.keys(innerSchema)
      .filter(v => innerSchema.hasOwnProperty(v))
      .forEach(v => {
        const s = innerSchema[v];

        if (Array.isArray(s)) {
          s.forEach(validator => {
            const result = validator(values[v], values);
            if (result) {
              collector[v] = result;
            }
          });
        } else {
          validateFormInner(values[v], innerSchema[v] as Schema, collector);
        }
      });

    return collector;
  };

  const collectedErrors = validateFormInner(object, schema, errors);
  return Object.keys(collectedErrors).length ? collectedErrors : undefined;
};
