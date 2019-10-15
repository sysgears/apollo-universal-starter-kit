package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.global.exception.NotFoundException;
import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;
import graphql.model.UserPayload;
import graphql.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class UserQuery implements GraphQLQueryResolver {

    @Autowired
    private UserRepository userRepository;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<User> currentUser() {
        log.debug("Get current User");
        return userRepository.findOneById(1); //TODO MOCK
    }

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> user(Integer id) {
        log.debug("Get User by ID: {}", id);
        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("User with ID: %d not found", id)));
            return UserPayload.builder()
                    .user(user)
                    .build();
        });
    }

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<List<User>> users(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter) {
        log.debug("Get Users by specified params: orderBy [{}], filter [{}]", orderBy, filter);
        return userRepository.users(orderBy, filter);
    }
}
