package graphql.repository;

import graphql.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.concurrent.CompletableFuture;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User>, CustomUserRepository {

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<User> findOneById(Integer id);
}
