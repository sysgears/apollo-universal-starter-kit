package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLSubscriptionResolver;
import graphql.common.model.Event;
import graphql.model.FilterUserInput;
import graphql.model.UpdateUserPayload;
import graphql.model.User;
import graphql.publisher.UserPubSubService;
import io.reactivex.functions.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

import static graphql.schema.OperationNames.*;

@Slf4j
@Component
class UserSubscription implements GraphQLSubscriptionResolver {

    @Autowired
    private UserPubSubService userPubSubService;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Publisher<UpdateUserPayload>> usersUpdated(FilterUserInput filter) {
        return CompletableFuture.supplyAsync(() -> userPubSubService.subscribe((Predicate<Event<User>>) event -> {
            boolean result;
                    switch (event.getName()) {
                        case DELETE_USER:
                            result = false;
                            break;

                        case ADD_USER:
                        case EDIT_USER:
                            result = filter.getIsActive().map(isActive ->
                                            event.getElement().getIsActive().equals(isActive)).orElse(true) &&
                                     filter.getRole().map(role ->
                                            event.getElement().getRole().toLowerCase().equals(role.toLowerCase())).orElse(true) &&
                                    (filter.getSearchText().map(searchText ->
                                            event.getElement().getEmail().toLowerCase().equals(searchText.toLowerCase())).orElse(true) ||
                                     filter.getSearchText().map(searchText ->
                                            event.getElement().getUsername().toLowerCase().equals(searchText.toLowerCase())).orElse(true));
                            break;

                        default:
                            result = false;
                            break;
                    }

            return result;

        }).map(event -> UpdateUserPayload.builder()
                                .node(event.getElement())
                                .mutation(event.getName())
                                .build()));
    }
}
