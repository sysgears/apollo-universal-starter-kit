package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserResolver implements GraphQLResolver<User> {
}
