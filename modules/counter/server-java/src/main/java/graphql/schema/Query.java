package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Counter;
import org.springframework.stereotype.Component;

@Component
public class Query implements GraphQLQueryResolver {

    public Counter getServerCounter() {
        Counter counter = new Counter();
        counter.setAmount(1); //TODO Temporary
        return counter;
    }
}
