// Validations

// Non empty validation
export const required = value => (value ? undefined : 'Required');

// Max length validation
export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined; // Usage: const maxLength15 = maxLength(15)

// Min length validation
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined; // Usage: export const minLength2 = minLength(2)

// Number validation
export const number = value => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);

// Minimum value validation
export const minValue = min => value => (value && value < min ? `Must be at least ${min}` : undefined); // Usage: export const minValue18 = minValue(18);

// Email validation
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;

// Alpha numeric validation
export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined;

// Phone number validation
export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined;
