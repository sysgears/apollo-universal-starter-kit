package com.sysgears.post.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Posts {
    private Long totalCount;
    private List<PostEdges> edges;
    private PostPageInfo pageInfo;
}
