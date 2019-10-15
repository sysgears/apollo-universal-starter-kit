package graphql;

import com.graphql.spring.boot.test.GraphQLTestTemplate;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.junit.jupiter.api.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import com.graphql.spring.boot.test.GraphQLResponse;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static graphql.repository.SeedCounterDB.COUNTER_ID;
import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class QueryTest {

    @Autowired
    private GraphQLTestTemplate graphQLTestTemplate;

    @Autowired
    private CounterRepository counterRepository;

    @BeforeEach
    public void init(){
        Counter counter = counterRepository.findById(COUNTER_ID).orElse(Counter.builder().id(COUNTER_ID).amount(1).build());
        counter.setAmount(1);
        counterRepository.save(counter);
    }

    @AfterEach
    public void clean(){
        Counter counter = counterRepository.findById(COUNTER_ID).orElse(Counter.builder().id(COUNTER_ID).amount(1).build());
        counter.setAmount(1);
        counterRepository.save(counter);
    }

    @Test
    @DisplayName("Counter -> Query -> ServerCounter")
    public void serverCounter() throws InterruptedException, ExecutionException, TimeoutException, IOException {

        GraphQLResponse graphQLResponse = graphQLTestTemplate.perform("queries/get-server-counter.graphql", null);

        assertNotNull(graphQLResponse);
        assertTrue(graphQLResponse.isOk());
        assertEquals(graphQLResponse.get("$.data.serverCounter", Counter.class).getAmount(), Integer.valueOf(1));

        counterRepository.findOneById(COUNTER_ID)
            .thenApplyAsync(counter -> {
                Integer currentAmount = counter.getAmount();
                counter.setAmount(currentAmount + 10);
                return counterRepository.save(counter);
            }).get(3L, TimeUnit.SECONDS);

        graphQLResponse = graphQLTestTemplate.perform("queries/get-server-counter.graphql", null);

        assertNotNull(graphQLResponse);
        assertTrue(graphQLResponse.isOk());
        assertEquals(graphQLResponse.get("$.data.serverCounter", Counter.class).getAmount(), Integer.valueOf(11));
    }
}
