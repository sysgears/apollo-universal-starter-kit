/*tslint:disable: variable-name*/
import i18n from 'i18next';

/**
 * Non empty validation
 *
 * @param value
 * @return {undefined | message}
 */
export const required = (value: any) => (value ? undefined : i18n.t('validation:required'));

/**
 * Match a particular field
 * @param comparableField
 */
export const match = (comparableField: string) => (value: any, values: any) =>
  value !== values[comparableField] ? i18n.t('validation:match', { comparableField }) : undefined;

/**
 * Max length validation
 * Usage: const maxLength15 = maxLength(15)
 *
 * @param max
 * @return {undefined | message}
 */
export const maxLength = (max: number) => (value: any) =>
  value && value.length > max ? i18n.t('validation:maxLength', { max }) : undefined;

/**
 * Min length validation
 * Usage: export const minLength2 = minLength(2)
 *
 * @param min
 * @return {undefined | message}
 */
export const minLength = (min: number) => (value: any) =>
  value && value.length < min ? i18n.t('validation:minLength', { min }) : undefined;

/**
 * Number validation
 *
 * @param value
 * @return {undefined | message}
 */
export const number = (value: any) => (value && isNaN(Number(value)) ? i18n.t('validation:number') : undefined);

/**
 * Minimum value validation
 * Usage: export const minValue18 = minValue(18);
 *
 * @param min
 * @return {undefined | message}
 */
export const minValue = (min: number) => (value: any) =>
  value && value < min ? i18n.t('validation:minValue', { min }) : undefined;

/**
 * Email validation
 *
 * @param value
 * @return {undefined | message}
 */
export const email = (value: any) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? i18n.t('validation:email') : undefined;

/**
 * Alpha numeric validation
 *
 * @param value
 * @return {undefined | message}
 */
export const alphaNumeric = (value: any) =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? i18n.t('validation:alphaNumeric') : undefined;

/**
 * Phone number validation
 *
 * @param value
 * @return {undefined | message}
 */
export const phoneNumber = (value: any) =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? i18n.t('validation:phoneNumber') : undefined;

/**
 * Schema interface for validate function
 */
export interface Schema {
  [key: string]: Array<(value: any, values: { [key: string]: any }) => string | undefined> | Schema;
}

/**
 * Validates the income object according to the income schema
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
    Object.keys(schema)
      .filter(v => schema.hasOwnProperty(v))
      .forEach(v => {
        const s = schema[v];

        if (Array.isArray(s)) {
          s.forEach(validator => {
            const result = validator(values[v], values);
            if (result) {
              collector[v] = result;
            }
          });
        } else {
          validateFormInner(values[v], schema[v] as Schema, collector);
        }
      });

    return collector;
  };

  return validateFormInner(object, schema, errors);
};
