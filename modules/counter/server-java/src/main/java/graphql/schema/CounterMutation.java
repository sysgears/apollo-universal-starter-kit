package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPubSubService;
import graphql.repository.CounterRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static graphql.repository.SeedCounterDB.COUNTER_ID;

@Component
public class CounterMutation implements GraphQLMutationResolver {

    Logger logger = LogManager.getLogger(CounterMutation.class);

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private CounterPubSubService counterPubSubService;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public Counter addServerCounter(Integer amount) {
        Counter counter = counterRepository.findById(COUNTER_ID).get(); //TODO Unsafe
        Integer currentAmount = counter.getAmount();
        counter.setAmount(currentAmount + amount);
        logger.debug("Update amount");
        Counter savedCounter = counterRepository.save(counter);
        logger.debug("Publish element [Counter]");
        counterPubSubService.publish(savedCounter);
        return savedCounter;
    }
}
