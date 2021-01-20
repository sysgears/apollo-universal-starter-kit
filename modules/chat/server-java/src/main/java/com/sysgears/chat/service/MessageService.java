package com.sysgears.chat.service;

import com.sysgears.chat.dto.*;
import com.sysgears.chat.model.Message;
import com.sysgears.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    private final MessageRepository repository;

    @Transactional(readOnly = true)
    public Messages findAll(Pageable pageable) {
        Page<Message> messages = repository.findAll(pageable);

        List<MessageEdges> messageEdgesList = new ArrayList<>();


        for (int i = 0; i < messages.getContent().size(); i++) {
            Message message = messages.getContent().get(i);
            messageEdgesList.add(
                    MessageEdges.builder()
                            .cursor((int) (pageable.getOffset() + i))
                            .node(convert(message))
                            .build()
            );
        }

        return Messages.builder()
                .edges(messageEdgesList)
                .pageInfo(
                        MessagePageInfo.builder()
                                .endCursor((int) (pageable.getOffset() + messages.getSize() - 1))
                                .hasNextPage(!messages.isLast())
                                .build()
                )
                .totalCount(messages.getTotalElements())
                .build();
    }

    private MessagePayload convert(Message message) {
        QuotedMessage quotedMessage = new QuotedMessage(
                message.getQuoted().getId(),
                message.getQuoted().getText(),
                message.getQuoted().getUsername(),
                message.getQuoted().getAttachment().getName(),
                message.getQuoted().getAttachment().getPath()
        );
        return new MessagePayload(
                message.getId(),
                message.getText(),
                message.getUserId(),
                message.getCreatedAt().toString(),
                message.getUsername(),
                message.getUuid().toString(),
                quotedMessage.getId(),
                message.getAttachment().getName(),
                message.getAttachment().getPath(),
                quotedMessage
        );
    }
}
