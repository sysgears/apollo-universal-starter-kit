package com.sysgears.post.dto;

import lombok.Data;

@Data
public class PostEdges {
    private Post node;
    private Integer cursor;
}
