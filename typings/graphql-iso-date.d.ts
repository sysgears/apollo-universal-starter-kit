declare module 'graphql-iso-date' {
  import { GraphQLScalarTypeConfig } from 'graphql';
  import { ValueNode } from 'graphql';

  export class GraphQLDate {
    public name: string;
    public description: string;

    constructor(config: GraphQLScalarTypeConfig<any, any>);

    // Serializes an internal value to include in a response.
    public serialize(value: any): any;

    // Parses an externally provided value to use as an input.
    public parseValue(value: any): any;

    // Parses an externally provided literal value to use as an input.
    public parseLiteral(valueNode: ValueNode): any;

    public toString(): string;
  }

  export class GraphQLTime {
    public name: string;
    public description: string;

    constructor(config: GraphQLScalarTypeConfig<any, any>);

    // Serializes an internal value to include in a response.
    public serialize(value: any): any;

    // Parses an externally provided value to use as an input.
    public parseValue(value: any): any;

    // Parses an externally provided literal value to use as an input.
    public parseLiteral(valueNode: ValueNode): any;

    public toString(): string;
  }

  export class GraphQLDateTime {
    public name: string;
    public description: string;

    constructor(config: GraphQLScalarTypeConfig<any, any>);

    // Serializes an internal value to include in a response.
    public serialize(value: any): any;

    // Parses an externally provided value to use as an input.
    public parseValue(value: any): any;

    // Parses an externally provided literal value to use as an input.
    public parseLiteral(valueNode: ValueNode): any;

    public toString(): string;
  }
}
