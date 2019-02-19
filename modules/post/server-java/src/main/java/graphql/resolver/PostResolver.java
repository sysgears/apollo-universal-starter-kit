package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.Post;
import org.springframework.stereotype.Component;

@Component
public class PostResolver implements GraphQLResolver<Post> {
}
