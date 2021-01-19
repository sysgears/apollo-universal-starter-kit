package com.sysgears.post.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostEdges {
    private PostPayload node;
    private Integer cursor;
}
