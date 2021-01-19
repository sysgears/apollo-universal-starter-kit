package com.sysgears.post.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostPageInfo {
    private Integer endCursor;
    private Boolean hasNextPage;
}
