/*tslint:disable: variable-name*/
import i18n from 'i18next';

/**
 * Non empty validation
 *
 * @param value
 * @return undefined if it's valid, error message otherwise
 */
export const required = (value: any) => (value ? undefined : i18n.t('fieldValidation:required'));

/**
 * Match a particular field
 * @param comparableField
 */
export const match = (comparableField: any) => (value: any, values: any) =>
  value !== values[comparableField] ? i18n.t('fieldValidation:match', { comparableField }) : undefined;

/**
 * Max length validation
 * Usage: const maxLength15 = maxLength(15)
 *
 * @param max
 */
export const maxLength = (max: number) => (value: any) =>
  value && value.length > max ? i18n.t('fieldValidation:maxLength', { max }) : undefined;

/**
 * Min length validation
 * Usage: export const minLength2 = minLength(2)
 *
 * @param min
 */
export const minLength = (min: number) => (value: any) =>
  value && value.length < min ? i18n.t('fieldValidation:minLength', { min }) : undefined;

/**
 * Number validation
 *
 * @param value
 */
export const number = (value: any) => (value && isNaN(Number(value)) ? i18n.t('fieldValidation:number') : undefined);

/**
 * Minimum value validation
 * Usage: export const minValue18 = minValue(18);
 *
 * @param min
 */
export const minValue = (min: number) => (value: any) =>
  value && value < min ? i18n.t('fieldValidation:minValue', { min }) : undefined;

/**
 * Email validation
 *
 * @param value
 */
export const email = (value: any) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? i18n.t('fieldValidation:email') : undefined;

/**
 * Alpha numeric validation
 *
 * @param value
 */
export const alphaNumeric = (value: any) =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? i18n.t('fieldValidation:alphaNumeric') : undefined;

/**
 * Phone number validation
 *
 * @param value
 */
export const phoneNumber = (value: any) =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? i18n.t('fieldValidation:phoneNumber') : undefined;

/**
 * Validates form to from schema
 *
 * @param formValues
 * @param formSchema
 */
export const validateForm = (formValues: any, formSchema: any) => {
  const errors = {};
  const validateFormInner = (values: any, schema: any, collector: any) => {
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
          validateFormInner(values[v], schema[v], collector);
        }
      });

    return collector;
  };

  return validateFormInner(formValues, formSchema, errors);
};
