package graphql.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditCommentInput {

    private Integer id;

    /**
     * An id of the related post. This is necessary to update the related post with subscription mechanism.
     */
    private Integer postId;

    private String content;
}
