package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.AddPostInput;
import graphql.model.EditPostInput;
import graphql.model.Post;
import graphql.repository.PostRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Component
public class PostMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(PostMutation.class);

    @Autowired
    private PostRepository postRepository;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Post> addPost(final AddPostInput addPostInputPayload) {
        return CompletableFuture.supplyAsync(() -> {
            logger.debug("Started creation of a post entity");

            final Post postEntity = Post.builder()
                    .title(addPostInputPayload.getTitle())
                    .content(addPostInputPayload.getContent())
                    .build();
            final Post post = postRepository.save(postEntity);
            logger.debug("Completed creation of a post entity, post id: " + post.getId());
            return post;
        });
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Post> deletePost(final Integer postId) {
        logger.debug("Started deleting a post with id: " + postId);
        return postRepository.findOneById(postId).thenApply(postToRemove -> {
            logger.debug("Found a post with id: " + postId);
            postRepository.deleteById(postId);
            logger.debug("Completed removal of a post entity, post id: " + postId);
            return postToRemove;
        });
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Post> editPost(final EditPostInput editPostInputPayload) {
        final Integer postId = editPostInputPayload.getId();
        logger.debug("Started deleting a post with id: " + postId);
        return postRepository.findOneById(postId).thenApply(postToEdit -> {
            logger.debug("Found a post with id: " + postId);
            postToEdit.setTitle(editPostInputPayload.getTitle());
            postToEdit.setContent(editPostInputPayload.getContent());
            postRepository.save(postToEdit);
            logger.debug("Completed removal of a post entity, post id: " + postId);
            return postToEdit;
        });
    }
}
