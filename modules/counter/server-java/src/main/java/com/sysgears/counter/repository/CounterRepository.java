package com.sysgears.counter.repository;

import com.sysgears.counter.model.Counter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.concurrent.CompletableFuture;

public interface CounterRepository extends JpaRepository<Counter, Integer> {
    CompletableFuture<Counter> findById(int id);
}