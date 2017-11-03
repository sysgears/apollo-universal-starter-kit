export class Schema {}

class DomainSchema {
  static Integer = class Integer {};
  static ID = class ID {};

  constructor(SchemaClass) {
    this._schemaClass = SchemaClass;
    this._schema = new SchemaClass();
  }

  get schema() {
    return this._schema;
  }

  static _isConstructable(f) {
    try {
      Reflect.construct(String, [], f);
    } catch (e) {
      return false;
    }
    return true;
  }

  static getSchemaInstance(f) {
    if (f instanceof DomainSchema) {
      return f.schema;
    } else if (!DomainSchema._isConstructable(f)) {
      return undefined;
    } else {
      const schema = new f();
      return schema instanceof Schema ? schema : undefined;
    }
  }
}

export default DomainSchema;
