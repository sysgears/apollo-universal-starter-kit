package com.sysgears.user.resolvers;

import com.sysgears.core.subscription.Subscriber;
import com.sysgears.user.dto.UpdateUserPayload;
import com.sysgears.user.dto.input.FilterUserInput;
import com.sysgears.user.subscription.UserUpdatedEvent;
import graphql.kickstart.tools.GraphQLSubscriptionResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserSubscriptionResolver implements GraphQLSubscriptionResolver {
    private final Subscriber<UserUpdatedEvent> subscriber;

    public CompletableFuture<Publisher<UpdateUserPayload>> usersUpdated(Optional<FilterUserInput> filter) {
        return CompletableFuture.supplyAsync(() -> subscriber.subscribe(event -> {
            if (filter.isEmpty()) return true;

            switch (event.getMutation()) {
                case DELETE_USER:
                    return true;

                case ADD_USER:
                case EDIT_USER:
                    return filter.get().getIsActive().map(isActive ->
                            event.getUser().getIsActive().equals(isActive)).orElse(true) &&
                            filter.get().getRole().map(role ->
                                    event.getUser().getRole().toLowerCase().equals(role.toLowerCase())).orElse(true) &&
                            (filter.get().getSearchText().map(searchText ->
                                    event.getUser().getEmail().toLowerCase().equals(searchText.toLowerCase())).orElse(true) ||
                                    filter.get().getSearchText().map(searchText ->
                                            event.getUser().getUsername().toLowerCase().equals(searchText.toLowerCase())).orElse(true));

                default:
                    return false;
            }
        }).map(event -> new UpdateUserPayload(event.getMutation().getOperation(), event.getUser())));
    }
}
