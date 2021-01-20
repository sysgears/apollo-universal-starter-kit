package com.sysgears.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Messages {
    private final Long totalCount;
    private final List<MessageEdges> edges;
    private final MessagePageInfo pageInfo;
}
