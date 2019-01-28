package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Query implements GraphQLQueryResolver {

    @Autowired
    private CounterRepository counterRepository;

    public Counter getServerCounter() {
        return counterRepository.findById(1).get(); //TODO Unsafe
    }
}
