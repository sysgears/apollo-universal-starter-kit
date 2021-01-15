package com.sysgears.post.dto;

import lombok.Data;

@Data
public class PostPageInfo {
    private Integer endCursor;
    private Boolean hasNextPage;
    private PostPageInfo pageInfo;
}
