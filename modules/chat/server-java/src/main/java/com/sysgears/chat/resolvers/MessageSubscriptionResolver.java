package com.sysgears.chat.resolvers;

import com.sysgears.chat.dto.subscription.UpdateMessagesPayload;
import graphql.kickstart.tools.GraphQLSubscriptionResolver;
import lombok.RequiredArgsConstructor;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@RequiredArgsConstructor
public class MessageSubscriptionResolver implements GraphQLSubscriptionResolver {

    public CompletableFuture<Publisher<UpdateMessagesPayload>> messagesUpdated(Integer endCursor) {
        //todo implement
        return null;
    }
}
