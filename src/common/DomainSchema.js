export class Schema {}

class DomainSchema extends Schema {
  static Integer = class Integer {};
  static ID = class ID {};

  _wrongSchema(SchemaClass) {
    throw new Error(`Schema ${SchemaClass ? SchemaClass.name : SchemaClass} must be an instance of Schema`);
  }

  constructor(SchemaClass) {
    super();
    if (SchemaClass instanceof DomainSchema) {
      this._schemaClass = SchemaClass._schemaClass;
      this._schema = SchemaClass._schema;
    } else if (!DomainSchema._isConstructable(SchemaClass)) {
      this._wrongSchema(SchemaClass);
    } else {
      this._schemaClass = SchemaClass;
      this._schema = new SchemaClass();
      if (!(this._schema instanceof Schema)) {
        this._wrongSchema(SchemaClass);
      }
    }
  }

  keys() {
    return Object.keys(this._schema);
  }

  get name() {
    return this._schemaClass.name;
  }

  get schema() {
    return this._schema;
  }

  static isSchema(SchemaClass) {
    if (SchemaClass instanceof DomainSchema) {
      return true;
    } else if (!DomainSchema._isConstructable(SchemaClass)) {
      return false;
    } else {
      const schema = new SchemaClass();
      return schema instanceof Schema;
    }
  }

  static _isConstructable(f) {
    try {
      Reflect.construct(String, [], f);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export default DomainSchema;
