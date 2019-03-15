package graphql.model;

import graphql.schema.*;
import org.springframework.stereotype.Component;

@Component
public class FileUpload extends GraphQLScalarType {

    public FileUpload() {
        super("FileUpload", "scalar FileUpload", new Coercing() {
            @Override
            public Object serialize(Object dataFetcherResult) throws CoercingSerializeException {
                return null;
            }

            @Override
            public Object parseValue(Object input) throws CoercingParseValueException {
                return null;
            }

            @Override
            public Object parseLiteral(Object input) throws CoercingParseLiteralException {
                return null;
            }
        });
    }
}
