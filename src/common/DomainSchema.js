class DomainSchema {}

export class SchemaTypes {
  static Integer = 'Types.Integer';

  static _isConstructable(f) {
    try {
      Reflect.construct(String, [], f);
    } catch (e) {
      return false;
    }
    return true;
  }

  static getSchemaInstance(f) {
    if (!SchemaTypes._isConstructable(f)) {
      return undefined;
    } else {
      const schema = new f();
      return schema instanceof DomainSchema ? schema : undefined;
    }
  }
}

export default DomainSchema;
