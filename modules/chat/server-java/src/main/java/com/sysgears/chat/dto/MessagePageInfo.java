package com.sysgears.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessagePageInfo {
    private final Integer endCursor;
    private final Boolean hasNextPage;
}
