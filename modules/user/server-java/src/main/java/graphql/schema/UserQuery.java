package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.global.exception.NotFoundException;
import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;
import graphql.model.UserPayload;
import graphql.repository.UserRepository;
import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserQuery implements GraphQLQueryResolver {

    Logger logger = LogManager.getLogger(UserQuery.class);

    @Autowired
    private UserRepository userRepository;

    public User currentUser() {
        logger.debug("User -> Current User");
        return userRepository.findById(1).get(); //TODO MOCK
    }

    public UserPayload user(Integer id) {
        logger.debug("User -> User by ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("User with ID: %d not found", id)));
        return UserPayload.builder()
                .user(user)
                .build();
    }

    public List<User> users(OrderByUserInput orderBy, FilterUserInput filter) {
        return userRepository.users(orderBy, filter);
    }
}
