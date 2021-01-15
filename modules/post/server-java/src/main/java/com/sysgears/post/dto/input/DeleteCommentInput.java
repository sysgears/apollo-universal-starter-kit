package com.sysgears.post.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class DeleteCommentInput {
    @NonNull
    private final Integer id;
    @NonNull
    private final Integer postId;
}
