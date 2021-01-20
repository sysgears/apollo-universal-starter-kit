package com.sysgears.chat.resolvers;

import com.sysgears.chat.dto.MessagePayload;
import com.sysgears.chat.dto.input.AddMessageInput;
import com.sysgears.chat.dto.input.EditMessageInput;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@RequiredArgsConstructor
public class MessageMutationResolver implements GraphQLMutationResolver {

    public CompletableFuture<MessagePayload> addMessage(AddMessageInput input) {
        //todo implement
        return null;
    }

    public CompletableFuture<MessagePayload> deleteMessage(Integer id) {
        //todo implement
        return null;
    }

    public CompletableFuture<MessagePayload> editMessage(EditMessageInput input) {
        //todo implement
        return null;
    }
}
