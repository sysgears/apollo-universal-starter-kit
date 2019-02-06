package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CounterQuery implements GraphQLQueryResolver {

    Logger logger = LogManager.getLogger(CounterQuery.class);

    @Autowired
    private CounterRepository counterRepository;

    public Counter serverCounter() {
        logger.debug("Server counter -> Get amount");
        return counterRepository.findById(1).get(); //TODO Unsafe
    }
}
