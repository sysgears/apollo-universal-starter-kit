package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static graphql.config.DataInit.COUNTER_ID;

@Component
public class Mutation implements GraphQLMutationResolver {

    @Autowired
    private CounterRepository counterRepository;

    @Transactional
    public Counter addServerCounter(Integer amount) {
        Counter counter = counterRepository.findById(COUNTER_ID).get(); //TODO Unsafe
        Integer currentAmount = counter.getAmount();
        counter.setAmount(currentAmount + amount);
        return counterRepository.save(counter);
    }
}
