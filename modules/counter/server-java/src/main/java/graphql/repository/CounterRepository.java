package graphql.repository;

import graphql.model.Counter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.concurrent.CompletableFuture;

@Repository
public interface CounterRepository extends JpaRepository<Counter, Integer> {

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<Counter> findOneById(Integer id);
}
