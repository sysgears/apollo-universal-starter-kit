package com.sysgears.post.dto;

import lombok.Data;

import java.util.List;

@Data
public class Posts {
    private Integer totalCount;
    private List<PostEdges> edges;
}
