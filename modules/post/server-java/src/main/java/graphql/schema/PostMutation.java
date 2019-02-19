package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.AddPostInput;
import graphql.model.Post;
import graphql.repository.PostRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PostMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(PostMutation.class);

    @Autowired
    private PostRepository postRepository;


    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public Post addPost(AddPostInput addPostInputPayload) {
        logger.debug("Started creation of a post entity");

        final Post postEntity = new Post(null, addPostInputPayload.getTitle(), addPostInputPayload.getContent());
        final Post post = postRepository.save(postEntity);
        logger.debug("Completed creation of a post entity, post id: " + post.getId());
        return post;
    }

}
