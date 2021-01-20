package com.sysgears.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageEdges {
    private final MessagePayload node;
    private final Integer cursor;
}
