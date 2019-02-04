package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPubSubService;
import graphql.repository.CounterRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static graphql.repository.DataInit.COUNTER_ID;

@Component
public class Mutation implements GraphQLMutationResolver {

    Logger logger = LogManager.getLogger(Mutation.class);

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private CounterPubSubService counterPubSubService;

    @Transactional
    public Counter addServerCounter(Integer amount) {
        Counter counter = counterRepository.findById(COUNTER_ID).get(); //TODO Unsafe
        Integer currentAmount = counter.getAmount();
        counter.setAmount(currentAmount + amount);
        logger.debug("Server counter -> Update amount");
        Counter savedCounter = counterRepository.save(counter);
        logger.debug("Server counter -> Publish element");
        counterPubSubService.publish(savedCounter);
        return savedCounter;
    }
}
