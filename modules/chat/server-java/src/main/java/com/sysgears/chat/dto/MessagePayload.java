package com.sysgears.chat.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class MessagePayload {
    @NonNull
    private final Integer id;
    private final String text;
    private final Integer userId;
    private final String createdAt;
    private final String username;
    private final String uuid;
    private final Integer quotedId;
    private final String filename;
    private final String path;
    private final QuotedMessage quotedMessage;

}
