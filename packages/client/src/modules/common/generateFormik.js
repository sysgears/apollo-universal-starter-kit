import { DomainSchemaFormik } from '@domain-schema/formik/lib/index';
import { Button, RenderField, RenderNumber, Form, RenderDate, RenderSelectQuery, RenderSwitch } from './components/web';

export default (schema, components = {}, buttonsConfig = {}, fieldsStyles = {}) => {
  const schemaFormik = new DomainSchemaFormik(schema);
  schemaFormik.setFormComponents({
    input: RenderField,
    checkbox: RenderSwitch,
    number: RenderNumber,
    date: RenderDate,
    select: RenderSelectQuery,
    button: Button,
    form: Form,
    ...components
  });
  const generateFormParams = {
    ...(Object.keys(buttonsConfig).length !== 0 && buttonsConfig.constructor === Object
      ? buttonsConfig
      : {
          label: 'Submit'
        }),
    ...(Object.keys(fieldsStyles).length !== 0 && fieldsStyles.constructor === Object ? fieldsStyles : {})
  };
  return schemaFormik.generateForm(...generateFormParams);
};
