package com.sysgears.post.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
public class PostPayload {
    @NonNull
    private final Integer id;
    @NonNull
    private final String title;
    @NonNull
    private final String content;

    private final List<CommentPayload> comments = new ArrayList<>();

    public void addComments(Collection<CommentPayload> comments) {
        this.comments.addAll(comments);
    }
}
