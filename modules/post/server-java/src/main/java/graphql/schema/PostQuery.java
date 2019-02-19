package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Post;
import graphql.repository.PostRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class PostQuery implements GraphQLQueryResolver {

    private final Logger logger = LogManager.getLogger(PostQuery.class);

    @Autowired
    private PostRepository postRepository;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Post> post(final Integer id) {
        logger.debug("Started retrieving a post by its id: " + id);
        return postRepository.findOneById(id);
    }
}
