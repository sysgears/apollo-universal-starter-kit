package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentResolver implements GraphQLResolver<Comment> {
}
