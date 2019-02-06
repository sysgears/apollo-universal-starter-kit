package graphql.publisher;

import graphql.common.subscription.DefaultPubSubService;
import graphql.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserPubSubService extends DefaultPubSubService<User> {
}
