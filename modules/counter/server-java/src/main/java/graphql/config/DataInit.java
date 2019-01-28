package graphql.config;

import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInit implements ApplicationRunner {

    private CounterRepository counterRepository;

    @Autowired
    public DataInit(CounterRepository counterRepository) {
        this.counterRepository = counterRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        long count = counterRepository.count();

        if (count == 0) {
            counterRepository.save(Counter.builder().amount(1).build());
        }
    }
}
