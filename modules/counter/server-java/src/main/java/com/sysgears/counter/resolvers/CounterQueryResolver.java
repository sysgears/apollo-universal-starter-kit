package com.sysgears.counter.resolvers;

import com.sysgears.counter.constant.CounterConstants;
import graphql.kickstart.tools.GraphQLQueryResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.sysgears.counter.model.Counter;
import org.springframework.stereotype.Service;
import com.sysgears.counter.repository.CounterRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class CounterQueryResolver implements GraphQLQueryResolver {
    private final CounterRepository repository;

    @Transactional(readOnly = true)
    public CompletableFuture<Counter> serverCounter() {
        log.debug("Get counter");
        return repository.findById(CounterConstants.ID);
    }
}
