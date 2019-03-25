package graphql;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.IOException;

import static graphql.repository.SeedCounterDB.COUNTER_ID;
import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MutationTest {

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
    @DisplayName("Counter -> Mutation -> AddServerCounter")
    public void addServerCounter() throws IOException {

        final ObjectMapper mapper = new ObjectMapper();
        final ObjectNode rootNode = mapper.createObjectNode();
        rootNode.put("amount", "1");

        GraphQLResponse graphQLResponse = graphQLTestTemplate.perform("mutations/add-server-counter.graphql", rootNode);

        assertNotNull(graphQLResponse);
        assertTrue(graphQLResponse.isOk());
        assertEquals(graphQLResponse.get("$.data.addServerCounter.amount", Integer.class), Integer.valueOf(2));
    }
}
