package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.Comment;
import graphql.model.Post;
import graphql.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
public class PostResolver implements GraphQLResolver<Post> {

    @Autowired
    private CommentRepository commentRepository;

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<List<Comment>> comments(final Post post) {
        return commentRepository.findAllByPostId(post.getId());
    }
}
