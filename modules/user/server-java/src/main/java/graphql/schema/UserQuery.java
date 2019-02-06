package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.User;
import graphql.repository.UserRepository;
import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserQuery implements GraphQLQueryResolver {

    Logger logger = LogManager.getLogger(UserQuery.class);

    @Autowired
    private UserRepository userRepository;

    public User currentUser() {
        logger.debug("User -> Current User");
        return userRepository.findById(1).get(); //TODO MOCK
    }
}
