package com.sysgears.user.resolvers;

import com.sysgears.user.constant.UserConstants;
import com.sysgears.user.dto.UserPayload;
import com.sysgears.user.dto.input.FilterUserInput;
import com.sysgears.user.dto.input.OrderByUserInput;
import com.sysgears.user.exception.UserNotFoundException;
import com.sysgears.user.model.User;
import com.sysgears.user.repository.UserRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserQueryResolver implements GraphQLQueryResolver {
    private final UserRepository userRepository;

    public CompletableFuture<User> currentUser() {
        return userRepository.findUserById(UserConstants.ID);
    }

    public CompletableFuture<UserPayload> user(int id) {
        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
            return new UserPayload(user);
        });
    }

    public CompletableFuture<List<User>> users(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter) {
        return userRepository.findByCriteria(orderBy, filter);
    }
}
