package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.AddCommentInput;
import graphql.model.Comment;
import graphql.repository.CommentRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Component
public class CommentMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(CommentMutation.class);

    @Autowired
    private CommentRepository commentRepository;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Comment> addComment(final AddCommentInput addCommentInputPayload) {
        return CompletableFuture.supplyAsync(() -> {
            logger.debug("Started creation of a comment entity for a post with id: " + addCommentInputPayload.getPostId());

            final Comment commentEntity = Comment.builder()
                    .postId(addCommentInputPayload.getPostId())
                    .content(addCommentInputPayload.getContent())
                    .build();
            final Comment comment = commentRepository.save(commentEntity);
            logger.debug("Completed creation of a comment entity, post id: " + comment.getPostId() + ", comment id: " + comment.getId());
            return comment;
        });
    }
}
